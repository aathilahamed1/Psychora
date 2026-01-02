import express from 'express';
import { db } from '../firebaseAdmin';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// GET /api/sessions - Get user's session history
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const sessionsRef = db.collection('sessions').where('userId', '==', userId).orderBy('date', 'desc');
    const snapshot = await sessionsRef.get();
    const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST /api/sessions - Create a new session (for admin or system)
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { counselorName, date, status } = req.body;
    const sessionRef = db.collection('sessions').doc();
    await sessionRef.set({
      userId,
      counselorName,
      date: new Date(date),
      status,
    });
    res.json({ id: sessionRef.id, message: 'Session created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

export default router;
