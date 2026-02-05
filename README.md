# TaskMaster Pro

**TaskMaster Pro** is a full-stack task management application built to demonstrate real-world backend and frontend development skills, including authentication, authorization, CRUD operations and role-based access control.

The project showcases a clean architecture, secure JWT authentication and a modern React frontend connected to a REST API.

---

## Features

### Authentication & Authorization
- User registration and login
- Password hashing with **bcrypt**
- JWT-based authentication
- Protected routes
- Role-based access control (**user / admin**)

### Tasks Management
- Create, read, update, and delete tasks
- Task ownership enforcement (users can only access their own tasks)
- Task attributes: status, priority, due date
- Server-side validation and error handling

### Admin Panel
- List all users
- Change user roles (user ↔ admin)
- View all tasks with owner details

### General
- MongoDB database running in **Docker**
- Centralized error handling
- Clean project structure (controllers, routes, middleware)
- Environment-based configuration
- Minimal, functional React UI

---

## Tech Stack

### Backend
- **Node.js**
- **Express**
- **MongoDB** (via Docker)
- **Mongoose**
- **JWT (jsonwebtoken)**
- **bcrypt**
- **dotenv**
- **cors**

### Frontend
- **React**
- **Vite**
- **React Router**
- Fetch API
- LocalStorage for auth token

### Dev & Tools
- Docker
- Git & GitHub
- Postman (API testing)

---

## Running the Project Locally

### 1. Start MongoDB with Docker

```bash
docker run -d \
  --name taskmaster-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=adminpass \
  mongo:7
```

For subsequent runs:
```bash
docker start taskmaster-mongo
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs at:
```bash
http://localhost:4000
```

Health check:
```bash
GET /health
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:
```bash
http://localhost:5173
```

---

## Environment Variables

**Backend** (*backend/.env.example*)

```bash
PORT=4000
MONGODB_URI=mongodb://admin:adminpass@localhost:27017/taskmasterpro?authSource=admin
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

**Frontend** (*frontend/.env.example*)

```bash
VITE_API_URL=http://localhost:4000
```

---

## Main API Endpoints

### Auth

- *POST /api/auth/register*

- *POST /api/auth/login*

- *GET /api/auth/me*

### Tasks (Protected)

- *POST /api/tasks*

- *GET /api/tasks*

- *GET /api/tasks/:id*

- *PATCH /api/tasks/:id*

- *DELETE /api/tasks/:id*

### Admin (Admin only)

- *GET /api/admin/users*

- *PATCH /api/admin/users/:id/role*

- *GET /api/admin/tasks*

---

## Purpose of the Project

This project was built as a **portfolio project** to demonstrate:

- Full-stack development skills

- Secure authentication and authorization

- REST API design

- Clean code organization

- Practical usage of React with a real backend

---

## Future Improvements

- Pagination and filtering

- Automated tests (Jest + Supertest)

- API documentation (Swagger/OpenAPI)

- Deployment (Render + Vercel)

---

## Author

**Diana Buzescu**

Computer Science Engineering Student | Aspiring Full-Stack Engineer

[LinkedIn](https://www.linkedin.com/in/diana-buzescu-b02a97290/)
