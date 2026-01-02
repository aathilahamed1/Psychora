"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebaseAdmin_1 = require("../firebaseAdmin");
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await firebaseAdmin_1.auth.verifyIdToken(idToken);
        req.user = {
            uid: decodedToken.uid,
            role: decodedToken.role || 'Student', // Default to Student if no role
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map