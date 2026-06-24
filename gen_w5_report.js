const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, LevelFormat, PageBreak, TabStopType, ImageRun
} = require('docx');
const fs = require('fs');

const SS = 'C:/Users/jeeva/Downloads/Hashclick/week5_screenshots/';

function imgPara(file, origW, origH, caption) {
  const maxW = 580;
  let w = origW, h = origH;
  if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
  const items = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "png", data: fs.readFileSync(SS + file),
        transformation: { width: w, height: h },
        altText: { title: caption, description: caption, name: caption } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: caption, italics: true, size: 18, color: "666666", font: "Calibri" })]
    })
  ];
  return items;
}

const CONTENT_W = 9360;

const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    children: [new TextRun({ text, bold: true, size: 32, color: "1F3864", font: "Calibri" })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, color: "2E74B5", font: "Calibri" })]
  });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, size: 22, font: "Calibri", ...opts })] });
}
function blank() { return new Paragraph({ children: [new TextRun("")] }); }
function br() { return new Paragraph({ children: [new PageBreak()] }); }
function bul(text, boldPart = null) {
  const runs = boldPart
    ? [new TextRun({ text: boldPart + ": ", bold: true, size: 22, font: "Calibri" }), new TextRun({ text, size: 22, font: "Calibri" })]
    : [new TextRun({ text, size: 22, font: "Calibri" })];
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: runs });
}

function infoRow(label, value) {
  return new TableRow({ children: [
    new TableCell({ borders: allBorders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: "DCE6F1", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Calibri" })] })] }),
    new TableCell({ borders: allBorders, width: { size: 6560, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Calibri" })] })] })
  ]});
}
function infoTable(rows) {
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [2800, 6560],
    rows: rows.map(([l, v]) => infoRow(l, v)) });
}

function headerRow(cols, widths, fill) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((c, i) => new TableCell({
      borders: allBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, bold: true, size: 20, font: "Calibri", color: "FFFFFF" })] })]
    }))
  });
}
function dataRow(cols, widths, fill) {
  return new TableRow({
    children: cols.map((c, i) => new TableCell({
      borders: allBorders,
      width: { size: widths[i], type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, font: "Calibri" })] })]
    }))
  });
}

// ── Daily Progress Table ──────────────────────────────────────────────────────
function dailyTable() {
  const cols = ["Day", "Task Completed", "Details"];
  const widths = [1400, 2800, 5160];
  const days = [
    ["Monday\n16 Jun 2025",   "Project Setup & Architecture",
     "Set up two separate Spring Boot projects (user-service port 8081, task-service port 8082). Defined microservices architecture, service boundaries, and inter-service communication strategy using RestTemplate."],
    ["Tuesday\n17 Jun 2025",  "User Service Development",
     "Built complete user-service: JWT auth (register/login), User model + H2 DB, UserRepository, AuthService, UserService, JwtUtil, JwtAuthFilter, SecurityConfig. Added internal endpoints GET /api/users/{id} and GET /api/users/email/{email} for task-service to call."],
    ["Wednesday\n18 Jun 2025","Task Service Development",
     "Built task-service with Task model storing createdById and assignedToId (Long) instead of User objects. Implemented TaskRepository with custom JPQL queries for overdue detection. Created UserServiceClient using RestTemplate to call user-service for user lookups."],
    ["Thursday\n19 Jun 2025", "Inter-Service Communication & RBAC",
     "Wired inter-service REST calls: task-service passes JWT Bearer token when calling user-service. UserServiceClient fetches UserResponse (id, role) and TaskService uses it for RBAC decisions. Both services share the same JWT secret for independent token validation."],
    ["Friday\n20 Jun 2025",   "Testing, Documentation & GitHub Push",
     "Verified both services build successfully (mvn clean package). Added Swagger/OpenAPI docs to both services. Created separate GitHub repositories (user-service, task-service). Wrote .gitignore files, committed clean source, and pushed both repos to GitHub."],
    ["Saturday", "Week Off", ""],
    ["Sunday",   "Week Off", ""],
  ];

  const shades = ["FFFFFF","F7FBFF","FFFFFF","F7FBFF","FFFFFF","F0F0F0","F0F0F0"];
  const rows = [
    headerRow(cols, widths, "1F3864"),
    ...days.map(([day, task, detail], i) => new TableRow({
      children: [
        new TableCell({ borders: allBorders, width: { size: widths[0], type: WidthType.DXA }, shading: { fill: shades[i], type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: day, bold: true, size: 20, font: "Calibri" })] })] }),
        new TableCell({ borders: allBorders, width: { size: widths[1], type: WidthType.DXA }, shading: { fill: shades[i], type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: task, bold: i >= 5, size: 20, font: "Calibri", color: i >= 5 ? "888888" : "000000" })] })] }),
        new TableCell({ borders: allBorders, width: { size: widths[2], type: WidthType.DXA }, shading: { fill: shades[i], type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: detail, size: 20, font: "Calibri", color: i >= 5 ? "888888" : "000000" })] })] }),
      ]
    }))
  ];
  return new Table({ width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: widths, rows });
}

