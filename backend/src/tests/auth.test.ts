import request from 'supertest';
import app from '../server';
import { auth, db } from '../firebaseAdmin';

jest.mock('../firebaseAdmin');

describe('Authentication & Authorization', () => {
  let mockCollection: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCollection = jest.fn();
    mockGet = jest.fn();

    mockCollection.mockReturnValue({
      get: mockGet,
    });

    (db.collection as jest.Mock) = mockCollection;
  });

  it('should reject requests without Firebase ID token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('should reject access to admin endpoint for Student role', async () => {
    // Mock Firebase token verification to return Student role
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(403);
  });

  it('should allow access to admin endpoint for Admin role', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'admin1', role: 'Admin' });
    mockGet.mockResolvedValue({
      docs: [{ data: () => ({ name: 'User', email: 'user@example.com', role: 'Student' }) }],
    });

    const res = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
  });
});
