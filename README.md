# Task Management System — Hashclick Solutions

> **Training Program | Week 3 → Week 6**
> Java Developer Trainee — Jeevan Kumar Gujja

---

## Live Demo

- **Live URL:** https://week3-taskmanagement.onrender.com
- **Swagger API Docs:** https://week3-taskmanagement.onrender.com/swagger-ui.html
- **GitHub Repo:** https://github.com/jeevankumargujja/week6-taskmanagement

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

# WEEK 3 — Core Task Management System

> **Focus:** Build a secure REST API with JWT authentication and full Task CRUD

## What Was Built

### Authentication
- User Registration (`/api/auth/register`)
- User Login with JWT token (`/api/auth/login`)
- BCrypt password encoding
- JWT token validation on every request

### Task Management (CRUD)
- Create, Read, Update, Delete tasks
- Assign tasks to users
- Filter tasks by status
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

## Week 3 — API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tasks

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

# WEEK 4 — Advanced Features + Deployment

> **Focus:** RBAC enforcement, notifications, admin panel, Swagger docs, cloud deployment

## What Was Added

### 1. Role-Based Access Control (RBAC)
- `@PreAuthorize` on all endpoints
- **ADMIN** — sees all tasks, manages all users, assigns tasks, views stats
- **USER** — sees only their own tasks (created or assigned)

### 2. Admin Controller & Service
- `/api/admin/**` endpoints (ADMIN only)
- List all users, change roles, delete users
- Dashboard statistics

### 3. Overdue Task Detection
- `overdue` flag on every `TaskResponse`
- Daily scheduled job alerts users of overdue tasks

### 4. Email Notifications
- Sends email when task is assigned (`@Async`)
- Overdue alerts sent daily by scheduler

### 5. Swagger / OpenAPI Documentation
- Live docs at `/swagger-ui.html`
- JWT Bearer auth integrated

### 6. Cloud Deployment
- Dockerfile, Procfile, `application-prod.properties`
- Deployed on Render

## Week 4 — API Endpoints

### Admin (ADMIN only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/{id}/role` | Change user role |
| DELETE | `/api/admin/users/{id}` | Delete a user |
| GET | `/api/admin/stats` | Dashboard statistics |

### New Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/overdue` | Get overdue tasks |

## Week 4 — Access Control

| Action | ROLE_USER | ROLE_ADMIN |
|--------|-----------|------------|
| Register / Login | ✅ | ✅ |
| Create task | ✅ | ✅ |
| View own tasks | ✅ | ✅ |
| View ALL tasks | ❌ | ✅ |
| Assign task to user | ❌ | ✅ |
| Manage users | ❌ | ✅ |
| View dashboard stats | ❌ | ✅ |

---

# WEEK 5 — Microservices Architecture

> **Focus:** Decompose monolith into microservices with API Gateway and service communication

## What Was Added

### Microservices Design
- Identified service boundaries: Auth, Task, Notification, Admin
- Designed inter-service communication patterns
- API Gateway pattern for routing and authentication
- Service discovery concepts

### Architecture Improvements
- Separation of concerns per service domain
- Independent deployability of each service
- Fault tolerance and resilience patterns
- Load balancing concepts

---

# WEEK 6 — Database Integration & Performance

> **Focus:** Advanced JPA/Hibernate, entity relationships, query optimization, pagination

## What Was Added

### New Entities & Relationships

```
User ──< Project ──< Task ──< Comment
         (owner)   (project)  (task, author→User)
```

| Entity | Relationship | Target |
|--------|-------------|--------|
| Project | ManyToOne | User (owner) |
| Project | OneToMany | Task |
| Task | ManyToOne | Project |
| Task | OneToMany | Comment |
| Comment | ManyToOne | Task |
| Comment | ManyToOne | User (author) |

### Database Schema (MySQL)
- Production-ready DDL in `schema.sql`
- FK constraints with `ON DELETE CASCADE / SET NULL`
- Indexes on `status`, `due_date`, `assigned_to`, `project_id`
- Composite index on `(due_date, status)` for overdue queries
- `utf8mb4` charset for full Unicode support

### Sample Data (`data.sql`)
- 4 users (1 admin, 3 regular)
- 4 projects (ACTIVE, ON_HOLD, COMPLETED)
- 10 tasks across projects
- 8 comments on various tasks

### Query Optimization
- `@EntityGraph` — eliminates N+1 queries on task/comment lists
- `@Transactional(readOnly = true)` — optimizes read-only operations
- Paginated `Page<T>` responses on all list endpoints
- `searchByKeyword` — case-insensitive JPQL keyword search
- `countByStatusForProject` — aggregate stats without loading entities
- HikariCP connection pool configured

