"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.auth = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;
if (!serviceAccountPath) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not defined in .env');
}
const serviceAccount = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve(serviceAccountPath), 'utf-8'));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
    });
}
exports.auth = firebase_admin_1.default.auth();
exports.db = firebase_admin_1.default.firestore();
//# sourceMappingURL=firebaseAdmin.js.map