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

## Screenshots

### Login page:
<img width="1316" height="674" alt="image" src="https://github.com/user-attachments/assets/c800b512-a30c-4d9f-be47-3aa191eaaf60" />

### Register page:
<img width="1284" height="652" alt="image" src="https://github.com/user-attachments/assets/ac18d2c7-5221-4e95-a57a-a4aebf392942" />

### Tasks dashboard:
<img width="872" height="1048" alt="image" src="https://github.com/user-attachments/assets/180f8add-b709-4e29-8e48-4273c4f3ddc5" />

### Admin panel:
<img width="1100" height="1746" alt="image" src="https://github.com/user-attachments/assets/866f63dd-425e-409a-9979-054d183747de" />


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
