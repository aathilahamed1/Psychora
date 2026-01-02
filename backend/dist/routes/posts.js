"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAdmin_1 = require("../firebaseAdmin");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
// GET /api/posts - Authenticated users
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const postsSnapshot = await firebaseAdmin_1.db.collection('posts').orderBy('createdAt', 'desc').get();
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/posts - Authenticated users
router.post('/', auth_1.authenticate, async (req, res) => {
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
        const docRef = await firebaseAdmin_1.db.collection('posts').add(newPost);
        res.status(201).json({ id: docRef.id, ...newPost });
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// DELETE /api/posts/:postId - Moderator, Admin, Super Admin
router.delete('/:postId', auth_1.authenticate, (0, authorize_1.authorize)(['Moderator', 'Admin', 'Super Admin']), async (req, res) => {
    try {
        const { postId } = req.params;
        await firebaseAdmin_1.db.collection('posts').doc(postId).delete();
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/posts/:postId/report - Authenticated users
router.post('/:postId/report', auth_1.authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const { uid } = req.user;
        // Check if already reported
        const reportDoc = await firebaseAdmin_1.db.collection('posts').doc(postId).collection('reports').doc(uid).get();
        if (reportDoc.exists) {
            return res.status(400).json({ error: 'Already reported' });
        }
        await firebaseAdmin_1.db.collection('posts').doc(postId).collection('reports').doc(uid).set({
            reportedAt: new Date(),
        });
        res.json({ message: 'Report submitted' });
    }
    catch (error) {
        console.error('Error reporting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=posts.js.map