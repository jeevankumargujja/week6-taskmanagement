# Task Management System — Hashclick Solutions

> **Training Program | Week 3 + Week 4**
> Java Developer Trainee — Jeevan Kumar Gujja

---

## Live Demo
🌐 **Live URL:** https://week3-taskmanagement.onrender.com

🔗 **Swagger API Docs:** https://week3-taskmanagement.onrender.com/swagger-ui.html

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
| Deployment   | Render (Cloud, Docker-based)        |

---

---

# WEEK 3 — Core Task Management System

> **Focus:** Build a secure REST API with JWT authentication and full Task CRUD

---

## Week 3 — What Was Built

### Authentication
- User Registration (`/api/auth/register`)
- User Login with JWT token (`/api/auth/login`)
- BCrypt password encoding
- JWT token validation on every request

### Task Management (CRUD)
- Create, Read, Update, Delete tasks
- Assign tasks to users
- Filter tasks by status
- Search tasks by title/description
- Due date support

### Data Models
- **User** — id, name, email, password, role
- **Task** — id, title, description, status, priority, dueDate, assignedTo, createdBy

### Enums
- **TaskStatus** — `TODO` | `IN_PROGRESS` | `DONE`
- **Priority** — `LOW` | `MEDIUM` | `HIGH`
- **Role** — `ROLE_USER` | `ROLE_ADMIN`

### Security
- Stateless JWT-based authentication
- Spring Security filter chain
- Protected routes (all `/api/tasks/**` require token)

### Frontend UI
- Login / Register page
- Task dashboard with stats bar
- Create / Edit task modal
- Status update modal
- Filter by status, priority, search

### Database
- H2 in-memory (development)
- MySQL-ready configuration (production)

---

## Week 3 — Files Added

```
controller/  AuthController.java, TaskController.java
service/     AuthService.java, TaskService.java
model/       User.java, Task.java
dto/         AuthResponse, LoginRequest, RegisterRequest, TaskRequest, TaskResponse
repository/  UserRepository.java, TaskRepository.java
security/    JwtAuthFilter, JwtUtil, SecurityConfig, UserDetailsServiceImpl
enums/       Role.java, Priority.java, TaskStatus.java
exception/   GlobalExceptionHandler.java, ResourceNotFoundException.java
resources/   application.properties
static/      index.html (frontend)
```

---

## Week 3 — API Endpoints

### Authentication (No token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tasks (JWT token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| GET | `/api/tasks/my` | Get my assigned tasks |
| GET | `/api/tasks/status/{status}` | Filter tasks by status |
| PUT | `/api/tasks/{id}` | Update full task |
| PATCH | `/api/tasks/{id}/status` | Update task status only |
| PATCH | `/api/tasks/{id}/assign` | Assign task to a user |
| DELETE | `/api/tasks/{id}` | Delete a task |

---

---

# WEEK 4 — Advanced Features + Deployment

> **Focus:** RBAC enforcement, notifications, admin panel, Swagger docs, cloud deployment

---

## Week 4 — What Was Added

### 1. Role-Based Access Control (RBAC)
- Added `@PreAuthorize` annotations on all endpoints
- **ADMIN** — sees all tasks, manages all users, assigns tasks, views stats
- **USER** — sees only their own tasks (created or assigned to them)
- Admin-only routes locked at both controller level and security config
- `PATCH /api/tasks/{id}/assign` — restricted to ADMIN only

### 2. Admin Controller & Service
- New `/api/admin/**` endpoints (ADMIN only)
- List all users with task counts
- Change user roles (promote/demote)
- Delete users
- Dashboard statistics (total users, tasks, overdue count)

### 3. Admin Panel (Frontend)
- Visible only when logged in as ADMIN
- User management table — ID, Name, Email, Role, Task count
- **Make Admin / Make User** buttons to toggle roles
- **Delete user** button with confirmation

### 4. Overdue Task Detection
- `overdue` flag added to every `TaskResponse`
- Tasks past due date with status not DONE are marked overdue
- Red **⏰ OVERDUE** badge shown on task cards
- Red border highlight on overdue cards
- Overdue counter added to stats bar (shown in red)
- **Overdue Only** filter added to toolbar
- Daily scheduled job runs at 8 AM — alerts users of overdue tasks

