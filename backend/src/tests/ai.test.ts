import request from 'supertest';
import app from '../server';
import { auth } from '../firebaseAdmin';

jest.mock('../firebaseAdmin');
jest.mock('../services/aiService');

const mockGenerateSupportChat = jest.fn();
const mockInterpretScores = jest.fn();
const mockProactiveInsights = jest.fn();

jest.mock('../services/aiService', () => ({
  generateSupportChatResponse: mockGenerateSupportChat,
  interpretWellnessScoresResponse: mockInterpretScores,
  proactiveWellnessInsightsResponse: mockProactiveInsights,
}));

describe('AI Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject unauthenticated requests', async () => {
    const res = await request(app).post('/api/ai/support-chat');
    expect(res.status).toBe(401);
  });

  it('should accept authenticated support-chat request', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });
    mockGenerateSupportChat.mockResolvedValue({ text: 'This is a mock AI response for support chat.' });

    const res = await request(app)
      .post('/api/ai/support-chat')
      .set('Authorization', 'Bearer valid-token')
      .send({ userInput: 'Hello', chatHistory: [] });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ text: 'This is a mock AI response for support chat.' });
  });

  it('should accept authenticated interpret-scores request', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });
    mockInterpretScores.mockResolvedValue({ summary: 'Mock wellness scores interpretation summary.' });

    const res = await request(app)
      .post('/api/ai/interpret-scores')
      .set('Authorization', 'Bearer valid-token')
      .send({ phq9Score: 5, gad7Score: 3 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ summary: 'Mock wellness scores interpretation summary.' });
  });

  it('should accept authenticated proactive-insights request', async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user1', role: 'Student' });
    mockProactiveInsights.mockResolvedValue({
      recommendedPathwayId: 'mindfulness-basics',
      insightRationale: 'Mock rationale for proactive insights.'
    });

    const res = await request(app)
      .post('/api/ai/proactive-insights')
      .set('Authorization', 'Bearer valid-token')
      .send({
        interactionPatterns: {
          recentLoginTimes: [],
          resourceAccessLog: [],
          forumActivityLevel: 'normal'
        },
        availablePathwayIds: ['mindfulness-basics', 'exam-stress']
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      recommendedPathwayId: 'mindfulness-basics',
      insightRationale: 'Mock rationale for proactive insights.'
    });
  });
});
