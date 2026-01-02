# Psychora Backend

This is the backend server for the Psychora mental wellness application, built with Node.js, Express.js, and TypeScript. It uses Firebase for authentication and Firestore for data storage.

## Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables:**
   - Copy `.env.example` to `.env`
   - Fill in the required values:
     - `FIREBASE_SERVICE_ACCOUNT_KEY_PATH`: Path to your Firebase service account JSON file. Download it from Firebase Console > Project Settings > Service Accounts > Generate new private key.
     - `FIREBASE_PROJECT_ID`: Your Firebase project ID.
     - `GOOGLE_AI_API_KEY`: Your Google Generative AI API key from Google AI Studio.
     - `PORT`: Server port (default 4000).

3. **Firebase Setup:**
   - Enable Authentication with Email/Password and Google providers in Firebase Console.
   - Create Firestore database.
   - For the first Super Admin, manually set a user's role to 'Super Admin' in Firestore (users/{uid} document).

4. **Build and Run:**
   ```bash
   npm run build
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/session`: Verify user session and create profile if new.

### Users
- `GET /api/users`: Get all users (Admin/Super Admin).
- `PUT /api/users/:userId/role`: Update user role (Super Admin).

### Posts
- `GET /api/posts`: Get all posts.
- `POST /api/posts`: Create a new post.
- `DELETE /api/posts/:postId`: Delete a post (Mod/Admin/Super).
- `POST /api/posts/:postId/report`: Report a post.

### AI
- `POST /api/ai/support-chat`: Get AI support chat response.
- `POST /api/ai/interpret-scores`: Interpret wellness scores.
- `POST /api/ai/proactive-insights`: Get proactive wellness insights.

### Wellness Check-ins
- `POST /api/wellness-checkins`: Create a new check-in.
- `GET /api/wellness-checkins`: Get user's check-ins.

## Security

- All endpoints except `/health` require authentication via Firebase ID token in Authorization header.
- Role-based access control for sensitive operations.
- Rate limiting and CORS enabled.

## Testing

Use tools like Postman or curl to test the endpoints. Ensure to include the Authorization header with `Bearer <idToken>` for authenticated requests.
