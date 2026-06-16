const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Jeevan Kumar Gujja";
pres.title = "Task Management System - Hashclick Week 3 & 4";

// Color palette - Ocean Gradient (professional, tech feel)
const C = {
  dark:    "0A1628",  // deep navy - title/dark slides
  primary: "1B4F9C",  // blue - headers
  accent:  "0EA5E9",  // sky blue - highlights
  light:   "F0F7FF",  // light blue tint - backgrounds
  white:   "FFFFFF",
  muted:   "64748B",
  text:    "1E293B",
  green:   "22C55E",
  red:     "EF4444",
  amber:   "F59E0B",
  card:    "FFFFFF",
};

const makeShadow = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 45, opacity: 0.12 });

// ─────────────────────────────────────────────
// SLIDE 1 — Title Slide
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Top accent circle
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: "1B4F9C", transparency: 75 }, line: { color: "1B4F9C", transparency: 75 } });
  s.addShape(pres.shapes.OVAL, { x: -1, y: 2.5, w: 3.5, h: 3.5, fill: { color: "0EA5E9", transparency: 80 }, line: { color: "0EA5E9", transparency: 80 } });

  s.addText("TASK MANAGEMENT SYSTEM", { x: 0.6, y: 1.2, w: 8.8, h: 0.5, fontSize: 13, color: C.accent, bold: true, charSpacing: 4, align: "left" });
  s.addText("Week 3 + Week 4", { x: 0.6, y: 1.75, w: 8, h: 1.1, fontSize: 48, color: C.white, bold: true, align: "left" });
  s.addText("Final Project Presentation", { x: 0.6, y: 2.9, w: 8, h: 0.5, fontSize: 18, color: "94A3B8", align: "left" });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.55, w: 2.5, h: 0.05, fill: { color: C.accent }, line: { color: C.accent } });

  s.addText([
    { text: "Jeevan Kumar Gujja", options: { bold: true, breakLine: true } },
    { text: "Java Developer Trainee  |  Hashclick Solutions LLC", options: {} }
  ], { x: 0.6, y: 3.75, w: 8, h: 0.9, fontSize: 14, color: "94A3B8", align: "left" });

  s.addNotes("Introduce yourself. Say: Today I'll walk you through my Week 3 and Week 4 project — a full-stack Task Management System built with Spring Boot, JWT security, Role-Based Access Control, and deployed live on Render.");
}

// ─────────────────────────────────────────────
// SLIDE 2 — Agenda
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Agenda", { x: 0.5, y: 0.35, w: 9, h: 0.6, fontSize: 32, color: C.dark, bold: true });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9, h: 0.04, fill: { color: C.light }, line: { color: C.light } });

  const items = [
    { num: "01", title: "Project Overview", desc: "Tech stack & architecture" },
    { num: "02", title: "Week 3 — Core Features", desc: "JWT auth, Task CRUD, Frontend UI" },
    { num: "03", title: "Week 4 — Advanced Features", desc: "RBAC, Notifications, Admin Panel, Swagger" },
    { num: "04", title: "Live Deployment", desc: "Render cloud deployment + live demo" },
    { num: "05", title: "API Documentation", desc: "Swagger UI walkthrough" },
  ];

  items.forEach((item, i) => {
    const x = 0.5;
    const y = 1.15 + i * 0.84;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 9, h: 0.72, fill: { color: i % 2 === 0 ? C.light : "F8FAFC" }, line: { color: "E2E8F0" }, rectRadius: 0.08 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.12, y: y + 0.12, w: 0.48, h: 0.48, fill: { color: C.primary }, line: { color: C.primary }, rectRadius: 0.06 });
    s.addText(item.num, { x: x + 0.12, y: y + 0.12, w: 0.48, h: 0.48, fontSize: 11, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(item.title, { x: x + 0.72, y: y + 0.08, w: 4.5, h: 0.28, fontSize: 13, color: C.text, bold: true, margin: 0 });
    s.addText(item.desc, { x: x + 0.72, y: y + 0.36, w: 5.5, h: 0.24, fontSize: 11, color: C.muted, margin: 0 });
  });

  s.addNotes("Quick agenda overview. Tell them: We'll start with the tech stack, then walk through what I built in Week 3, what I added in Week 4, and end with a live demo.");
}

