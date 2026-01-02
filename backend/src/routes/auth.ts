import { Router } from 'express';
import { auth as adminAuth, db } from '../firebaseAdmin';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// POST /api/auth/session
router.post('/session', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { uid } = req.user!;

    // Check if user exists in Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // New user, create profile
      const userRecord = await adminAuth.getUser(uid);
      const userData = {
        name: userRecord.displayName || 'Anonymous',
        email: userRecord.email!,
        createdAt: new Date(),
        role: 'Student',
      };

      await db.collection('users').doc(uid).set(userData);

      // Set custom claim
      await adminAuth.setCustomUserClaims(uid, { role: 'Student' });

      res.json({ message: 'User profile created successfully' });
    } else {
      res.json({ message: 'Session verified' });
    }
  } catch (error) {
    console.error('Error in /session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
