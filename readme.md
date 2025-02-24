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
   git clone <repository_url>
   cd Giganote-main
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
- `POST /register` - Register a new user
    - Request Body: `{ "username": "user", "email": "user@example.com", "password": "password123" }`
    - Response: `{ "message": "User created successfully." }`
- `POST /login` - Login and receive a JWT token
    - Request Body: `{ "email": "user@example.com", "password": "password123" }`
    - Response: `{ "message": "Login successfully.", "token": "jwt_token_here" }`

### User
- `GET /user` - Retrieve user details (requires authentication)
    - Headers: `{ Authorization: "Bearer <token>" }`
    - Response: `{ "username": "user", "email": "user@example.com" }`

### Admin
- `GET /admin/users` - Get all users (admin only)
- `PATCH /admin/user/:id` - Update user details (admin only)
    - Request Body (example): `{ "status": "banned", "banReason": "Violation of terms" }`
- `DELETE /admin/user/:id` - Delete a user and all their tasks (admin only)
- `GET /admin/user/:id/tasks` - Retrieve tasks of a specific user (admin only)

### Tasks
- `POST /task` - Create a new task (requires authentication)
    - Request Body: `{ "title": "Task 1", "content": "Task details" }`
    - Response: `{ "message": "Task saved." }`
- `PATCH /task/:id` - Update a task
    - Request Body (example): `{ "title": "Updated Title" }`
- `GET /tasks` - Retrieve all tasks of the authenticated user
- `GET /task/:id` - Retrieve details of a specific task
- `DELETE /task/:id` - Delete a task

