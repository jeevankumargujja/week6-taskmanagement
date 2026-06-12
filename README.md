# Task Management System — Hashclick Week 3 + Week 4

A full-stack **Task Management System** built with Spring Boot 3, Spring Security, JWT authentication, Role-Based Access Control, and a responsive frontend UI.

---

## Live Demo
> 🚀 Deployment in progress — link will be updated after Railway deployment

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Language     | Java 17                             |
| Framework    | Spring Boot 3.2.5                   |
| Security     | Spring Security + JWT (JJWT 0.11.5) |
| Database     | H2 (dev) / MySQL (prod)             |
| ORM          | Spring Data JPA / Hibernate         |
| Build Tool   | Maven                               |
| API Docs     | Swagger / OpenAPI 3 (springdoc)     |
| Frontend     | HTML, CSS, Vanilla JavaScript       |
| Deployment   | Railway (Cloud)                     |

---

## Week 3 Features

- JWT Authentication (Register / Login)
- Task CRUD (Create, Read, Update, Delete)
- Task filtering by status, priority, search
- Due date support
- Assign tasks to users
- Role enum — `ROLE_USER` / `ROLE_ADMIN`
- H2 in-memory database (dev)
- MySQL ready (prod)
- Responsive frontend UI

---

## Week 4 Features (Advanced)

### 1. Role-Based Access Control (RBAC)
- `@PreAuthorize` enforced on all endpoints
- **ADMIN** — sees all tasks, manages users, assigns tasks, views dashboard stats
- **USER** — sees only their own tasks (created or assigned)
- Admin-only endpoints secured at both controller and security config level

### 2. Admin Panel (Frontend)
- Visible only to ADMIN users after login
- Lists all registered users with ID, Name, Email, Role, Task count
- **Promote/Demote** user roles (Make Admin / Make User)
- **Delete** users directly from the UI

### 3. Overdue Task Detection
- Every task response includes an `overdue` flag
- Overdue tasks show a red **⏰ OVERDUE** badge on the card
- Red border highlight on overdue task cards
- Overdue counter in the stats bar
- Filter dropdown to view **Overdue Only** tasks

### 4. Notifications
- `NotificationService` — sends email on task assignment
- Logs to console by default (email disabled in dev)
- Enable real emails by setting `notifications.email.enabled=true`
- Daily scheduled job at 8 AM — alerts assignees of overdue tasks

### 5. Input Validation
- `@Valid` on all request bodies
- Field-level constraints (`@NotBlank`, `@Size`, `@Email`)
- Global exception handler returns clean validation error messages

### 6. Swagger / OpenAPI Documentation
- Live API docs at `/swagger-ui.html`
- All endpoints documented with descriptions
- JWT Bearer auth integrated into Swagger UI
- Endpoints grouped by: **Auth**, **Tasks**, **Admin**

### 7. Deployment
- `application-prod.properties` — production profile with env variable support
- `railway.json` + `Procfile` — Railway cloud deployment config
- `.env.example` — reference for all required environment variables

---

## Project Structure

```
src/main/java/com/hashclick/taskmanagement/
├── TaskManagementApplication.java
├── config/
│   └── OpenApiConfig.java             ← Swagger/OpenAPI config (Week 4)
├── controller/
│   ├── AuthController.java            ← /api/auth/**
│   ├── TaskController.java            ← /api/tasks/**
│   └── AdminController.java           ← /api/admin/** (Week 4)
├── dto/
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── TaskRequest.java
│   ├── TaskResponse.java              ← overdue flag added (Week 4)
│   ├── UserResponse.java              ← (Week 4)
│   └── DashboardStats.java            ← (Week 4)
├── enums/
│   ├── Priority.java
│   ├── Role.java
│   └── TaskStatus.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── model/
│   ├── User.java
│   └── Task.java
├── repository/
│   ├── UserRepository.java
│   └── TaskRepository.java            ← overdue queries added (Week 4)
├── security/
│   ├── JwtAuthFilter.java
│   ├── JwtUtil.java
│   ├── SecurityConfig.java            ← RBAC + Swagger rules (Week 4)
│   └── UserDetailsServiceImpl.java
└── service/
    ├── AuthService.java
    ├── TaskService.java               ← RBAC-aware logic (Week 4)
    ├── AdminService.java              ← (Week 4)
    ├── NotificationService.java       ← (Week 4)
    └── OverdueAlertScheduler.java     ← (Week 4)
```

---

## How to Run Locally

### Prerequisites
- Java 17+
- Maven 3.8+ (or use `mvnw.cmd`)

### Run with H2 (no setup needed)
```bash
mvn spring-boot:run
```

| URL | Description |
|-----|-------------|
| `http://localhost:8080` | Frontend UI |
| `http://localhost:8080/swagger-ui.html` | Swagger API Docs |
| `http://localhost:8080/h2-console` | H2 Database Console |

### Make yourself Admin (H2 Console)
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
```

---

## API Endpoints

### Authentication (No token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, receive JWT |

### Tasks (JWT required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/tasks` | USER, ADMIN | Create a task |
| GET | `/api/tasks` | USER, ADMIN | Get tasks (admin: all, user: own) |
| GET | `/api/tasks/{id}` | USER, ADMIN | Get task by ID |
| GET | `/api/tasks/my` | USER, ADMIN | Get my assigned tasks |
| GET | `/api/tasks/overdue` | USER, ADMIN | Get overdue tasks |
| GET | `/api/tasks/status/{status}` | USER, ADMIN | Filter by status |
| PUT | `/api/tasks/{id}` | Creator, ADMIN | Update task |
| PATCH | `/api/tasks/{id}/status` | Assignee, Creator, ADMIN | Update status |
| PATCH | `/api/tasks/{id}/assign` | **ADMIN only** | Assign task to user |
| DELETE | `/api/tasks/{id}` | Creator, ADMIN | Delete task |

### Admin (ADMIN role only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/{id}` | Get user by ID |
| PATCH | `/api/admin/users/{id}/role` | Change user role |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/stats` | Dashboard statistics |

---

## Access Control Summary

| Action | ROLE_USER | ROLE_ADMIN |
|--------|-----------|------------|
| Register / Login | ✅ | ✅ |
| Create task | ✅ | ✅ |
| View own tasks | ✅ | ✅ |
| View all tasks | ❌ | ✅ |
| Update own task | ✅ | ✅ |
| Delete own task | ✅ | ✅ |
| Assign task to user | ❌ | ✅ |
| Manage users | ❌ | ✅ |
| View dashboard stats | ❌ | ✅ |

---

## Deployment (Railway)

1. Push code to GitHub
2. Connect repo to [Railway](https://railway.app)
3. Add MySQL plugin
4. Set environment variables:

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=<railway mysql url>
DB_USERNAME=<db user>
DB_PASSWORD=<db password>
JWT_SECRET=<long random string>
SWAGGER_ENABLED=true
```

---

## Enums

**TaskStatus:** `TODO` | `IN_PROGRESS` | `DONE`

**Priority:** `LOW` | `MEDIUM` | `HIGH`

**Role:** `ROLE_USER` | `ROLE_ADMIN`

---

## Author

**Jeevan Kumar Gujja**
Java Developer Trainee — Week 3 & Week 4
Hashclick Solutions LLC
