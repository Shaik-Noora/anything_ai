# TaskFlow - Full-Stack Task Management App

A modern, responsive, full-stack Task Management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Token (JWT), bcryptjs
- **Frontend**: React (Vite setup)
- **Styling**: Vanilla CSS (Glassmorphism, CSS Variables, Animations)
- **API UI & Testing**: Swagger UI (Local deployment available at `/api-docs`) Let's define it as Postman-ready as well since it consumes a REST architecture.

## API Endpoints

### Auth (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login and receive a JWT token

### Tasks (`/api/v1/tasks`)
- `GET /` - Get all tasks (User's own tasks, or all tasks if Admin)
- `POST /` - Create a new task
- `GET /:id` - Get task by ID
- `PUT /:id` - Update task by ID
- `DELETE /:id` - Delete task by ID

## Authentication Flow
1. **Registration**: User provides name, email, and password. The password is hashed using `bcryptjs` and stored in MongoDB.
2. **Login**: User provides email and password. Server verifies credentials using `bcrypt` and returns a JWT token.
3. **Authorization**: The token is stored in the frontend's `localStorage`. For every protected API call, the React frontend injects an `Authorization: Bearer <token>` header via an Axios interceptor.
4. **Middleware Validation**: Backend `protect` middleware verifies the token and retrieves the current user instance.

## Database Schema
- **User**: Name (String), Email (String, Unique), Password (String, Hashed), Role (Enum: 'user', 'admin').
- **Task**: Title (String), Description (String), Status (Enum: 'pending', 'in-progress', 'completed'), User (ObjectId Ref to User).

## Setup Instructions

### Backend setup
1. Navigate to the `/backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure `backend/.env` (example provided in the codebase but modify `MONGO_URI` if running MongoDB locally or in Atlas).
4. Start backend: `npm run dev` (running on `http://localhost:5000`)

### Frontend Setup
1. Navigate to the `/frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start frontend: `npm run dev`

## Scalability Notes
If you plan to scale this application for thousands of users:
- **Horizontal Scaling**: You can run multiple instances of the Node.js API server behind a Reverse Proxy / Load Balancer (like NGINX or AWS ALB).
- **Microservices**: Extract the user/auth logic into its own service separately from the task service using an event bus (RabbitMQ, Kafka).
- **Caching**: Implement Redis to cache frequent but less mutable queries (e.g. static configuration or aggregate data).
- **Database Indexing**: Create proper MongoDB indexes on `user` field in the Task schema and `email` field in the User schema to maintain rapid query execution rates.

## Notes
*This project does not include Docker integration as requested. You can find the Swagger YAML spec at `/backend/docs/swagger.yaml` for Postman/Swagger usages.*
