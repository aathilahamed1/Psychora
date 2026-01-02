"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAdmin_1 = require("../firebaseAdmin");
const auth_1 = require("../middlewares/auth");
const authorize_1 = require("../middlewares/authorize");
const router = (0, express_1.Router)();
// GET /api/users - Admin or Super Admin
router.get('/', auth_1.authenticate, (0, authorize_1.authorize)(['Admin', 'Super Admin']), async (req, res) => {
    try {
        const usersSnapshot = await firebaseAdmin_1.db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// PUT /api/users/:userId/role - Super Admin only
router.put('/:userId/role', auth_1.authenticate, (0, authorize_1.authorize)(['Super Admin']), async (req, res) => {
    try {
        const { userId } = req.params;
        const { newRole } = req.body;
        if (!newRole || !['Student', 'Moderator', 'Admin', 'Super Admin'].includes(newRole)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        // Enforce business rules
        if (newRole === 'Super Admin') {
            const superAdmins = await firebaseAdmin_1.db.collection('users').where('role', '==', 'Super Admin').get();
            if (!superAdmins.empty) {
                return res.status(400).json({ error: 'There can only be one Super Admin' });
            }
        }
        if (newRole === 'Admin') {
            const admins = await firebaseAdmin_1.db.collection('users').where('role', '==', 'Admin').get();
            if (!admins.empty) {
                return res.status(400).json({ error: 'There can only be one Admin' });
            }
        }
        if (newRole === 'Moderator') {
            const moderators = await firebaseAdmin_1.db.collection('users').where('role', '==', 'Moderator').get();
            if (moderators.size >= 2) {
                return res.status(400).json({ error: 'There can be a maximum of two Moderators' });
            }
        }
        // Update Firestore
        await firebaseAdmin_1.db.collection('users').doc(userId).update({ role: newRole });
        // Update custom claim
        await firebaseAdmin_1.auth.setCustomUserClaims(userId, { role: newRole });
        res.json({ message: 'Role updated successfully' });
    }
    catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map