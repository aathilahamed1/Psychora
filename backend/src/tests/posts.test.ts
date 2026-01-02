import request from 'supertest';
import app from '../server';
import { auth, db } from '../firebaseAdmin';

jest.mock('../firebaseAdmin');

describe('Peer Support Forum', () => {
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockSet: jest.Mock;
  let mockOrderBy: jest.Mock;
  let mockGet: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCollection = jest.fn();
    mockDoc = jest.fn();
    mockSet = jest.fn();
    mockOrderBy = jest.fn();
    mockGet = jest.fn();
    mockDelete = jest.fn();

    mockCollection.mockReturnValue({
      doc: mockDoc,
      orderBy: mockOrderBy,
    });

    mockDoc.mockReturnValue({
      set: mockSet,
      delete: mockDelete,
    });

    mockOrderBy.mockReturnValue({
      get: mockGet,
    });

    (db.collection as jest.Mock) = mockCollection;
  });

  it('should allow authenticated user to create post', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });
    mockSet.mockResolvedValue(undefined);
    mockDoc.mockReturnValue({ set: mockSet, id: 'post1' });

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', 'Bearer valid-token')
      .send({ content: 'Test post' });

    expect(res.status).toBe(201);
  });

  it('should allow authenticated user to read posts', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });
    mockGet.mockResolvedValue({
      docs: [{ data: () => ({ content: 'Test', author: 'Anonymous' }) }],
    });

    const res = await request(app)
      .get('/api/posts')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
  });

  it('should allow Moderator to delete post', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'mod1', role: 'Moderator' });
    mockDelete.mockResolvedValue(undefined);

    const res = await request(app)
      .delete('/api/posts/post1')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(200);
  });

  it('should reject delete by Student', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });

    const res = await request(app)
      .delete('/api/posts/post1')
      .set('Authorization', 'Bearer valid-token');

    expect(res.status).toBe(403);
  });
});