// ─────────────────────────────────────────────
// SLIDE 3 — Tech Stack
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Tech Stack", { x: 0.5, y: 0.3, w: 9, h: 0.55, fontSize: 32, color: C.dark, bold: true });
  s.addText("Technologies used to build the system", { x: 0.5, y: 0.88, w: 9, h: 0.3, fontSize: 13, color: C.muted });

  const techs = [
    { label: "Java 17", sub: "Language", color: "E84D22" },
    { label: "Spring Boot 3", sub: "Framework", color: "6DB33F" },
    { label: "Spring Security", sub: "Auth & RBAC", color: "1B4F9C" },
    { label: "JWT", sub: "Token Auth", color: "F59E0B" },
    { label: "H2 / MySQL", sub: "Database", color: "0074C1" },
    { label: "JPA/Hibernate", sub: "ORM", color: "59666C" },
    { label: "Swagger UI", sub: "API Docs", color: "85EA2D" },
    { label: "Render", sub: "Deployment", color: "46E3B7" },
  ];

  techs.forEach((t, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.4 + col * 2.32;
    const y = 1.35 + row * 1.85;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 2.1, h: 1.6, fill: { color: C.white }, line: { color: "E2E8F0" }, rectRadius: 0.1, shadow: makeShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.7, y: y + 0.2, w: 0.7, h: 0.7, fill: { color: t.color }, line: { color: t.color }, rectRadius: 0.08 });
    s.addText(t.label, { x, y: y + 1.0, w: 2.1, h: 0.3, fontSize: 12, color: C.text, bold: true, align: "center", margin: 0 });
    s.addText(t.sub, { x, y: y + 1.28, w: 2.1, h: 0.22, fontSize: 10, color: C.muted, align: "center", margin: 0 });
  });

  s.addNotes("Walk through the tech stack. Highlight: Spring Boot for the backend API, Spring Security + JWT for authentication, H2 for local dev and MySQL for production, and Swagger for API documentation.");
}

// ─────────────────────────────────────────────
// SLIDE 4 — Week 3 Features
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 0.25, w: 2.2, h: 0.5, fill: { color: C.primary }, line: { color: C.primary }, rectRadius: 0.25 });
  s.addText("WEEK 3", { x: 0.4, y: 0.25, w: 2.2, h: 0.5, fontSize: 13, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  s.addText("Core Task Management System", { x: 0.4, y: 0.85, w: 9.2, h: 0.65, fontSize: 30, color: C.white, bold: true });
  s.addText("JWT Authentication  •  Task CRUD  •  Frontend UI", { x: 0.4, y: 1.52, w: 9, h: 0.35, fontSize: 13, color: "94A3B8" });

  const features = [
    { title: "JWT Authentication", points: ["User Register & Login", "BCrypt password encoding", "Token-based stateless auth"] },
    { title: "Task CRUD", points: ["Create, Read, Update, Delete", "Assign tasks to users", "Filter by status & priority"] },
    { title: "Data Models", points: ["User — name, email, role", "Task — title, status, priority", "Due date & assignment"] },
    { title: "Frontend UI", points: ["Login / Register page", "Task dashboard with stats", "Create/Edit modals"] },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.4 + col * 4.85;
    const y = 2.05 + row * 1.6;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.6, h: 1.45, fill: { color: "132040" }, line: { color: "1B3A6B" }, rectRadius: 0.1 });
    s.addText(f.title, { x: x + 0.18, y: y + 0.1, w: 4.2, h: 0.3, fontSize: 13, color: C.accent, bold: true, margin: 0 });
    s.addText(f.points.map(p => p).join("\n"), {
      x: x + 0.18, y: y + 0.42, w: 4.2, h: 0.9,
      fontSize: 11, color: "CBD5E1", margin: 0,
    });
  });

  s.addNotes("Week 3 was about building the foundation. JWT auth, full CRUD for tasks, and a clean frontend UI. The app already had role enums but they weren't enforced yet — that came in Week 4.");
}