// ── API Endpoints Table ───────────────────────────────────────────────────────
function apiTable(title, rows, fill) {
  const widths = [1200, 3200, 4960];
  const hdr = headerRow(["Method", "Endpoint", "Description"], widths, fill);
  return [
    p(title, { bold: true, size: 22 }),
    new Table({
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnWidths: widths,
      rows: [
        hdr,
        ...rows.map((r, i) => dataRow(r, widths, i % 2 === 0 ? "FFFFFF" : "F7FBFF"))
      ]
    }),
    blank()
  ];
}

// ── Service Comparison Table ──────────────────────────────────────────────────
function comparisonTable() {
  const widths = [3120, 3120, 3120];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      headerRow(["Aspect", "User Service", "Task Service"], widths, "2E74B5"),
      dataRow(["Port", "8081", "8082"], widths, "FFFFFF"),
      dataRow(["Database", "H2 — users table", "H2 — tasks table"], widths, "F7FBFF"),
      dataRow(["Auth", "Issues JWT tokens", "Validates JWT tokens"], widths, "FFFFFF"),
      dataRow(["REST Calls", "None (source of truth)", "Calls user-service"], widths, "F7FBFF"),
      dataRow(["GitHub Repo", "jeevankumargujja/user-service", "jeevankumargujja/task-service"], widths, "FFFFFF"),
      dataRow(["Swagger UI", "localhost:8081/swagger-ui.html", "localhost:8082/swagger-ui.html"], widths, "F7FBFF"),
      dataRow(["Docker", "Dockerfile included", "Dockerfile included"], widths, "FFFFFF"),
    ]
  });
}

// ── Files Table ───────────────────────────────────────────────────────────────
function filesTable(rows) {
  const widths = [3500, 5860];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      headerRow(["File / Package", "Purpose"], widths, "1F3864"),
      ...rows.map(([f, d], i) => dataRow([f, d], widths, i % 2 === 0 ? "FFFFFF" : "F7FBFF"))
    ]
  });
}

// ── Challenges Table ──────────────────────────────────────────────────────────
function challengeTable() {
  const widths = [3500, 5860];
  const rows = [
    ["No shared User entity", "Task model stores createdById and assignedToId (Long) instead of JPA @ManyToOne to User. Task-service calls user-service REST API for user details when needed."],
    ["Token forwarding", "Task-service extracts the incoming Bearer token from HttpServletRequest and forwards it in the Authorization header when calling user-service endpoints."],
    ["RBAC without shared DB", "Each request calls getUserByEmail() on user-service to get the role. TaskService checks user.getRole().equals(\"ROLE_ADMIN\") for all access control decisions."],
    ["JDK vs JRE in Maven", "Build failed with 'No compiler provided'. Fixed by explicitly setting JAVA_HOME to the JDK 17 path before running mvn clean package."],
    ["Git tracking large JARs", "GitHub warned about JARs >50MB in target/. Fixed with .gitignore and git rm --cached target/ to exclude build artifacts from version control."],
  ];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      headerRow(["Challenge", "Solution"], widths, "C00000"),
      ...rows.map(([c, s], i) => dataRow([c, s], widths, i % 2 === 0 ? "FFFFFF" : "FFF5F5"))
    ]
  });
}

