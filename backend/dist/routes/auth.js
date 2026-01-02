"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAdmin_1 = require("../firebaseAdmin");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// POST /api/auth/session
router.post('/session', auth_1.authenticate, async (req, res) => {
    try {
        const { uid } = req.user;
        // Check if user exists in Firestore
        const userDoc = await firebaseAdmin_1.db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            // New user, create profile
            const userRecord = await firebaseAdmin_1.auth.getUser(uid);
            const userData = {
                name: userRecord.displayName || 'Anonymous',
                email: userRecord.email,
                createdAt: new Date(),
                role: 'Student',
            };
            await firebaseAdmin_1.db.collection('users').doc(uid).set(userData);
            // Set custom claim
            await firebaseAdmin_1.auth.setCustomUserClaims(uid, { role: 'Student' });
            res.json({ message: 'User profile created successfully' });
        }
        else {
            res.json({ message: 'Session verified' });
        }
    }
    catch (error) {
        console.error('Error in /session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map