// ─────────────────────────────────────────────
// SLIDE 5 — Week 4 Features
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 0.25, w: 2.2, h: 0.5, fill: { color: C.accent }, line: { color: C.accent }, rectRadius: 0.25 });
  s.addText("WEEK 4", { x: 0.4, y: 0.25, w: 2.2, h: 0.5, fontSize: 13, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  s.addText("Advanced Features + Deployment", { x: 0.4, y: 0.85, w: 9.2, h: 0.65, fontSize: 30, color: C.dark, bold: true });
  s.addText("RBAC  •  Notifications  •  Admin Panel  •  Swagger  •  Cloud Deploy", { x: 0.4, y: 1.52, w: 9, h: 0.35, fontSize: 13, color: C.muted });

  const features = [
    { icon: "🔐", title: "RBAC", desc: "@PreAuthorize on all endpoints\nADMIN vs USER access control" },
    { icon: "👑", title: "Admin Panel", desc: "User management UI\nPromote/demote/delete users" },
    { icon: "⏰", title: "Overdue Detection", desc: "Overdue badge on task cards\nDaily 8AM alert scheduler" },
    { icon: "📧", title: "Notifications", desc: "Email on task assignment\nAsync non-blocking delivery" },
    { icon: "📋", title: "Swagger Docs", desc: "Live API docs at /swagger-ui\nJWT auth integrated in UI" },
    { icon: "🚀", title: "Deployment", desc: "Docker + Render cloud\nLive public URL" },
  ];

  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.3 + col * 3.22;
    const y = 2.0 + row * 1.65;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.0, h: 1.5, fill: { color: C.light }, line: { color: "DBEAFE" }, rectRadius: 0.1, shadow: makeShadow() });
    s.addText(f.icon + "  " + f.title, { x: x + 0.15, y: y + 0.12, w: 2.7, h: 0.35, fontSize: 13, color: C.primary, bold: true, margin: 0 });
    s.addText(f.desc, { x: x + 0.15, y: y + 0.5, w: 2.7, h: 0.85, fontSize: 11, color: C.text, margin: 0 });
  });

  s.addNotes("Week 4 added the advanced features. The biggest ones are RBAC — where roles are now actually enforced, not just stored — and the Admin Panel where you can manage users from the UI. Also added overdue detection, email notifications, Swagger docs, and deployed to Render.");
}

