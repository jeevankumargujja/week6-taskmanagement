const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, LevelFormat, PageBreak
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, bold = false, shade = null, width = 3120) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold, size: 20 })] })]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, color: "1F3864" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 26, color: "2E74B5" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true, size: 22, color: "404040" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, ...opts })]
  });
}

function bullet(text, bold_prefix = null) {
  const runs = [];
  if (bold_prefix) {
    runs.push(new TextRun({ text: bold_prefix + ": ", bold: true, size: 22 }));
    runs.push(new TextRun({ text, size: 22 }));
  } else {
    runs.push(new TextRun({ text, size: 22 }));
  }
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: runs
  });
}

function emptyLine() {
  return new Paragraph({ children: [new TextRun({ text: "" })] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function infoTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    borders: { insideH: border, insideV: border },
    rows: rows.map(([label, value]) =>
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 2800, type: WidthType.DXA },
            shading: { fill: "DCE6F1", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20 })] })]
          }),
          new TableCell({
            borders,
            width: { size: 6560, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })]
          })
        ]
      })
    )
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2E74B5" },
        paragraph: { spacing: { before: 240, after: 80 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: "404040" },
        paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 2 }
      }
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
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E74B5", space: 1 } },
          children: [new TextRun({ text: "Hashclick Solutions LLC  |  Java Developer Trainee  |  Week 4 Report", size: 18, color: "555555" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E74B5", space: 1 } },
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "555555" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "555555" }),
            new TextRun({ text: " of ", size: 18, color: "555555" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "555555" })
          ]
        })]
      })
    },
    children: [

      // ── TITLE BLOCK ──────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 120 },
        children: [new TextRun({ text: "WEEKLY TRAINING REPORT", bold: true, size: 48, color: "1F3864", font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Week 4  |  Task Management System  |  Advanced Features & Deployment", size: 26, color: "2E74B5", font: "Calibri" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 600 },
        children: [new TextRun({ text: "Hashclick Solutions LLC  |  Java Developer Trainee Program", size: 22, color: "888888" })]
      }),

      // ── TRAINEE INFO TABLE ──────────────────────────────────────
      infoTable([
        ["Trainee Name", "Jeevan Kumar Gujja"],
        ["Organization", "Hashclick Solutions LLC"],
        ["Program", "Java Developer Trainee"],
        ["Week", "Week 4 (of 4)"],
        ["Report Date", "June 2026"],
        ["Project", "Task Management System"],
        ["Live URL", "https://week3-taskmanagement.onrender.com"],
        ["Swagger Docs", "https://week3-taskmanagement.onrender.com/swagger-ui.html"],
        ["GitHub", "https://github.com/jeevankumargujja/week3-taskmanagement"],
      ]),

      emptyLine(),
      pageBreak(),

      // ── 1. WEEK OVERVIEW ─────────────────────────────────────────
      h1("1. Week Overview"),
      para("Week 4 built on the core Task Management System completed in Week 3. The focus was on enterprise-grade features: enforcing Role-Based Access Control (RBAC), adding an Admin Panel, detecting overdue tasks, implementing asynchronous email notifications, documenting the API with Swagger/OpenAPI, and deploying the application to the cloud using Docker on Render."),
      emptyLine(),
      para("All Week 4 features were added to the existing Week 3 codebase. No separate project folder was created — the same Spring Boot application was extended."),

      emptyLine(),

      // ── 2. ASSIGNED TASKS ────────────────────────────────────────
      h1("2. Assigned Tasks (HR Requirements)"),
      para("The following tasks were assigned by HR for Week 4:"),
      emptyLine(),
      bullet("Implement Role-Based Access Control (RBAC)"),
      bullet("Add advanced features: notifications, validations, admin panel"),
      bullet("Deploy the application to a cloud platform"),
      bullet("Prepare complete documentation"),
      bullet("Final deliverables: live project link, documentation, presentation and demo"),
      emptyLine(),
      para("All assigned tasks were completed successfully.", { bold: true }),

      emptyLine(),
      pageBreak(),

      // ── 3. FEATURES IMPLEMENTED ──────────────────────────────────
      h1("3. Features Implemented"),

      h2("3.1  Role-Based Access Control (RBAC)"),
      para("Spring Security's @PreAuthorize annotation was used to enforce role-based access at the method level. The system has two roles: ROLE_USER and ROLE_ADMIN."),
      emptyLine(),
      bullet("@PreAuthorize(\"hasRole('ADMIN')\") on AdminController class (all admin endpoints)"),
      bullet("@PreAuthorize(\"hasAnyRole('ADMIN','USER')\") on TaskController methods"),
      bullet("PATCH /api/tasks/{id}/assign restricted to ADMIN only"),
      bullet("ADMIN sees all tasks; USER sees only their own (created or assigned)"),
      bullet("/api/admin/** route blocked in SecurityConfig with hasRole('ADMIN') rule"),
      emptyLine(),

      h2("3.2  Admin Controller & Service"),
      para("A new AdminController was created providing five admin-only REST endpoints:"),
      emptyLine(),
      bullet("GET /api/admin/users — list all users with task counts"),
      bullet("GET /api/admin/users/{id} — get a single user by ID"),
      bullet("PATCH /api/admin/users/{id}/role — promote or demote a user"),
      bullet("DELETE /api/admin/users/{id} — delete a user"),
      bullet("GET /api/admin/stats — dashboard statistics (total users, tasks, overdue count, status breakdown)"),
      emptyLine(),

      h2("3.3  Admin Panel (Frontend)"),
      para("The frontend index.html was updated to include an Admin Panel section visible only when the logged-in user has ROLE_ADMIN:"),
      emptyLine(),
      bullet("User management table showing ID, Name, Email, Role, Task Count"),
      bullet("'Make Admin' and 'Make User' buttons to toggle roles instantly"),
      bullet("'Delete User' button with confirmation dialog"),
      bullet("JavaScript role check: currentUser.role === 'ROLE_ADMIN' controls panel visibility"),
      bullet("Backend @PreAuthorize provides the actual security enforcement"),
      emptyLine(),

      h2("3.4  Overdue Task Detection"),
      para("Overdue detection was implemented at both the API response level and the database query level:"),
      emptyLine(),
      bullet("overdue flag added to TaskResponse — computed from dueDate < today AND status != DONE"),
      bullet("Red OVERDUE badge displayed on task cards in the frontend"),
      bullet("Red border highlight on overdue task cards"),
      bullet("Overdue counter added to the stats bar (shown in red)"),
      bullet("'Overdue Only' filter added to the task toolbar dropdown"),
      bullet("TaskRepository.findOverdueTasks(LocalDate today) JPQL query for filtered endpoint"),
      bullet("GET /api/tasks/overdue endpoint for fetching only overdue tasks"),
      emptyLine(),

      h2("3.5  Email Notifications"),
      para("An asynchronous notification system was implemented using Spring's @Async:"),
      emptyLine(),
      bullet("NotificationService sends email when a task is assigned to a user"),
      bullet("@Async annotation ensures notifications are non-blocking (runs in background thread)"),
      bullet("Console logging by default (notifications.email.enabled=false in dev)"),
      bullet("Enable real Gmail SMTP by setting notifications.email.enabled=true with credentials"),
      bullet("Notification triggered in TaskService on create, update, and assign operations"),
      emptyLine(),

      h2("3.6  Scheduled Overdue Alerts"),
      para("A daily scheduled job was implemented using Spring's @Scheduled:"),
      emptyLine(),
      bullet("OverdueAlertScheduler runs daily at 8:00 AM (cron = \"0 0 8 * * *\")"),
      bullet("Finds all overdue tasks via TaskRepository"),
      bullet("Sends overdue notification to both the assignee and the creator of each task"),
      bullet("@EnableScheduling added to TaskManagementApplication"),
      bullet("Scheduler integrates with NotificationService (also async)"),
      emptyLine(),

      h2("3.7  Input Validation (Enhanced)"),
      para("All request body validation was strengthened:"),
      emptyLine(),
      bullet("@Valid enforced on all @RequestBody parameters in controllers"),
      bullet("@NotBlank, @Size, @Email, @FutureOrPresent constraints on DTOs"),
      bullet("GlobalExceptionHandler returns structured JSON error responses for validation failures"),
      bullet("Consistent 400 Bad Request responses with field-level error details"),
      emptyLine(),

      h2("3.8  Swagger / OpenAPI Documentation"),
      para("Interactive API documentation was added using springdoc-openapi:"),
      emptyLine(),
      bullet("Swagger UI available at /swagger-ui.html"),
      bullet("All endpoints documented with descriptions, parameter details, and response formats"),
      bullet("JWT Bearer auth integrated — Authorize button accepts token for protected endpoints"),
      bullet("Endpoints grouped by tag: Authentication, Tasks, Admin"),
      bullet("OpenAPI spec available at /v3/api-docs"),
      bullet("OpenApiConfig.java added with bearer auth scheme and API info metadata"),
      emptyLine(),

      h2("3.9  Production Deployment"),
      para("The application was containerized and deployed to the cloud:"),
      emptyLine(),
      bullet("Two-stage Dockerfile: Stage 1 builds JAR with Maven; Stage 2 runs JRE-only image"),
      bullet("eclipse-temurin:17-jre-alpine used for minimal production image size"),
      bullet("application-prod.properties uses environment variables for all configuration"),
      bullet("Defaults to H2 in-memory database — MySQL opt-in via DATABASE_URL env var"),
      bullet("Deployed on Render (free tier) — Docker-based deployment"),
      bullet("Auto-deploys on every GitHub push to main branch"),
      bullet("Live URL: https://week3-taskmanagement.onrender.com"),

      emptyLine(),
      pageBreak(),

      // ── 4. FILES ─────────────────────────────────────────────────
      h1("4. Files Created and Modified"),

      h2("4.1  New Files Added (Week 4)"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "File", bold: true, size: 20, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true, size: 20, color: "FFFFFF" })] })] })
            ]
          }),
          ...([
            ["AdminController.java", "Admin-only REST endpoints (users, stats, role management)"],
            ["AdminService.java", "Business logic for admin operations"],
            ["NotificationService.java", "Async email notifications for task assignment and overdue alerts"],
            ["OverdueAlertScheduler.java", "Daily @Scheduled job that runs at 8 AM to send overdue alerts"],
            ["UserResponse.java", "DTO with user id, name, email, role, taskCount"],
            ["DashboardStats.java", "DTO with task/user counts for admin stats endpoint"],
            ["OpenApiConfig.java", "Swagger bearer auth scheme and API metadata configuration"],
            ["application-prod.properties", "Production profile — env var-driven, H2 default, MySQL opt-in"],
            ["Dockerfile", "Two-stage build: Maven build + JRE alpine runtime"],
            ["railway.json", "Railway cloud deployment configuration"],
            ["Procfile", "Process definition for cloud deployment"],
            [".env.example", "Reference file listing all required environment variables"],
          ]).map(([file, purpose], i) =>
            new TableRow({
              children: [
                new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: file, size: 18, font: "Courier New" })] })] }),
                new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 20 })] })] })
              ]
            })
          )
        ]
      }),

      emptyLine(),
      h2("4.2  Files Modified (Week 4)"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "File", bold: true, size: 20, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Changes Made", bold: true, size: 20, color: "FFFFFF" })] })] })
            ]
          }),
          ...([
            ["TaskController.java", "@PreAuthorize on all endpoints; ADMIN-only assign; overdue endpoint added"],
            ["TaskService.java", "RBAC-aware queries; getAllTasksForUser(); overdue logic; notification calls"],
            ["TaskRepository.java", "findOverdueTasks(), countOverdue(), countByStatus(), findByAssignedToOrCreatedBy()"],
            ["TaskResponse.java", "Added overdue boolean flag and assignedToId field"],
            ["SecurityConfig.java", "Added Swagger UI routes to permitAll; /api/admin/** rule added"],
            ["TaskManagementApplication.java", "@EnableScheduling and @EnableAsync annotations added"],
            ["application.properties", "Mail config, Swagger config, notifications.email.enabled added"],
            ["index.html", "Admin panel, overdue badge, overdue filter, overdue stat counter"],
            ["pom.xml", "Added springdoc-openapi-starter-webmvc-ui 2.5.0 and spring-boot-starter-mail"],
            ["README.md", "Complete rewrite with Week 3 and Week 4 sections, live URL, access control table"],
          ]).map(([file, changes], i) =>
            new TableRow({
              children: [
                new TableCell({ borders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: file, size: 18, font: "Courier New" })] })] }),
                new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: changes, size: 20 })] })] })
              ]
            })
          )
        ]
      }),

      emptyLine(),
      pageBreak(),

      // ── 5. API ENDPOINTS ─────────────────────────────────────────
      h1("5. API Endpoints"),

      h2("5.1  Admin Endpoints (ROLE_ADMIN only)"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1200, 3360, 4800],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Method", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Endpoint", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 4800, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20, color: "FFFFFF" })] })] })
          ]}),
          ...([
            ["GET", "/api/admin/users", "List all users with task counts"],
            ["GET", "/api/admin/users/{id}", "Get a single user by ID"],
            ["PATCH", "/api/admin/users/{id}/role", "Change user role (promote/demote)"],
            ["DELETE", "/api/admin/users/{id}", "Delete a user"],
            ["GET", "/api/admin/stats", "Dashboard statistics"],
            ["GET", "/api/tasks/overdue", "Get overdue tasks (role-aware)"],
          ]).map(([method, endpoint, desc], i) =>
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: method, bold: true, size: 20, color: method === "GET" ? "1A6B1A" : method === "DELETE" ? "B81A1A" : "8B5A00" })] })] }),
              new TableCell({ borders, width: { size: 3360, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: endpoint, size: 18, font: "Courier New" })] })] }),
              new TableCell({ borders, width: { size: 4800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: desc, size: 20 })] })] }),
            ]})
          )
        ]
      }),

      emptyLine(),

      h2("5.2  Access Control Summary"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4560, 2400, 2400],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 4560, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Action", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ROLE_USER", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ROLE_ADMIN", bold: true, size: 20, color: "FFFFFF" })] })] }),
          ]}),
          ...([
            ["Register / Login", "Yes", "Yes"],
            ["Create task", "Yes", "Yes"],
            ["View own tasks", "Yes", "Yes"],
            ["View ALL tasks", "No", "Yes"],
            ["Update own task", "Yes", "Yes"],
            ["Delete own task", "Yes", "Yes"],
            ["Assign task to user", "No", "Yes"],
            ["View overdue tasks", "Own only", "All tasks"],
            ["Manage users (promote/demote/delete)", "No", "Yes"],
            ["View dashboard stats", "No", "Yes"],
          ]).map(([action, user, admin], i) =>
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 4560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: action, size: 20 })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: user, size: 20, color: user === "Yes" ? "1A6B1A" : user === "No" ? "B81A1A" : "8B5A00", bold: user !== "Own only" })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: admin, size: 20, color: admin === "Yes" || admin === "All tasks" ? "1A6B1A" : "B81A1A", bold: true })] })] }),
            ]})
          )
        ]
      }),

      emptyLine(),
      pageBreak(),

      // ── 6. TECH STACK ────────────────────────────────────────────
      h1("6. Technology Stack"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Layer / Component", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 6560, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Technology", bold: true, size: 20, color: "FFFFFF" })] })] })
          ]}),
          ...([
            ["Language", "Java 17"],
            ["Framework", "Spring Boot 3.2.5"],
            ["Security", "Spring Security + JWT (JJWT 0.11.5)"],
            ["Database (Dev)", "H2 in-memory database"],
            ["Database (Prod)", "H2 (default), MySQL-ready via DATABASE_URL"],
            ["ORM", "Spring Data JPA / Hibernate"],
            ["Build Tool", "Apache Maven 3.9.6"],
            ["API Docs", "Springdoc OpenAPI / Swagger UI 2.5.0"],
            ["Frontend", "HTML5, CSS3, Vanilla JavaScript"],
            ["Containerization", "Docker (two-stage build)"],
            ["Cloud Deployment", "Render (free tier, Docker-based)"],
            ["Async Processing", "@Async with Spring TaskExecutor"],
            ["Scheduling", "@Scheduled with @EnableScheduling"],
          ]).map(([layer, tech], i) =>
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 2800, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: layer, bold: true, size: 20 })] })] }),
              new TableCell({ borders, width: { size: 6560, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: tech, size: 20 })] })] })
            ]})
          )
        ]
      }),

      emptyLine(),
      pageBreak(),

      // ── 7. CHALLENGES & SOLUTIONS ────────────────────────────────
      h1("7. Challenges Encountered & Solutions"),

      h3("Challenge 1: Maven not in system PATH"),
      bullet("Problem: mvn command not found; Maven wrapper (mvnw.cmd) also failed with missing wrapper JAR."),
      bullet("Solution: Downloaded Apache Maven 3.9.6 to C:\\Users\\jeeva\\AppData\\Local\\apache-maven and used the full path to mvn.cmd for all build commands."),
      emptyLine(),

      h3("Challenge 2: Render deployment failed — MySQL connection error"),
      bullet("Problem: application-prod.properties defaulted to MySQL when no DATABASE_URL environment variable was set on Render, causing a connection refused error on startup."),
      bullet("Solution: Changed the default for spring.datasource.url, driver-class-name, username, password, and JPA dialect to H2 values. MySQL is now opt-in by setting DATABASE_URL."),
      emptyLine(),

      h3("Challenge 3: Render does not support Java natively"),
      bullet("Problem: Render's language dropdown does not have a Java option, so a direct JAR deploy was not possible."),
      bullet("Solution: Used Docker as the deployment runtime. The two-stage Dockerfile builds the JAR with Maven and runs it with eclipse-temurin:17-jre-alpine."),
      emptyLine(),

      h3("Challenge 4: User delete failed (500 error)"),
      bullet("Problem: Attempting to delete a test user (Kirti) via the Admin Panel returned a 500 error because the user had tasks referencing them as creator — a foreign key constraint violation."),
      bullet("Solution: Used H2 Console to manually delete the user's tasks first (DELETE FROM tasks WHERE created_by = ...) and then deleted the user record."),
      emptyLine(),

      h3("Challenge 5: Port 8080 already in use on local"),
      bullet("Problem: After restarting, Spring Boot failed to bind port 8080 because a previous instance was still running."),
      bullet("Solution: Identified the process ID (PID 3108) using netstat and killed it before restarting."),
      emptyLine(),
      pageBreak(),

      // ── 8. LEARNINGS ─────────────────────────────────────────────
      h1("8. Key Learnings"),

      h2("8.1  Spring Security & RBAC"),
      bullet("@PreAuthorize is evaluated at method invocation using SpEL (Spring Expression Language)."),
      bullet("@EnableMethodSecurity must be present in SecurityConfig for @PreAuthorize to work."),
      bullet("Roles stored in JWT are validated against Spring Security's GrantedAuthority on each request."),
      bullet("Security config rules in the filter chain (HttpSecurity) provide URL-level protection; @PreAuthorize provides method-level protection — both layers together give defense in depth."),
      emptyLine(),

      h2("8.2  Asynchronous Processing"),
      bullet("@Async methods must be in a different Spring bean than the caller to work (proxy limitation)."),
      bullet("@EnableAsync on the main application class enables the async executor."),
      bullet("Non-blocking notifications improve API response time — the caller does not wait for email delivery."),
      emptyLine(),

      h2("8.3  Docker & Cloud Deployment"),
      bullet("Two-stage Docker builds keep the final image small — the Maven build stage is discarded."),
      bullet("Environment variables are the correct way to pass secrets and config to production containers."),
      bullet("Render's free tier spins down after 15 minutes of inactivity — first request after sleep may take 30-50 seconds."),
      bullet("Spring profiles (prod vs dev) allow clean separation of environment-specific configuration."),
      emptyLine(),

      h2("8.4  API Documentation"),
      bullet("springdoc-openapi auto-generates OpenAPI spec from Spring MVC annotations."),
      bullet("@Tag, @Operation, and @SecurityRequirement annotations provide richer documentation metadata."),
      bullet("Swagger UI's Authorize button allows testing JWT-protected endpoints directly in the browser."),
      emptyLine(),
      pageBreak(),

      // ── 9. DELIVERABLES ──────────────────────────────────────────
      h1("9. Deliverables"),
      emptyLine(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 2400, 2280],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Deliverable", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Status", bold: true, size: 20, color: "FFFFFF" })] })] }),
            new TableCell({ borders, width: { size: 2280, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Notes", bold: true, size: 20, color: "FFFFFF" })] })] })
          ]}),
          ...([
            ["RBAC with @PreAuthorize", "Complete", "All endpoints secured"],
            ["Admin Controller & Service", "Complete", "5 admin endpoints"],
            ["Admin Panel (Frontend)", "Complete", "Role-toggle and delete UI"],
            ["Overdue Task Detection", "Complete", "Flag, badge, filter, scheduler"],
            ["Email Notifications (@Async)", "Complete", "Console log in dev; SMTP ready"],
            ["Input Validation (@Valid)", "Complete", "All request bodies validated"],
            ["Swagger / OpenAPI Docs", "Complete", "Live at /swagger-ui.html"],
            ["Docker Containerization", "Complete", "Two-stage Dockerfile"],
            ["Cloud Deployment (Render)", "Complete", "Live URL active"],
            ["Production Config", "Complete", "H2 default, MySQL opt-in"],
            ["README Documentation", "Complete", "Week 3 + Week 4 sections"],
            ["Presentation Slides", "Complete", "11-slide PPTX"],
            ["Demo Script", "Complete", "Full Part 1 + 2 + 3 script"],
            ["Weekly Report", "Complete", "This document"],
          ]).map(([item, status, notes], i) =>
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 4680, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: item, size: 20 })] })] }),
              new TableCell({ borders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: status, bold: true, size: 20, color: "1A6B1A" })] })] }),
              new TableCell({ borders, width: { size: 2280, type: WidthType.DXA }, shading: { fill: i % 2 === 0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: notes, size: 18, italics: true })] })] })
            ]})
          )
        ]
      }),

      emptyLine(),
      pageBreak(),

      // ── 10. LINKS ────────────────────────────────────────────────
      h1("10. Project Links"),
      emptyLine(),
      infoTable([
        ["Live Application", "https://week3-taskmanagement.onrender.com"],
        ["Swagger API Docs", "https://week3-taskmanagement.onrender.com/swagger-ui.html"],
        ["GitHub Repository", "https://github.com/jeevankumargujja/week3-taskmanagement"],
        ["H2 Console (local)", "http://localhost:8080/h2-console"],
        ["Swagger (local)", "http://localhost:8080/swagger-ui.html"],
      ]),
      emptyLine(),

      h1("11. Trainee Signature"),
      emptyLine(),
      infoTable([
        ["Name", "Jeevan Kumar Gujja"],
        ["Designation", "Java Developer Trainee"],
        ["Organization", "Hashclick Solutions LLC"],
        ["Report Period", "Week 4 — June 2026"],
        ["Submitted To", "HR / Training Manager"],
      ]),

      emptyLine(),
      emptyLine(),
      new Paragraph({
        children: [new TextRun({ text: "Signature: ___________________________", size: 22 })]
      }),
      emptyLine(),
      new Paragraph({
        children: [new TextRun({ text: "Date: _______________________________", size: 22 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Jeevan_Kumar_Gujja_Week4_Report.docx", buffer);
  console.log("Report generated: Jeevan_Kumar_Gujja_Week4_Report.docx");
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
