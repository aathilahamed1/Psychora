# Psychora - A Firebase Studio Project

This is a Next.js application designed to be a comprehensive mental wellness companion for students. It was prototyped and developed in Firebase Studio.

## Getting Started

To get a copy of this project running on your local machine, you will need to have [Node.js](https://nodejs.org/) and [git](https://git-scm.com/) installed

### 1. Clone the Repository

First, clone the project from its repository to your local machine. Open your terminal, navigate to the directory where you want to store the project, and run the following command:

```bash
git clone <YOUR_REPOSITORY_URL>
```
*Replace `<YOUR_REPOSITORY_URL>` with the actual URL of your project's git repository.*

### 2. Navigate to the Project Directory

Once the cloning is complete, move into the project folder:

```bash
cd <PROJECT_FOLDER_NAME>
```
*The project folder name is usually the same as the repository name.*

### 3. Install Dependencies

The project uses several libraries that need to be installed. Run the following command to install them:

```bash
npm install
```

This will download all the necessary packages defined in the `package.json` file.

### 4. Set Up Environment Variables

This project requires a connection to a Firebase project.

1.  Create a new file named `.env.local` in the root of your project directory.
2.  Follow the Firebase setup instructions to get your `firebaseConfig` object.
3.  Add your Firebase project configuration to the `.env.local` file. It should look something like this, but with your actual keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
```

### 5. Run the Development Server

Now you are ready to start the application. Run the following command:

```bash
npm run dev
```

This will start the Next.js development server. You can view your application by opening your web browser and navigating to [http://localhost:9002](http://localhost:9002).

The application will automatically reload if you make any changes to the source files.

---

## Uploading to GitHub

If you have this project locally and want to publish it to your own GitHub repository, follow these steps.

### Step 1: Create a New Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **"New repository"**.
3.  Give your repository a name (e.g., `psychora-app`).
4.  Choose "Public" or "Private".
5.  **Important:** Do **NOT** initialize the repository with a README, .gitignore, or license. Your project already contains these files.
6.  Click **"Create repository"**.

### Step 2: Push Your Local Project to GitHub

After creating the repository, GitHub will display a page with several commands. You want the section titled **"...or push an existing repository from the command line"**.

1.  Open your terminal or command prompt in the root directory of your Psychora project.
2.  Run the following commands one by one. Replace `<YOUR_REPOSITORY_URL>` with the URL you see on your new GitHub repository page (it will look like `https://github.com/your-username/psychora-app.git`).

```bash
# Initialize git if it hasn't been already
git init -b main

# Add all files to be tracked by git
git add .

# Create your first commit
git commit -m "Initial commit"

# Link your local project to the remote GitHub repository
git remote add origin <YOUR_REPOSITORY_URL>

# Push your code to GitHub
git push -u origin main
```

After these commands complete, refresh your GitHub repository page. You should see all of your project files.

Co-author test update
