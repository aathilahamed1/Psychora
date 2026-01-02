import { Router } from 'express';
import { db } from '../firebaseAdmin';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { authorize } from '../middlewares/authorize';

const router = Router();

// GET /api/posts - Authenticated users
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts - Authenticated users
router.post('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const newPost = {
      author: 'Anonymous',
      content,
      createdAt: new Date(),
    };

    const docRef = await db.collection('posts').add(newPost);
    res.status(201).json({ id: docRef.id, ...newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/posts/:postId - Moderator, Admin, Super Admin
router.delete('/:postId', authenticate, authorize(['Moderator', 'Admin', 'Super Admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const { postId } = req.params;
    await db.collection('posts').doc(postId).delete();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/posts/:postId/report - Authenticated users
router.post('/:postId/report', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { postId } = req.params;
    const { uid } = req.user!;

    // Check if already reported
    const reportDoc = await db.collection('posts').doc(postId).collection('reports').doc(uid).get();
    if (reportDoc.exists) {
      return res.status(400).json({ error: 'Already reported' });
    }

    await db.collection('posts').doc(postId).collection('reports').doc(uid).set({
      reportedAt: new Date(),
    });

    res.json({ message: 'Report submitted' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
