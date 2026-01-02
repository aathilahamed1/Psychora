import express from 'express';
import { db } from '../firebaseAdmin';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// GET /api/pathways/completed - Get user's completed pathways
router.get('/completed', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const pathwaysRef = db.collection('userPathways').where('userId', '==', userId).where('completed', '==', true);
    const snapshot = await pathwaysRef.get();
    const pathways = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(pathways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch completed pathways' });
  }
});

// POST /api/pathways/complete - Mark a pathway as completed
router.post('/complete', authenticate, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    const { pathwayId } = req.body;
    const pathwayRef = db.collection('userPathways').doc(`${userId}_${pathwayId}`);
    await pathwayRef.set({
      userId,
      pathwayId,
      completed: true,
      completedAt: new Date(),
    });
    res.json({ message: 'Pathway marked as completed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete pathway' });
  }
});

export default router;
