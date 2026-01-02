import { Router } from 'express';
import { auth as adminAuth, db } from '../firebaseAdmin';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';

const router = Router();

// GET /api/users - Admin or Super Admin
router.get('/', authenticate, authorize(['Admin', 'Super Admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/:userId/role - Super Admin only
router.put('/:userId/role', authenticate, authorize(['Super Admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params;
    const { newRole } = req.body;

    if (!newRole || !['Student', 'Moderator', 'Admin', 'Super Admin'].includes(newRole)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Enforce business rules
    if (newRole === 'Super Admin') {
      const superAdmins = await db.collection('users').where('role', '==', 'Super Admin').get();
      if (!superAdmins.empty) {
        return res.status(400).json({ error: 'There can only be one Super Admin' });
      }
    }

    if (newRole === 'Admin') {
      const admins = await db.collection('users').where('role', '==', 'Admin').get();
      if (!admins.empty) {
        return res.status(400).json({ error: 'There can only be one Admin' });
      }
    }

    if (newRole === 'Moderator') {
      const moderators = await db.collection('users').where('role', '==', 'Moderator').get();
      if (moderators.size >= 2) {
        return res.status(400).json({ error: 'There can be a maximum of two Moderators' });
      }
    }

    // Update Firestore
    await db.collection('users').doc(userId).update({ role: newRole });

    // Update custom claim
    await adminAuth.setCustomUserClaims(userId, { role: newRole });

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
