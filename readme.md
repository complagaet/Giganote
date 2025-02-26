# Giganote

![Main page](https://raw.githubusercontent.com/complagaet/Giganote/refs/heads/main/images/1.png)
![Admin page](https://raw.githubusercontent.com/complagaet/Giganote/refs/heads/main/images/2.png)

## Overview
Giganote is a task management application built with Node.js and Express. It provides user authentication, task management, and admin control features.

## Setup Instructions
### Prerequisites
- Node.js (latest stable version)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/complagaet/Giganote.git
   cd Giganote
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```env
   PORT=service_port
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```sh
   npm start
   ```
   For development mode with auto-restart:
   ```sh
   npm test
   ```

## API Documentation
### Authentication
- `POST /api/register` - Register a new user
    - Request Body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`
    - Response: `{ "message": "User created successfully." }`
- `POST /api/login` - Login and receive a JWT token
    - Request Body: `{ "email": "user@example.com", "password": "password123" }`
    - Response: `{ "message": "Login successfully.", "token": "jwt_token_here" }`

### User
- `GET /api/user` - Retrieve user details (requires authentication)
    - Headers: `{ Authorization: "<token>" }`
    - Response: `{ "username": "user", "email": "user@example.com" }`

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/user/:id` - Update user details (admin only)
    - Request Body (example): `{ "status": "ban", "banReason": "Violation of terms" }`
- `DELETE /api/admin/user/:id` - Delete a user and all their tasks (admin only)
- `GET /api/admin/user/:id/tasks` - Retrieve tasks of a specific user (admin only)

### Tasks
- `POST /api/task` - Create a new task (requires authentication)
    - Request Body: `{ "title": "Task 1", "content": "Task details" }`
    - Response: `{ "message": "Task saved." }`
- `PATCH /api/task/:id` - Update a task
    - Request Body (example): `{ "title": "Updated Title" }`
- `GET /api/tasks` - Retrieve all tasks of the authenticated user
- `GET /api/task/:id` - Retrieve details of a specific task
- `DELETE /api/task/:id` - Delete a task

