# Task Management System — Hashclick Week 3

A RESTful **Task Management API** built with Spring Boot 3, Spring Security, JWT authentication, and JPA. Uses H2 for local development and is MySQL-ready for production.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Language    | Java 17                           |
| Framework   | Spring Boot 3.2.5                 |
| Security    | Spring Security + JWT (JJWT 0.11.5) |
| Database    | H2 (dev) / MySQL (prod)           |
| ORM         | Spring Data JPA / Hibernate       |
| Build Tool  | Maven                             |

---

## Project Structure

```
src/main/java/com/hashclick/taskmanagement/
├── TaskManagementApplication.java
├── controller/
│   ├── AuthController.java        ← /api/auth/register, /login
│   └── TaskController.java        ← /api/tasks/**
├── dto/
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── TaskRequest.java
│   └── TaskResponse.java
├── enums/
│   ├── Priority.java              ← LOW, MEDIUM, HIGH
│   ├── Role.java                  ← ROLE_USER, ROLE_ADMIN
│   └── TaskStatus.java            ← TODO, IN_PROGRESS, DONE
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── model/
│   ├── User.java
│   └── Task.java
├── repository/
│   ├── UserRepository.java
│   └── TaskRepository.java
├── security/
│   ├── JwtAuthFilter.java
│   ├── JwtUtil.java
│   ├── SecurityConfig.java
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    └── TaskService.java
```

---

## How to Run

### Prerequisites
- Java 17+
- Maven 3.8+

### Run with H2 (no setup needed)
```bash
mvn spring-boot:run
```

- App URL: `http://localhost:8080`
- H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:taskdb`

### Switch to MySQL
1. Create the database:
   ```sql
   CREATE DATABASE taskdb;
   ```
2. In `src/main/resources/application.properties`, uncomment the MySQL block and comment out the H2 block.
3. Set your MySQL credentials.

---

## API Endpoints

### Authentication (No token required)

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | `/api/auth/register`  | Register a new user |
| POST   | `/api/auth/login`     | Login, receive JWT  |

#### Register
```json
POST /api/auth/register
{
  "name": "Jeevan Kumar",
  "email": "jeevan@example.com",
  "password": "password123"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "jeevan@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "jeevan@example.com",
  "name": "Jeevan Kumar",
  "role": "ROLE_USER"
}
```

---

### Tasks (JWT token required)

Add header: `Authorization: Bearer <token>`

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | `/api/tasks`                      | Create a new task                  |
| GET    | `/api/tasks`                      | Get all tasks                      |
| GET    | `/api/tasks/{id}`                 | Get task by ID                     |
| GET    | `/api/tasks/my`                   | Get tasks assigned to me           |
| GET    | `/api/tasks/status/{status}`      | Filter tasks by status             |
| PUT    | `/api/tasks/{id}`                 | Update full task                   |
| PATCH  | `/api/tasks/{id}/status?status=DONE` | Update task status              |
| PATCH  | `/api/tasks/{id}/assign?userId=2` | Assign task to a user              |
| DELETE | `/api/tasks/{id}`                 | Delete a task                      |

#### Create Task Example
```json
POST /api/tasks
Authorization: Bearer <token>

{
  "title": "Build login module",
  "description": "Implement JWT-based login for frontend",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-06-20",
  "assignedToUserId": 2
}
```

#### Task Response Example
```json
{
  "id": 1,
  "title": "Build login module",
  "description": "Implement JWT-based login for frontend",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-06-20",
  "createdAt": "2026-06-07T10:00:00",
  "updatedAt": "2026-06-07T10:00:00",
  "assignedToName": "Jeevan Kumar",
  "assignedToEmail": "jeevan@example.com",
  "createdByName": "Admin User"
}
```

---

## Access Control

| Action           | Who Can Do It                     |
|------------------|-----------------------------------|
| Register / Login | Anyone                            |
| Create task      | Any logged-in user                |
| View all tasks   | Any logged-in user                |
| Update task      | Task creator or ADMIN             |
| Delete task      | Task creator or ADMIN             |
| Update status    | Assignee, creator, or ADMIN       |
| Assign task      | Any logged-in user                |

---

## Enums

**TaskStatus:** `TODO` | `IN_PROGRESS` | `DONE`

**Priority:** `LOW` | `MEDIUM` | `HIGH`

**Role:** `ROLE_USER` | `ROLE_ADMIN`

---

## Author

**Jeevan Kumar Gujja**
Java Developer — Week 3 Training
Hashclick Solutions
