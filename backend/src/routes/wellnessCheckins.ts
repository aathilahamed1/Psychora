import { Router } from 'express';
import { db } from '../firebaseAdmin';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// POST /api/wellness-checkins
router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { phq9Score, gad7Score } = req.body;
    if (phq9Score === undefined || gad7Score === undefined) {
      return res.status(400).json({ error: 'phq9Score and gad7Score are required' });
    }

    const { uid } = req.user!;
    const checkinData = {
      phq9Score,
      gad7Score,
      date: new Date(),
    };

    const docRef = await db.collection('users').doc(uid).collection('checkins').add(checkinData);
    res.status(201).json({ id: docRef.id, ...checkinData });
  } catch (error) {
    console.error('Error creating checkin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/wellness-checkins
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { uid } = req.user!;
    const checkinsSnapshot = await db.collection('users').doc(uid).collection('checkins').orderBy('date', 'desc').get();
    const checkins = checkinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(checkins);
  } catch (error) {
    console.error('Error fetching checkins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
