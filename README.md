# Dev-Hub Task Manager

A modern, cross-platform task management application built with React Native and Expo.

## Features

- ✅ Full CRUD operations for tasks
- ✅ Task filtering by status and creation date
- ✅ SQLite database for local storage
- ✅ Modern UI with safe area support for notched devices
- ✅ Responsive design for mobile devices

## Tech Stack

### Frontend

- React Native 0.81.5
- Expo SDK 54
- React 19.1.0
- SQLite for local database

### Backend

- Node.js + Express
- SQLite database
- RESTful API

## Project Structure

```
Native-try/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── db/             # Database setup
│   └── data/               # SQLite database files
└── frontend/               # React Native app
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── screens/        # App screens
    │   └── api/           # API client
    └── assets/            # Static assets
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. **Backend Setup:**

   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npx expo start
   ```

## Building for Production

### Android APK

```bash
cd frontend
npx eas build --platform android
```

### iOS

```bash
cd frontend
npx eas build --platform ios
```

## API Endpoints

- `GET /api/tasks` - Get all tasks with optional filters
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Database Schema

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## License

This project is licensed under the MIT License.