### 5. Email Notifications
- `NotificationService` — sends email when task is assigned
- Async execution (`@Async`) — non-blocking
- Logs to console by default (email disabled in dev)
- Enable real emails via `notifications.email.enabled=true`
- Overdue email alerts sent by scheduler daily

### 6. Input Validation (Enhanced)
- `@Valid` enforced on all request bodies
- Field constraints — `@NotBlank`, `@Size`, `@Email`, `@FutureOrPresent`
- Global exception handler returns structured validation error responses

### 7. Swagger / OpenAPI Documentation
- Live API docs at `/swagger-ui.html`
- All endpoints documented with summaries
- JWT Bearer auth integrated — click **Authorize** and paste token
- Endpoints grouped by tag: **Authentication**, **Tasks**, **Admin**
- OpenAPI spec available at `/v3/api-docs`

### 8. Production Deployment Config
- `application-prod.properties` — all values from environment variables
- `Dockerfile` — Two-stage build used for Render's Docker deployment
- `Procfile` — process definition for deployment
- `.env.example` — reference file for all required env vars
- `@EnableScheduling` + `@EnableAsync` added to main application class

---

## Week 4 — New Files Added

```
controller/  AdminController.java
service/     AdminService.java, NotificationService.java, OverdueAlertScheduler.java
dto/         UserResponse.java, DashboardStats.java
config/      OpenApiConfig.java
resources/   application-prod.properties
             Dockerfile, .env.example
```

## Week 4 — Files Modified

```
controller/  TaskController.java       → added @PreAuthorize on all endpoints
service/     TaskService.java          → RBAC-aware queries, overdue logic, notifications
repository/  TaskRepository.java       → added overdue queries, countByStatus
dto/         TaskResponse.java         → added overdue flag, assignedToId
security/    SecurityConfig.java       → added Swagger routes, /api/admin/** rule
             TaskManagementApplication → added @EnableScheduling, @EnableAsync
resources/   application.properties   → added mail config, Swagger config
static/      index.html               → admin panel, overdue badge, overdue filter, overdue stat
pom.xml                               → added springdoc-openapi, spring-boot-starter-mail
```

---

## Week 4 — API Endpoints

### Admin (ADMIN role only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/{id}` | Get user by ID |
| PATCH | `/api/admin/users/{id}/role?role=ADMIN` | Change user role |
| DELETE | `/api/admin/users/{id}` | Delete a user |
| GET | `/api/admin/stats` | Dashboard statistics |

### New Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/overdue` | Get overdue tasks |

---

## Week 4 — Access Control

| Action | ROLE_USER | ROLE_ADMIN |
|--------|-----------|------------|
| Register / Login | ✅ | ✅ |
| Create task | ✅ | ✅ |
| View own tasks | ✅ | ✅ |
| View ALL tasks | ❌ | ✅ |
| Update own task | ✅ | ✅ |
| Delete own task | ✅ | ✅ |
| Assign task to user | ❌ | ✅ |
| View overdue tasks | own only | all tasks |
| Manage users | ❌ | ✅ |
| View dashboard stats | ❌ | ✅ |

---

---

# How to Run Locally

```bash
# Build
mvn clean package -DskipTests

# Run
java -jar target/task-management-1.0.0.jar
```

| URL | Description |
|-----|-------------|
| `http://localhost:8080` | Frontend UI |
| `http://localhost:8080/swagger-ui.html` | Swagger API Docs |
| `http://localhost:8080/h2-console` | H2 Database Console |

### Make yourself Admin (H2 Console)
```
JDBC URL: jdbc:h2:mem:taskdb
Username: sa
Password: (leave empty)
```
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
```

---

# Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → Login with GitHub
3. New → Web Service → Connect the GitHub repo
4. Environment: **Docker** (uses the project's `Dockerfile`)
5. Set environment variables (optional — defaults to H2 if omitted):

```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<long random string>
SWAGGER_ENABLED=true

# Optional — only needed to switch from H2 to MySQL
DATABASE_URL=<your MySQL JDBC URL>
DB_USERNAME=<your MySQL username>
DB_PASSWORD=<your MySQL password>
DB_DRIVER=com.mysql.cj.jdbc.Driver
JPA_DIALECT=org.hibernate.dialect.MySQLDialect
```

6. Click **Create Web Service** — Render builds the Docker image and deploys automatically
7. Every push to the connected branch triggers an auto-redeploy

---

## Author

**Jeevan Kumar Gujja**
Java Developer
Hashclick Solutions LLC