// ── Main Document ─────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2E74B5" },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E74B5", space: 1 } },
            spacing: { after: 80 },
            children: [
              new TextRun({ text: "Hashclick Solutions LLC", bold: true, size: 20, font: "Calibri", color: "1F3864" }),
              new TextRun({ text: "\tWeekly Training Report — Week 5", size: 20, font: "Calibri", color: "555555" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 9360 }]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E74B5", space: 1 } },
            spacing: { before: 80 },
            children: [
              new TextRun({ text: "Jeevan Kumar Gujja  |  Java Developer  |  Hashclick Solutions LLC", size: 18, font: "Calibri", color: "555555" }),
              new TextRun({ text: "\tPage ", size: 18, font: "Calibri", color: "555555" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Calibri", color: "555555" }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 9360 }]
          })
        ]
      })
    },
    children: [

      // ── COVER ──────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 80 },
        children: [new TextRun({ text: "WEEKLY TRAINING REPORT", bold: true, size: 52, font: "Calibri", color: "1F3864" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Week 5 — Microservices Architecture", bold: true, size: 36, font: "Calibri", color: "2E74B5" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "Java Developer Training Program", size: 24, font: "Calibri", color: "555555" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "Hashclick Solutions LLC", bold: true, size: 28, font: "Calibri", color: "1F3864" })]
      }),
      blank(),
      infoTable([
        ["Trainee Name",   "Jeevan Kumar Gujja"],
        ["Designation",    "Java Developer"],
        ["Organization",   "Hashclick Solutions LLC"],
        ["Report Period",  "Week 5: June 16 – June 20, 2025"],
        ["Submitted On",   "June 21, 2025"],
        ["Mentor / HR",    "Priya, Hashclick Solutions LLC"],
      ]),
      br(),

      // ── SECTION 1 ─────────────────────────────────────────────────────────
      h1("1. Overview"),
      p("This report covers Week 5 of the Java Developer Training Program at Hashclick Solutions LLC. The primary objective for this week was to transition from a monolithic Spring Boot application (built in Weeks 3–4) to a microservices architecture."),
      blank(),
      p("The existing Task Management System was decomposed into two independent, deployable Spring Boot services:"),
      bul("User Service (port 8081) — responsible for user registration, login, JWT token generation, and user management."),
      bul("Task Service (port 8082) — responsible for task CRUD, RBAC enforcement, overdue detection, and scheduling. Communicates with User Service via REST calls."),
      blank(),
      p("Both services use H2 in-memory databases, expose Swagger/OpenAPI documentation, include Dockerfiles for containerised deployment, and have been committed to separate GitHub repositories."),

      // ── SECTION 2 ─────────────────────────────────────────────────────────
      h1("2. Daily Progress Breakdown"),
      dailyTable(),

      // ── SECTION 3 ─────────────────────────────────────────────────────────
      br(),
      h1("3. Architecture Overview"),
      p("The system follows a microservices pattern where each service owns its data and exposes REST APIs. Services communicate over HTTP using RestTemplate."),
      blank(),
      h2("Service Comparison"),
      comparisonTable(),
      blank(),
      h2("Communication Flow"),
      bul("Client sends a request with a JWT Bearer token to Task Service."),
      bul("Task Service validates the JWT locally (shared secret — no network call needed)."),
      bul("Task Service calls User Service GET /api/users/email/{email} to retrieve the user's ID and role."),
      bul("UserServiceClient forwards the original Bearer token in the Authorization header."),
      bul("User Service looks up the user and returns UserResponse (id, name, email, role)."),
      bul("Task Service uses the role for RBAC decisions (ADMIN sees all tasks, USER sees own tasks)."),

      // ── SECTION 4 ─────────────────────────────────────────────────────────
      h1("4. REST API Endpoints"),
      ...apiTable("User Service — Authentication (Public)", [
        ["POST", "/api/auth/register", "Register a new user, returns JWT token"],
        ["POST", "/api/auth/login",    "Login and receive JWT token"],
      ], "1F3864"),
      ...apiTable("User Service — User Management (Authenticated)", [
        ["GET",    "/api/users/{id}",          "Get user by ID (also called by task-service)"],
        ["GET",    "/api/users/email/{email}",  "Get user by email (internal — called by task-service)"],
        ["GET",    "/api/admin/users",          "List all users (ADMIN only)"],
        ["PATCH",  "/api/admin/users/{id}/role","Change user role (ADMIN only)"],
        ["DELETE", "/api/admin/users/{id}",     "Delete a user (ADMIN only)"],
        ["GET",    "/api/admin/stats",          "Total user count (ADMIN only)"],
      ], "2E74B5"),
      ...apiTable("Task Service — Task Management (Authenticated)", [
        ["POST",   "/api/tasks",              "Create a new task"],
        ["GET",    "/api/tasks",              "Get all tasks (admin: all, user: own)"],
        ["GET",    "/api/tasks/{id}",         "Get task by ID"],
        ["GET",    "/api/tasks/my",           "Get tasks assigned to me"],
        ["GET",    "/api/tasks/overdue",      "Get overdue tasks (filtered by role)"],
        ["GET",    "/api/tasks/status/{s}",   "Filter tasks by status"],
        ["PUT",    "/api/tasks/{id}",         "Update full task (creator or admin)"],
        ["PATCH",  "/api/tasks/{id}/status",  "Update task status"],
        ["PATCH",  "/api/tasks/{id}/assign",  "Assign task to user (ADMIN only)"],
        ["DELETE", "/api/tasks/{id}",         "Delete task (creator or admin)"],
        ["GET",    "/api/tasks/stats",        "Dashboard stats (ADMIN only)"],
      ], "1F3864"),

      // ── SECTION 5 ─────────────────────────────────────────────────────────
      h1("5. New Files Added"),
      h2("User Service (C:\\Users\\jeeva\\user-service)"),
      filesTable([
        ["UserServiceApplication.java",    "Spring Boot entry point — @SpringBootApplication"],
        ["model/User.java",                "JPA entity — id, name, email, password, role"],
        ["repository/UserRepository.java", "JPA repository — findByEmail, existsByEmail"],
        ["dto/RegisterRequest.java",       "Request DTO with @Valid constraints"],
        ["dto/LoginRequest.java",          "Login request DTO"],
        ["dto/AuthResponse.java",          "Auth response — token, email, name, role"],
        ["dto/UserResponse.java",          "User details DTO returned by lookup endpoints"],
        ["enums/Role.java",                "ROLE_USER, ROLE_ADMIN"],
        ["service/AuthService.java",       "Register + login logic, JWT generation"],
        ["service/UserService.java",       "User CRUD, role change, delete, stats"],
        ["security/JwtUtil.java",          "JWT generate, validate, extract email and role"],
        ["security/JwtAuthFilter.java",    "OncePerRequestFilter — sets SecurityContext from token"],
        ["security/SecurityConfig.java",   "Stateless security chain, BCrypt bean"],
        ["security/UserDetailsServiceImpl.java", "UserDetailsService backed by UserRepository"],
        ["controller/AuthController.java", "POST /api/auth/register and /login"],
        ["controller/UserController.java", "User lookup + admin management endpoints"],
        ["config/OpenApiConfig.java",      "Swagger UI + Bearer auth schema"],
        ["exception/GlobalExceptionHandler.java", "Structured error responses for all exceptions"],
        ["resources/application.properties","H2 config, JWT secret, Swagger, port 8081"],
        ["Dockerfile",                     "Two-stage Maven build + JRE alpine runtime"],
      ]),
      blank(),
      h2("Task Service (C:\\Users\\jeeva\\task-service)"),
      filesTable([
        ["TaskServiceApplication.java",    "Spring Boot entry point — @EnableScheduling, @EnableAsync"],
        ["model/Task.java",                "JPA entity — stores createdById + assignedToId (Long)"],
        ["repository/TaskRepository.java", "JPQL queries for overdue detection, status filter"],
        ["dto/TaskRequest.java",           "Task creation/update request with @Valid"],
        ["dto/TaskResponse.java",          "Task response including overdue flag"],
        ["dto/UserResponse.java",          "Mirror of user-service UserResponse for REST deserialization"],
        ["enums/TaskStatus.java",          "TODO, IN_PROGRESS, DONE"],
        ["enums/Priority.java",            "LOW, MEDIUM, HIGH"],
        ["client/UserServiceClient.java",  "RestTemplate client — calls user-service with Bearer token"],
        ["service/TaskService.java",       "Full task CRUD with RBAC using UserServiceClient"],
        ["service/NotificationService.java","@Async notification logging (email-ready)"],
        ["service/OverdueAlertScheduler.java","@Scheduled cron at 8 AM — logs overdue tasks"],
        ["security/JwtUtil.java",          "JWT validation only (shared secret, no token generation)"],
        ["security/JwtAuthFilter.java",    "Sets SecurityContext from JWT — no UserDetailsService needed"],
        ["security/SecurityConfig.java",   "Stateless chain — no AuthenticationManager required"],
        ["controller/TaskController.java", "All task endpoints — passes token to service layer"],
        ["config/RestTemplateConfig.java", "@Bean RestTemplate for UserServiceClient injection"],
        ["config/OpenApiConfig.java",      "Swagger UI + Bearer auth schema"],
        ["exception/GlobalExceptionHandler.java","Structured error responses"],
        ["resources/application.properties","H2 config, JWT secret, user-service URL, port 8082"],
        ["Dockerfile",                     "Two-stage Maven build + JRE alpine runtime"],
      ]),

      // ── SECTION 6 ─────────────────────────────────────────────────────────
      br(),
      h1("6. Challenges & Solutions"),
      challengeTable(),

      // ── SECTION 7 ─────────────────────────────────────────────────────────
      h1("7. Deliverables"),
      bul("Separate GitHub repository for User Service", "user-service"),
      bul("https://github.com/jeevankumargujja/user-service"),
      bul("Separate GitHub repository for Task Service", "task-service"),
      bul("https://github.com/jeevankumargujja/task-service"),
      bul("Working REST APIs for both services (verified — both build and start successfully)", "APIs"),
      bul("Architecture diagram showing service boundaries and inter-service REST communication", "Diagram"),
      bul("Swagger/OpenAPI documentation on both services", "Swagger"),
      bul("Dockerfiles for containerised deployment of both services", "Docker"),
      bul("This weekly training report", "Report"),

      // ── SECTION 8 — Screenshots ───────────────────────────────────────────
      br(),
      h1("8. Application Screenshots"),

      h2("Figure 1 — User Service Started (Port 8081)"),
      ...imgPara("Userservice_port started.png", 1365, 722, "Figure 1: User Service successfully started on port 8081"),

      h2("Figure 2 — Task Service Started (Port 8082)"),
      ...imgPara("taskservice port started.png", 1326, 676, "Figure 2: Task Service successfully started on port 8082"),

      h2("Figure 3 — User Service Swagger UI"),
      ...imgPara("userservice_swagger.png", 1365, 678, "Figure 3: User Service Swagger/OpenAPI documentation at localhost:8081/swagger-ui.html"),

      h2("Figure 4 — Task Service Swagger UI"),
      ...imgPara("taskservice_swagger.png", 1363, 676, "Figure 4: Task Service Swagger/OpenAPI documentation at localhost:8082/swagger-ui.html"),

      h2("Figure 5 — Register API (POST /api/auth/register)"),
      ...imgPara("userservice_post+auth_register_reponse.png", 1365, 674, "Figure 5: User registration via POST /api/auth/register — returns JWT token"),

      h2("Figure 6 — Login API (POST /api/auth/login)"),
      ...imgPara("userservice_auth_login.png", 1365, 671, "Figure 6: User login via POST /api/auth/login"),

      h2("Figure 7 — JWT Token Response"),
      ...imgPara("userservice_jwttoken_response.png", 1365, 678, "Figure 7: JWT token returned after successful login — used for all subsequent requests"),

      h2("Figure 8 — Create Task (POST /api/tasks)"),
      ...imgPara("taskservice_create task.png", 1365, 665, "Figure 8: Creating a new task via POST /api/tasks with Bearer JWT token"),

      h2("Figure 9 — Create Task Response"),
      ...imgPara("taskservice_createtask_response.png", 1365, 673, "Figure 9: Task created successfully — response with task ID and details"),

      h2("Figure 10 — Get Tasks (GET /api/tasks)"),
      ...imgPara("taskservice_getapitask_response.png", 1363, 669, "Figure 10: Retrieving all tasks via GET /api/tasks"),

      h2("Figure 11 — H2 Console — User Service"),
      ...imgPara("h2console_userservice.png", 1365, 676, "Figure 11: H2 in-memory database console for User Service (userdb) showing users table"),

      h2("Figure 12 — H2 Console — Task Service"),
      ...imgPara("h2console_taskservice.png", 1360, 671, "Figure 12: H2 in-memory database console for Task Service (taskdb) showing tasks table"),

      h2("Figure 13 — User Service GitHub Repository"),
      ...imgPara("user service repo.png", 1362, 675, "Figure 13: User Service GitHub repository — github.com/jeevankumargujja/user-service"),

      h2("Figure 14 — Task Service GitHub Repository"),
      ...imgPara("taskservice repo.png", 1362, 639, "Figure 14: Task Service GitHub repository — github.com/jeevankumargujja/task-service"),

      h2("Figure 15 — User Service README"),
      ...imgPara("userservice_readme.png", 1357, 633, "Figure 15: User Service README with API documentation and setup guide"),

      h2("Figure 16 — Task Service README"),
      ...imgPara("taskservice_readme.png", 1362, 659, "Figure 16: Task Service README with API endpoints, RBAC table, and inter-service communication notes"),

      // ── SECTION 9 — Declaration ───────────────────────────────────────────
      br(),
      h1("9. Trainee Declaration"),
      p("I certify that all the information provided above is accurate and the work was completed during the stated period."),
      blank(),
      blank(),
      new Paragraph({
        tabStops: [{ type: TabStopType.LEFT, position: 5400 }],
        children: [
          new TextRun({ text: "Employee Signature:", size: 22, font: "Calibri" }),
          new TextRun({ text: "\tDate: 06/21/2025", size: 22, font: "Calibri" }),
        ]
      }),
      new Paragraph({ children: [new TextRun({ text: "Jeevan Kumar Gujja", size: 22, font: "Calibri" })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Jeevan_Kumar_Gujja_Week5_Report.docx", buffer);
  console.log("Done: Jeevan_Kumar_Gujja_Week5_Report.docx");
});