### Exception Handling (Enhanced)
- `DuplicateResourceException` → HTTP 409 Conflict
- `MethodArgumentTypeMismatchException` handler
- `MissingServletRequestParameterException` handler

## Week 6 — New API Endpoints

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create a new project |
| GET | `/api/projects` | Get all projects (paginated) |
| GET | `/api/projects/{id}` | Get project by ID |
| PUT | `/api/projects/{id}` | Update a project |
| DELETE | `/api/projects/{id}` | Delete a project |
| GET | `/api/projects/{id}/tasks` | Get tasks in a project (paginated) |
| GET | `/api/projects/{id}/stats` | Task status stats for a project |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/{id}/comments` | Add a comment to a task |
| GET | `/api/tasks/{id}/comments` | Get all comments on a task |
| PUT | `/api/comments/{id}` | Update a comment (author/admin) |
| DELETE | `/api/comments/{id}` | Delete a comment (author/admin) |

### Task Enhancements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/paged` | Paginated task list |
| GET | `/api/tasks/search?keyword=` | Keyword search across tasks |

## Week 6 — Files Added

```
model/       Project.java, Comment.java
repository/  ProjectRepository.java, CommentRepository.java
service/     ProjectService.java, CommentService.java
controller/  ProjectController.java, CommentController.java
dto/         ProjectRequest.java, ProjectResponse.java
             CommentRequest.java, CommentResponse.java
             PagedResponse.java
exception/   DuplicateResourceException.java
resources/   schema.sql, data.sql
tests/       ProjectRepositoryTest, CommentRepositoryTest
             ProjectServiceTest, CommentServiceTest
```

## Week 6 — Test Results

| Test Class | Tests | Result |
|-----------|-------|--------|
| ProjectRepositoryTest | 4 | ✅ All Pass |
| CommentRepositoryTest | 4 | ✅ All Pass |
| ProjectServiceTest | 4 | ✅ All Pass |
| CommentServiceTest | 4 | ✅ All Pass |
| **Total** | **15** | **✅ All Pass** |

---

# How to Run Locally

```bash
# Clone
git clone https://github.com/jeevankumargujja/week6-taskmanagement.git
cd week6-taskmanagement

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

### H2 Console (Dev)
```
JDBC URL:  jdbc:h2:mem:taskdb
Username:  sa
Password:  (leave empty)
```

### Make yourself Admin
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'your@email.com';
```

### Switch to MySQL (Production)
Set these environment variables:
```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/taskmanagement_db?useSSL=false&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```
Then run `schema.sql` against your MySQL instance first.

---

# Deployment (Render)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect the GitHub repo
4. Environment: **Docker**
5. Set environment variables:

```
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<long random string>
DATABASE_URL=<MySQL JDBC URL>
DB_USERNAME=<username>
DB_PASSWORD=<password>
```

6. Click **Create Web Service** — auto-deploys on every push

---

# Project Structure

```
src/
├── main/
│   ├── java/com/hashclick/taskmanagement/
│   │   ├── config/          OpenApiConfig.java
│   │   ├── controller/      AuthController, TaskController, AdminController
│   │   │                    ProjectController, CommentController
│   │   ├── dto/             Request/Response DTOs, PagedResponse
│   │   ├── enums/           Role, TaskStatus, Priority
│   │   ├── exception/       GlobalExceptionHandler, ResourceNotFoundException
│   │   │                    DuplicateResourceException
│   │   ├── model/           User, Task, Project, Comment
│   │   ├── repository/      UserRepository, TaskRepository
│   │   │                    ProjectRepository, CommentRepository
│   │   ├── security/        JwtAuthFilter, JwtUtil, SecurityConfig
│   │   └── service/         AuthService, TaskService, AdminService
│   │                        ProjectService, CommentService
│   │                        NotificationService, OverdueAlertScheduler
│   └── resources/
│       ├── application.properties
│       ├── application-prod.properties
│       ├── schema.sql        ← MySQL DDL with indexes
│       ├── data.sql          ← Sample data
│       └── static/index.html ← Frontend UI
└── test/
    └── java/com/hashclick/taskmanagement/
        ├── repository/      ProjectRepositoryTest, CommentRepositoryTest
        └── service/         ProjectServiceTest, CommentServiceTest
```

---

## Author

**Jeevan Kumar Gujja**
Java Developer Trainee
Hashclick Solutions LLC