// ─────────────────────────────────────────────
// SLIDE 6 — RBAC Deep Dive
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Role-Based Access Control", { x: 0.5, y: 0.3, w: 9, h: 0.55, fontSize: 30, color: C.dark, bold: true });
  s.addText("Who can do what in the system", { x: 0.5, y: 0.88, w: 9, h: 0.3, fontSize: 13, color: C.muted });

  // Table header
  const tableY = 1.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: tableY, w: 9.2, h: 0.45, fill: { color: C.primary }, line: { color: C.primary }, rectRadius: 0.0 });
  s.addText("Action", { x: 0.5, y: tableY, w: 5.5, h: 0.45, fontSize: 12, color: C.white, bold: true, valign: "middle", margin: 0 });
  s.addText("USER", { x: 6.0, y: tableY, w: 1.5, h: 0.45, fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s.addText("ADMIN", { x: 7.8, y: tableY, w: 1.7, h: 0.45, fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  const rows = [
    { action: "Register / Login", user: true, admin: true },
    { action: "Create & update own tasks", user: true, admin: true },
    { action: "View own tasks only", user: true, admin: false },
    { action: "View ALL tasks", user: false, admin: true },
    { action: "Assign task to user", user: false, admin: true },
    { action: "Manage users (promote/delete)", user: false, admin: true },
    { action: "View dashboard statistics", user: false, admin: true },
  ];

  rows.forEach((row, i) => {
    const y = tableY + 0.45 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.5, fill: { color: i % 2 === 0 ? C.light : "F8FAFC" }, line: { color: "E2E8F0" } });
    s.addText(row.action, { x: 0.55, y, w: 5.3, h: 0.5, fontSize: 12, color: C.text, valign: "middle", margin: 0 });
    s.addText(row.user ? "✓" : "✗", { x: 6.0, y, w: 1.5, h: 0.5, fontSize: 14, color: row.user ? C.green : C.red, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(row.admin ? "✓" : "✗", { x: 7.8, y, w: 1.7, h: 0.5, fontSize: 14, color: row.admin ? C.green : C.red, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  s.addNotes("This is the access control table. Key point: regular users can only see their own tasks. Only admins can view all tasks, assign tasks, and manage users. This is enforced with @PreAuthorize annotations on every endpoint.");
}

// ─────────────────────────────────────────────
// SLIDE 7 — Live Deployment
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.OVAL, { x: 6.5, y: -0.5, w: 4.5, h: 4.5, fill: { color: "0EA5E9", transparency: 85 }, line: { color: "0EA5E9", transparency: 85 } });

  s.addText("Live Deployment", { x: 0.5, y: 0.4, w: 9, h: 0.6, fontSize: 32, color: C.white, bold: true });
  s.addText("Deployed on Render — Free tier with Docker", { x: 0.5, y: 1.05, w: 9, h: 0.35, fontSize: 14, color: "94A3B8" });

  // URL cards
  const urls = [
    { label: "🌐  Live Application", url: "https://week3-taskmanagement.onrender.com", color: "132040" },
    { label: "📋  Swagger API Docs", url: "https://week3-taskmanagement.onrender.com/swagger-ui.html", color: "0C2340" },
    { label: "💻  GitHub Repository", url: "https://github.com/jeevankumargujja/week3-taskmanagement", color: "0F1B30" },
  ];

  urls.forEach((u, i) => {
    const y = 1.6 + i * 1.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.5, y, w: 9, h: 0.88, fill: { color: u.color }, line: { color: "1B3A6B" }, rectRadius: 0.1 });
    s.addText(u.label, { x: 0.75, y: y + 0.08, w: 8.5, h: 0.28, fontSize: 12, color: C.accent, bold: true, margin: 0 });
    s.addText(u.url, { x: 0.75, y: y + 0.42, w: 8.5, h: 0.28, fontSize: 12, color: "94A3B8", margin: 0 });
  });

  // Deploy flow
  s.addText("GitHub  →  Render detects push  →  Docker build  →  Live", {
    x: 0.5, y: 4.9, w: 9, h: 0.4, fontSize: 12, color: "64748B", align: "center"
  });

  s.addNotes("The app is deployed live on Render using Docker. Every push to GitHub triggers an automatic redeploy. The free tier is good enough for demo purposes. Show the live URL to evaluators.");
}

// ─────────────────────────────────────────────
// SLIDE 8 — API Endpoints Summary
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("API Endpoints", { x: 0.5, y: 0.3, w: 9, h: 0.55, fontSize: 32, color: C.dark, bold: true });
  s.addText("RESTful API with JWT authentication and role-based access", { x: 0.5, y: 0.88, w: 9, h: 0.3, fontSize: 13, color: C.muted });

  const groups = [
    {
      title: "Authentication", color: C.green, x: 0.3, y: 1.3, w: 3.0,
      items: ["POST /api/auth/register", "POST /api/auth/login"]
    },
    {
      title: "Tasks (USER + ADMIN)", color: C.primary, x: 3.55, y: 1.3, w: 3.0,
      items: ["GET /api/tasks", "POST /api/tasks", "PUT /api/tasks/{id}", "PATCH /{id}/status", "DELETE /api/tasks/{id}", "GET /api/tasks/overdue"]
    },
    {
      title: "Admin Only", color: C.red, x: 6.8, y: 1.3, w: 2.9,
      items: ["GET /api/admin/users", "PATCH /users/{id}/role", "DELETE /users/{id}", "GET /api/admin/stats", "PATCH /tasks/{id}/assign"]
    }
  ];

  groups.forEach(g => {
    const itemH = 0.42;
    const totalH = 0.55 + g.items.length * itemH + 0.2;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: g.x, y: g.y, w: g.w, h: totalH, fill: { color: "F8FAFC" }, line: { color: "E2E8F0" }, rectRadius: 0.1, shadow: makeShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: g.x, y: g.y, w: g.w, h: 0.42, fill: { color: g.color }, line: { color: g.color }, rectRadius: 0.1 });
    s.addShape(pres.shapes.RECTANGLE, { x: g.x, y: g.y + 0.22, w: g.w, h: 0.2, fill: { color: g.color }, line: { color: g.color } });
    s.addText(g.title, { x: g.x, y: g.y, w: g.w, h: 0.42, fontSize: 11, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

    g.items.forEach((item, i) => {
      const y = g.y + 0.52 + i * itemH;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: g.x + 0.12, y: y + 0.04, w: g.w - 0.24, h: 0.32, fill: { color: C.white }, line: { color: "E2E8F0" }, rectRadius: 0.05 });
      s.addText(item, { x: g.x + 0.18, y: y + 0.04, w: g.w - 0.3, h: 0.32, fontSize: 9.5, color: C.text, valign: "middle", margin: 0 });
    });
  });

  s.addNotes("Three groups of endpoints. Auth is public. Task endpoints require a JWT token. Admin endpoints require ROLE_ADMIN. The overdue endpoint is new in Week 4.");
}

