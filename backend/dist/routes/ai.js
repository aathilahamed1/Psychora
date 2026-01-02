"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const aiService_1 = require("../services/aiService");
const router = (0, express_1.Router)();
// POST /api/ai/support-chat
router.post('/support-chat', auth_1.authenticate, async (req, res) => {
    try {
        const { userInput, chatHistory = [] } = req.body;
        if (!userInput) {
            return res.status(400).json({ error: 'userInput is required' });
        }
        const response = await (0, aiService_1.generateSupportChatResponse)(userInput, chatHistory);
        res.json(response);
    }
    catch (error) {
        console.error('Error in support-chat:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/ai/interpret-scores
router.post('/interpret-scores', auth_1.authenticate, async (req, res) => {
    try {
        const { phq9Score, phq9Level, gad7Score, gad7Level } = req.body;
        if (phq9Score === undefined ||
            !phq9Level ||
            gad7Score === undefined ||
            !gad7Level) {
            return res.status(400).json({ error: 'Missing required scores or levels' });
        }
        const response = await (0, aiService_1.interpretWellnessScoresResponse)(phq9Score, phq9Level, gad7Score, gad7Level);
        res.json(response);
    }
    catch (error) {
        console.error('Error in interpret-scores:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST /api/ai/proactive-insights
router.post('/proactive-insights', auth_1.authenticate, async (req, res) => {
    try {
        const { interactionPatterns, availablePathwayIds } = req.body;
        if (!interactionPatterns || !availablePathwayIds) {
            return res.status(400).json({ error: 'Missing required data' });
        }
        const response = await (0, aiService_1.proactiveWellnessInsightsResponse)(interactionPatterns, availablePathwayIds);
        res.json(response);
    }
    catch (error) {
        console.error('Error in proactive-insights:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=ai.js.map