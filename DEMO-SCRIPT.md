# Final Presentation — Demo Script
**Jeevan Kumar Gujja | Hashclick Solutions | Week 3 + Week 4**

---

## Before You Start (Setup)
- Open browser with these tabs ready:
  1. `https://week3-taskmanagement.onrender.com`
  2. `https://week3-taskmanagement.onrender.com/swagger-ui.html`
- Open PowerPoint slides
- Note: First load on Render may take 30-50 seconds (free tier spin-up)

---

## PART 1 — Slides (5-7 minutes)

### Slide 1 — Title
> "Good morning/afternoon. My name is Jeevan Kumar Gujja.
> Today I'm presenting my Week 3 and Week 4 project —
> a full-stack Task Management System built with Spring Boot."

### Slide 2 — Agenda
> "I'll cover the tech stack, then walk through Week 3 and Week 4 features,
> show the live deployment, and end with a demo."

### Slide 3 — Tech Stack
> "The backend is built on Java 17 with Spring Boot 3.
> Spring Security handles authentication using JWT tokens.
> I used H2 for local development and the app is MySQL-ready for production.
> Swagger UI provides live API documentation."

### Slide 4 — Week 3
> "Week 3 focused on the core system.
> I built JWT-based register and login, full task CRUD operations,
> and a responsive frontend UI — all in a single Spring Boot application."

### Slide 5 — Week 4
> "Week 4 added the advanced features.
> The biggest addition is RBAC — Role-Based Access Control —
> where I actually enforced the roles using @PreAuthorize annotations.
> I also added an Admin Panel, overdue task detection with alerts,
> email notifications, Swagger documentation, and deployed to the cloud."

### Slide 6 — RBAC Table
> "This table shows exactly who can do what.
> Regular users can only see and manage their own tasks.
> Admins can see all tasks, assign tasks, manage users, and view statistics.
> Every endpoint is protected — if you try to access an admin route as a user,
> you get a 403 Forbidden response."

### Slide 7 — Deployment
> "The app is live at this URL on Render.
> I used Docker for containerization — the Dockerfile builds the JAR
> and runs it with the production profile.
> Every push to GitHub triggers an automatic redeploy."

### Slide 8 — API Endpoints
> "The API has three groups — Auth endpoints are public,
> Task endpoints require a JWT token,
> and Admin endpoints require ROLE_ADMIN.
> The /api/tasks/overdue endpoint is new in Week 4."

### Slide 9 — Project Structure
> "Standard Spring Boot layered architecture —
> Controllers handle HTTP, Services handle business logic,
> Repositories handle database queries.
> Files marked W4 are new additions from Week 4."

### Slide 10 — Evaluation Criteria
> "This maps directly to the evaluation criteria.
> Technical implementation covers RBAC, notifications, and deployment.
> Code quality is shown in the architecture and validation approach.
> Documentation is the Swagger UI and the detailed README."

---

## PART 2 — Live Demo (5-7 minutes)

### Step 1 — Open the App
> "Let me show you the live application."
- Open `https://week3-taskmanagement.onrender.com`
- Wait for it to load (may take 30 seconds first time)

### Step 2 — Register & Login as User
> "I'll register a new user first."
- Click Register tab
- Fill in: Name = `Demo User`, Email = `demo@test.com`, Password = `demo123`
- Click Create Account
> "I'm now logged in as a regular USER."
- Show the USER badge in the top right
- Show stats bar — Total, To Do, In Progress, Done, High Priority, Overdue

### Step 3 — Create Tasks
> "Let me create a couple of tasks."
- Click + New Task
- Task 1: Title = `Fix login bug`, Priority = HIGH, Due Date = yesterday's date, Status = IN PROGRESS
- Click Create → show the **OVERDUE badge** appears immediately
> "Notice the red OVERDUE badge and the overdue counter in the stats bar —
> this is calculated automatically based on the due date."

- Create Task 2: Title = `Write unit tests`, Priority = MEDIUM, Due Date = next week

### Step 4 — Show Overdue Filter
> "I can filter to see only overdue tasks."
- Click the All Tasks dropdown → select Overdue Only
- Show only the overdue task appears
- Reset filter to All Tasks

### Step 5 — Show Status Update
> "Assignees and creators can update the task status."
- Click Status on a task
- Change to DONE → click Update
- Show the stats bar updates

### Step 6 — Login as Admin
> "Now let me show the Admin features."
- Logout
- Login with admin credentials (use jeevankumargujja@gmail.com or pre-created admin)
- Show **ADMIN badge** in navbar
- Show **Admin — User Management panel** at the top

### Step 7 — Admin Panel Demo
> "As admin, I can see all users, their roles, and their task counts.
> I can promote a user to admin or demote them back.
> I can also delete users."
- Show the user table
- Click Make Admin on demo user → show it changes to ADMIN badge
- Click Make User → changes back

### Step 8 — Show All Tasks as Admin
> "As admin, I can see ALL tasks from ALL users — not just my own."
- Show tasks from both users in the grid

---

## PART 3 — Swagger UI (2-3 minutes)

- Open `https://week3-taskmanagement.onrender.com/swagger-ui.html`
> "This is the Swagger UI — live interactive API documentation.
> Every endpoint is documented with its description, parameters, and response format."

- Show the 3 groups: Authentication, Tasks, Admin
- Click on POST /api/auth/login → Show Try it out
- Click on Authorize button → show JWT integration
> "I can paste my JWT token here and test all protected endpoints directly from the browser.
> This makes it very easy for frontend developers or testers to explore the API."

---

## Closing
> "To summarize:
> Week 3 gave us the foundation — secure REST API with JWT auth and task management.
> Week 4 added RBAC enforcement, admin panel, notifications, Swagger docs, and live deployment.
> The live URL is https://week3-taskmanagement.onrender.com
> Thank you — I'm happy to take any questions."

---

## Common Questions & Answers

**Q: Why H2 database in production instead of MySQL?**
> H2 is used for the free deployment demo. The app is MySQL-ready — just set the DATABASE_URL environment variable and it switches automatically via the prod profile.

**Q: How does the JWT token work?**
> After login, the server generates a signed JWT token with the user's email and role. Every subsequent request includes this token in the Authorization header. The JwtAuthFilter validates the token before each request.

**Q: What happens if a USER tries to access an admin endpoint?**
> Spring Security returns a 403 Forbidden response. The @PreAuthorize("hasRole('ADMIN')") annotation checks the role from the JWT token.

**Q: How do notifications work?**
> When a task is assigned, NotificationService sends an email asynchronously using @Async so it doesn't slow down the API response. In dev mode it logs to console. In production, set notifications.email.enabled=true with Gmail credentials.

**Q: How is the app deployed?**
> Via Docker on Render. The Dockerfile builds the Spring Boot JAR using Maven, then runs it with the prod profile. Render auto-deploys on every GitHub push.