// ─────────────────────────────────────────────
// SLIDE 9 — Project Structure
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Project Structure", { x: 0.5, y: 0.3, w: 9, h: 0.55, fontSize: 32, color: C.dark, bold: true });
  s.addText("Clean layered architecture — Controller → Service → Repository → Model", { x: 0.5, y: 0.88, w: 9, h: 0.3, fontSize: 13, color: C.muted });

  const layers = [
    { name: "Controller Layer", color: "1B4F9C", files: "AuthController  •  TaskController  •  AdminController (W4)", desc: "Handles HTTP requests, applies @PreAuthorize (Week 4)" },
    { name: "Service Layer", color: "0891B2", files: "AuthService  •  TaskService  •  AdminService (W4)  •  NotificationService (W4)", desc: "Business logic, RBAC enforcement, overdue detection" },
    { name: "Repository Layer", color: "0D9488", files: "UserRepository  •  TaskRepository", desc: "Spring Data JPA — overdue queries added in Week 4" },
    { name: "Model / DTO", color: "059669", files: "User  •  Task  •  TaskRequest/Response  •  UserResponse (W4)  •  DashboardStats (W4)", desc: "Entities and data transfer objects" },
    { name: "Security", color: "7C3AED", files: "JwtAuthFilter  •  JwtUtil  •  SecurityConfig  •  UserDetailsServiceImpl", desc: "JWT filter chain, CORS, route protection" },
  ];

  layers.forEach((layer, i) => {
    const y = 1.3 + i * 0.83;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y, w: 9.2, h: 0.72, fill: { color: "F8FAFC" }, line: { color: "E2E8F0" }, rectRadius: 0.08 });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.4, y, w: 1.9, h: 0.72, fill: { color: layer.color }, line: { color: layer.color }, rectRadius: 0.08 });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y, w: 0.8, h: 0.72, fill: { color: layer.color }, line: { color: layer.color } });
    s.addText(layer.name, { x: 0.45, y, w: 1.8, h: 0.72, fontSize: 10, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(layer.files, { x: 2.45, y: y + 0.06, w: 7.0, h: 0.28, fontSize: 10, color: C.text, bold: true, margin: 0 });
    s.addText(layer.desc, { x: 2.45, y: y + 0.38, w: 7.0, h: 0.24, fontSize: 10, color: C.muted, margin: 0 });
  });

  s.addNotes("Standard Spring Boot layered architecture. Each layer has a clear responsibility. Files marked W4 are new in Week 4. The security layer handles JWT filtering for every request.");
}

