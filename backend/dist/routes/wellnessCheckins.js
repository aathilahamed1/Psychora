"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebaseAdmin_1 = require("../firebaseAdmin");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// POST /api/wellness-checkins
router.post('/', auth_1.authenticate, async (req, res) => {
    try {
        const { phq9Score, gad7Score } = req.body;
        if (phq9Score === undefined || gad7Score === undefined) {
            return res.status(400).json({ error: 'phq9Score and gad7Score are required' });
        }
        const { uid } = req.user;
        const checkinData = {
            phq9Score,
            gad7Score,
            date: new Date(),
        };
        const docRef = await firebaseAdmin_1.db.collection('users').doc(uid).collection('checkins').add(checkinData);
        res.status(201).json({ id: docRef.id, ...checkinData });
    }
    catch (error) {
        console.error('Error creating checkin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// GET /api/wellness-checkins
router.get('/', auth_1.authenticate, async (req, res) => {
    try {
        const { uid } = req.user;
        const checkinsSnapshot = await firebaseAdmin_1.db.collection('users').doc(uid).collection('checkins').orderBy('date', 'desc').get();
        const checkins = checkinsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(checkins);
    }
    catch (error) {
        console.error('Error fetching checkins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=wellnessCheckins.js.map