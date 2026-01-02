import request from 'supertest';
import app from '../server';
import { auth, db } from '../firebaseAdmin';

jest.mock('../firebaseAdmin');

describe('User Management', () => {
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockGet: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockWhere: jest.Mock;
  let mockWhereGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCollection = jest.fn();
    mockDoc = jest.fn();
    mockGet = jest.fn();
    mockUpdate = jest.fn();
    mockWhere = jest.fn();
    mockWhereGet = jest.fn();

    mockCollection.mockReturnValue({
      doc: mockDoc,
      where: mockWhere,
    });

    mockDoc.mockReturnValue({
      get: mockGet,
      update: mockUpdate,
    });

    mockWhere.mockReturnValue({
      get: mockWhereGet,
    });

    (db.collection as jest.Mock) = mockCollection;
  });

  it('should allow Super Admin to change user role', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'superadmin', role: 'Super Admin' });
    mockGet.mockResolvedValue({ exists: true, data: () => ({ role: 'Student' }) });
    mockUpdate.mockResolvedValue(undefined);
    mockWhereGet.mockResolvedValue({ docs: [] }); // No other Super Admin
    (auth.setCustomUserClaims as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app)
      .put('/api/users/user1/role')
      .set('Authorization', 'Bearer valid-token')
      .send({ newRole: 'Moderator' });

    expect(res.status).toBe(200);
  });

  it('should reject role change to second Super Admin', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'superadmin', role: 'Super Admin' });
    mockGet.mockResolvedValue({ exists: true, data: () => ({ role: 'Student' }) });
    mockUpdate.mockResolvedValue(undefined);
    mockWhereGet.mockResolvedValue({ docs: [{ id: 'existingSuper' }] }); // Already one Super Admin

    const res = await request(app)
      .put('/api/users/user1/role')
      .set('Authorization', 'Bearer valid-token')
      .send({ newRole: 'Super Admin' });

    expect(res.status).toBe(400);
  });

  it('should reject role change by non-Super Admin', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'admin', role: 'Admin' });

    const res = await request(app)
      .put('/api/users/user1/role')
      .set('Authorization', 'Bearer valid-token')
      .send({ newRole: 'Moderator' });

    expect(res.status).toBe(403);
  });
});