// ─────────────────────────────────────────────
// SLIDE 10 — Evaluation Summary
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Evaluation Criteria — Summary", { x: 0.5, y: 0.3, w: 9, h: 0.55, fontSize: 30, color: C.dark, bold: true });

  const criteria = [
    {
      title: "Technical Implementation",
      color: C.primary,
      items: ["JWT Authentication + Spring Security", "RBAC with @PreAuthorize annotations", "Overdue detection + Email notifications", "Admin panel + Dashboard stats", "Docker deployment on Render"]
    },
    {
      title: "Code Quality",
      color: C.accent,
      items: ["Layered architecture (Controller→Service→Repo)", "@Valid on all request bodies", "Global exception handler", "Async notifications (@Async)", "Clean DTOs — no entity exposure"]
    },
    {
      title: "Documentation",
      color: C.green,
      items: ["Swagger UI — live interactive API docs", "README with Week 3 & Week 4 clearly separated", "API endpoint tables", "Access control matrix", ".env.example for deployment reference"]
    }
  ];

  criteria.forEach((c, i) => {
    const x = 0.3 + i * 3.22;
    const y = 1.15;
    const w = 3.0;
    const h = 4.1;

    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: C.white }, line: { color: "E2E8F0" }, rectRadius: 0.12, shadow: makeShadow() });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.55, fill: { color: c.color }, line: { color: c.color }, rectRadius: 0.12 });
    s.addShape(pres.shapes.RECTANGLE, { x, y: y + 0.3, w, h: 0.25, fill: { color: c.color }, line: { color: c.color } });
    s.addText(c.title, { x, y, w, h: 0.55, fontSize: 12, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

    c.items.forEach((item, j) => {
      const iy = y + 0.7 + j * 0.67;
      s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: iy + 0.08, w: 0.22, h: 0.22, fill: { color: c.color }, line: { color: c.color } });
      s.addText(item, { x: x + 0.5, y: iy, w: w - 0.6, h: 0.38, fontSize: 10.5, color: C.text, valign: "middle", margin: 0 });
    });
  });

  s.addNotes("This slide maps directly to the evaluation criteria from HR. Technical implementation is covered by RBAC, notifications, and deployment. Code quality shows in the architecture and validation. Documentation is the Swagger UI and README.");
}

// ─────────────────────────────────────────────
// SLIDE 11 — Thank You / Q&A
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.shapes.OVAL, { x: -1, y: -1, w: 5, h: 5, fill: { color: "1B4F9C", transparency: 75 }, line: { color: "1B4F9C", transparency: 75 } });
  s.addShape(pres.shapes.OVAL, { x: 7, y: 2, w: 4, h: 4, fill: { color: "0EA5E9", transparency: 80 }, line: { color: "0EA5E9", transparency: 80 } });

  s.addText("Thank You!", { x: 0.5, y: 1.0, w: 9, h: 1.0, fontSize: 52, color: C.white, bold: true, align: "center" });
  s.addText("Questions & Live Demo", { x: 0.5, y: 2.05, w: 9, h: 0.5, fontSize: 20, color: C.accent, align: "center" });

  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 2.7, w: 3, h: 0.04, fill: { color: "1B3A6B" }, line: { color: "1B3A6B" } });

  s.addText([
    { text: "🌐  Live App: ", options: { bold: true, color: "94A3B8" } },
    { text: "https://week3-taskmanagement.onrender.com", options: { color: C.accent } },
  ], { x: 0.5, y: 3.0, w: 9, h: 0.4, fontSize: 13, align: "center" });

  s.addText([
    { text: "Jeevan Kumar Gujja  ", options: { bold: true, color: C.white } },
    { text: "|  Java Developer Trainee  |  Hashclick Solutions LLC", options: { color: "64748B" } }
  ], { x: 0.5, y: 4.7, w: 9, h: 0.4, fontSize: 12, align: "center" });

  s.addNotes("End with a live demo. Open the browser, go to the live URL, register a new user, create a task with a past due date to show overdue badge, then log in as admin to show the admin panel. Open Swagger UI as the final wow factor.");
}

// Save
pres.writeFile({ fileName: "C:\\Users\\jeeva\\week3-taskmanagement\\Task-Management-Presentation.pptx" })
  .then(() => console.log("✅ Presentation saved: Task-Management-Presentation.pptx"))
  .catch(err => console.error("❌ Error:", err));
