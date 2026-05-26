# NSQTech Corporate Dashboard Assignment

This is a complete full-stack Single Page Application (SPA) built to simulate a slightly older, corporate-style internal access management dashboard. It uses a traditional enterprise design pattern, explicitly avoiding modern AI-generated "neon" or "glassmorphism" templates. 

## Technology Stack
- **Frontend**: Angular 17 (configured using classic `NgModule` architecture to emulate Angular 12+ structure), SCSS, RxJS.
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose.

## Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB server)
- Angular CLI (`npm install -g @angular/cli`)

### 1. MongoDB Setup
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a new cluster and navigate to **Database Access**. Create a new database user and save the credentials.
3. Navigate to **Network Access** and whitelist your current IP address (or `0.0.0.0/0` for development).
4. Go to **Databases** -> **Connect** -> **Connect your application** and copy the Connection String.

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Paste your MongoDB connection string into the `.env` file:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/nsqtech?retryWrites=true&w=majority
   PORT=3000
   ```
5. Seed the database with test accounts and dummy records:
   ```bash
   node seed.js
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm start
   ```

## Test Accounts
The database seeder automatically generates these accounts for testing role-based routing and permissions:
- **Admin**: `admin1` / `password123`
- **General User**: `user1` / `password123`

---

## Features & Verification Checklist

- [x] **Role-Based Routing**: General Users cannot access the `/admin` panel. Protected by `AuthGuard` and backend `authMiddleware`.
- [x] **API Delay Simulation**: A global express middleware simulates slow network connections. The frontend gracefully handles this using RxJS `BehaviorSubjects` to render CSS skeleton loaders.
- [x] **Async Processing Demonstration**: Built-in RxJS `retry(2)` and `catchError` logic in the `ApiService` to handle network instability.
- [x] **MongoDB Integration**: Robust Mongoose schemas, secure connection handling, and live data mutation.
- [x] **UI Consistency**: Hand-written SCSS stylesheets using modular variables. No massive UI libraries. Responsive, compact, and enterprise-grade.

## API Documentation

The backend runs on `http://localhost:3000` by default. You can append `?delay=2000` to any endpoint to simulate a 2-second network delay.

### Authentication
- `POST /api/auth/login`: Authenticate a user. Requires `userId`, `password`, and `role`. Returns a session token.
- `GET /api/auth/profile`: Fetch the current user profile. Requires `Authorization: Bearer <token>`.

### Records (Protected)
- `GET /api/records`: Fetch records. Supports optional pagination (`?page=1&limit=10`). 
  - **Admin**: Returns all records.
  - **General User**: Returns only records assigned to them.
- `GET /api/records/:id`: Fetch a single record. General users will receive a `403 Forbidden` if they try to fetch a record they don't own.

### Admin Management (Protected + Admin Only)
- `GET /api/admin/users`: Fetch all system users.
- `POST /api/admin/users`: Create a new system user.
- `PUT /api/admin/users/:id`: Edit a user's details.
- `DELETE /api/admin/users/:id`: Delete a user. Cannot delete the currently logged-in account.
