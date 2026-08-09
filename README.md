# InstaClon

InstaClon is a full-stack web application inspired by Instagram, featuring a modern, dynamic user interface. It provides users with the ability to share posts, like and comment on content, and follow other users.

## Features
- **User Authentication**: Secure registration and login.
- **Dynamic Feed**: View posts from all users in a modern, responsive feed.
- **Image Uploads**: Upload local images for your posts and profile pictures.
- **Interactions**: Like posts and leave comments in real-time.
- **Social Graph**: Follow and unfollow other users, with profile statistics (followers/following).
- **Profile Customization**: Edit your biography and profile picture.

## Tech Stack
- **Frontend**: React (with Vite) using Vanilla CSS for a sleek, glassmorphism-inspired design.
- **Backend**: Java Spring Boot, exposing RESTful APIs.
- **Database**: Configured for MySQL in production, with an H2 in-memory fallback for local development.

## Setup & Local Development

### Prerequisites
- Node.js (v18+)
- Java JDK (17+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd ParcialFinalAvanzada
   ```
2. Run the Spring Boot application using the local profile (uses H2 Database):
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```
   The API will be available at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5174` (or similar).

## Deployment

### Backend (Railway)
1. Link your GitHub repository in Railway.
2. Ensure the Root Directory is set to `/ParcialFinalAvanzada`.
3. Provision a MySQL database and set the environment variables (`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

### Frontend (Vercel)
1. Import the repository in Vercel.
2. Set the Root Directory to `/frontend`.
3. Add the `VITE_API_URL` environment variable pointing to your Railway backend URL.

## License
MIT
