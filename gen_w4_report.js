const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, Header, Footer, LevelFormat, PageBreak, ImageRun
} = require('docx');
const fs = require('fs');

const CONTENT_W = 9360; // 8.5" - 2x1" margins in DXA

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

function imgPara(filePath, widthPx, heightPx, caption) {
  const data = fs.readFileSync(filePath);
  // scale to fit content width (max 600px wide in doc)
  const maxW = 600;
  let w = widthPx, h = heightPx;
  if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
  const items = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "png", data, transformation: { width: w, height: h }, altText: { title: caption, description: caption, name: caption } })]
    })
  ];
  if (caption) {
    items.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [new TextRun({ text: caption, italics: true, size: 18, color: "666666", font: "Calibri" })]
    }));
  }
  return items;
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

function featureRow(no, feature, detail, shade) {
  return new TableRow({ children: [
    new TableCell({ borders: allBorders, width: { size: 600, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: no, bold: true, size: 20, font: "Calibri" })] })] }),
    new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: feature, bold: true, size: 20, font: "Calibri" })] })] }),
    new TableCell({ borders: allBorders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: shade, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: detail, size: 20, font: "Calibri" })] })] })
  ]});
}

const SHOTS = "C:\\Users\\jeeva\\week3-taskmanagement\\Screenshots\\";

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
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
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "2E74B5", space: 1 } },
        children: [new TextRun({ text: "Hashclick Solutions", size: 18, color: "555555", font: "Calibri" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: "2E74B5", space: 1 } },
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: "Page ", size: 18, color: "555555", font: "Calibri" }),
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "555555" }),
          new TextRun({ text: " of ", size: 18, color: "555555", font: "Calibri" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "555555" }),
        ]
      })] })
    },
    children: [

      // ── COVER ─────────────────────────────────────────────────────
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 80 },
        children: [new TextRun({ text: "WEEKLY TRAINING REPORT", bold: true, size: 52, color: "1F3864", font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Week 4  —  Advanced Features & Cloud Deployment", size: 30, color: "2E74B5", font: "Calibri" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 400 },
        children: [new TextRun({ text: "Task Management System  |  Hashclick Solutions LLC", size: 22, color: "888888", font: "Calibri" })] }),

      infoTable([
        ["Trainee Name",  "Jeevan Kumar Gujja"],
        ["Organization",  "Hashclick Solutions LLC"],
        ["Program",       "Java Developer"],
        ["Week",          "Week 4 (Final Week)"],
        ["Report Date",   "June 2026"],
        ["Project",       "Task Management System"],
        ["Live URL",      "https://week3-taskmanagement.onrender.com"],
        ["Swagger Docs",  "https://week3-taskmanagement.onrender.com/swagger-ui.html"],
      ]),

      blank(), br(),

      // ── 1. OVERVIEW ───────────────────────────────────────────────
      h1("1. Week 4 Overview"),
      p("Week 4 extended the Week 3 Task Management System with enterprise-grade features. The focus was on Role-Based Access Control (RBAC), an Admin Panel, overdue task detection, asynchronous email notifications, Swagger API documentation, and deploying the application live to the cloud via Docker on Render."),
      blank(),

      h2("Features Completed This Week"),
      blank(),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [600, 2400, 6360],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: allBorders, width: { size: 600, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "#", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Feature", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
          ]}),
          featureRow("1", "RBAC", "@PreAuthorize on all endpoints. ADMIN sees everything; USER sees own tasks only.", "EBF3FB"),
          featureRow("2", "Admin Panel", "Admin-only UI to list users, promote/demote roles, and delete users.", "FFFFFF"),
          featureRow("3", "Overdue Detection", "Overdue flag on tasks, red badge in UI, daily 8AM alert scheduler.", "EBF3FB"),
          featureRow("4", "Notifications", "Async email on task assignment via @Async + NotificationService.", "FFFFFF"),
          featureRow("5", "Input Validation", "@Valid + @NotBlank/@Email/@Size enforced with structured error responses.", "EBF3FB"),
          featureRow("6", "Swagger / OpenAPI", "Live interactive API docs with JWT auth support at /swagger-ui.html.", "FFFFFF"),
          featureRow("7", "Docker", "Two-stage Dockerfile: Maven build stage + JRE alpine runtime.", "EBF3FB"),
          featureRow("8", "Cloud Deployment", "Deployed to Render (free tier). Auto-deploys on GitHub push.", "FFFFFF"),
        ]
      }),
      blank(), br(),

      // ── 2. SCREENSHOTS ────────────────────────────────────────────
      h1("2. Application Screenshots"),

      h2("2.1  Login Page"),
      p("Login page at localhost:8080 — users log in or register and receive a JWT token."),
      ...imgPara(SHOTS + "loginpage.png", 1366, 768, "Figure 1 — Login Page"),

      h2("2.2  Task Dashboard — USER Role"),
      p("Logged in as a USER — stats bar plus a grid of the user's own tasks."),
      ...imgPara(SHOTS + "task_mangement_info.png", 1366, 768, "Figure 2 — Task Dashboard (USER role)"),

      h2("2.3  JWT Authentication — Login API"),
      p("POST /api/auth/login returns a JWT token, name, email, and role for use in the Authorization header."),
      ...imgPara(SHOTS + "02_login_user.png", 1366, 700, "Figure 3 — Login API returning JWT token (Postman)"),

      h2("2.4  Create Task API"),
      p("POST /api/tasks creates a task. Requires the JWT token and validates all input fields."),
      ...imgPara(SHOTS + "03_create_task.png", 1366, 700, "Figure 4 — Create Task API with JWT auth (Postman)"),

      h2("2.5  Render — Cloud Deployment"),
      p("Deployed on Render via Docker. Auto-deploys on every GitHub push."),
      ...imgPara(SHOTS + "deployemnt_sucess.png", 1366, 700, "Figure 5 — Render deployment dashboard"),


      // ── 3. ACCESS CONTROL ─────────────────────────────────────────
      h1("3. Role-Based Access Control (RBAC)"),
      p("RBAC is enforced using Spring Security's @PreAuthorize annotation at the method level. Every API endpoint checks the user's role from the JWT token before executing."),
      blank(),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [4560, 2400, 2400],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: allBorders, width: { size: 4560, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Action", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ROLE_USER", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ROLE_ADMIN", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
          ]}),
          ...[
            ["Register / Login",                "Yes", "Yes"],
            ["Create task",                     "Yes", "Yes"],
            ["View own tasks",                  "Yes", "Yes"],
            ["View ALL tasks",                  "No",  "Yes"],
            ["Update / Delete own task",        "Yes", "Yes"],
            ["Assign task to user",             "No",  "Yes"],
            ["View overdue tasks",              "Own", "All"],
            ["Manage users (promote/delete)",   "No",  "Yes"],
            ["View dashboard stats",            "No",  "Yes"],
          ].map(([action, user, admin], i) =>
            new TableRow({ children: [
              new TableCell({ borders: allBorders, width: { size: 4560, type: WidthType.DXA }, shading: { fill: i%2===0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: action, size: 20, font: "Calibri" })] })] }),
              new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: i%2===0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: user, bold: true, size: 20, font: "Calibri", color: user==="Yes"||user==="Own" ? "1A6B1A" : "B81A1A" })] })] }),
              new TableCell({ borders: allBorders, width: { size: 2400, type: WidthType.DXA }, shading: { fill: i%2===0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: admin, bold: true, size: 20, font: "Calibri", color: "1A6B1A" })] })] }),
            ]})
          )
        ]
      }),
      blank(), br(),

      // ── 4. NEW FILES ─────────────────────────────────────────────
      h1("4. New Files Created (Week 4)"),
      bul("AdminController.java — Admin-only REST endpoints (users, stats, role change, delete)"),
      bul("AdminService.java — Business logic for all admin operations"),
      bul("NotificationService.java — @Async email notifications for task assignment and overdue"),
      bul("OverdueAlertScheduler.java — @Scheduled daily 8AM overdue alert job"),
      bul("UserResponse.java — DTO with id, name, email, role, taskCount"),
      bul("DashboardStats.java — DTO for admin stats endpoint"),
      bul("OpenApiConfig.java — Swagger bearer auth scheme and API metadata"),
      bul("application-prod.properties — Production config (env vars, H2 default, MySQL opt-in)"),
      bul("Dockerfile — Two-stage build: Maven + JRE alpine"),
      bul("railway.json / Procfile / .env.example — Cloud deployment config files"),
      blank(),

      h1("5. Key Files Modified (Week 4)"),
      bul("TaskController.java", "@PreAuthorize on all endpoints; overdue endpoint added"),
      bul("TaskService.java", "RBAC-aware queries; getAllTasksForUser(); notifications called"),
      bul("TaskRepository.java", "findOverdueTasks(), countOverdue(), countByStatus() added"),
      bul("TaskResponse.java", "overdue boolean flag and assignedToId field added"),
      bul("SecurityConfig.java", "Swagger routes permitAll; /api/admin/** rule"),
      bul("TaskManagementApplication.java", "@EnableScheduling + @EnableAsync added"),
      bul("index.html", "Admin panel section; overdue badge + filter + stat counter"),
      bul("pom.xml", "springdoc-openapi 2.5.0 + spring-boot-starter-mail added"),
      blank(), br(),

      // ── 5. CHALLENGES ─────────────────────────────────────────────
      h1("6. Challenges & Solutions"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [3600, 5760],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: allBorders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Challenge", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Solution", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
          ]}),
          ...[
            ["Render has no Java runtime — only Docker", "Created two-stage Dockerfile; Stage 1 builds JAR with Maven, Stage 2 runs with JRE alpine"],
            ["Deployment failed — MySQL connection error", "Fixed application-prod.properties to default to H2; MySQL is now opt-in via DATABASE_URL env var"],
            ["Maven not in system PATH", "Downloaded Apache Maven 3.9.6 locally and used full path to mvn.cmd"],
            ["User delete failed with 500 error", "Foreign key constraint — deleted user's tasks first via H2 Console, then deleted user"],
            ["Port 8080 already in use on restart", "Found PID with netstat, killed process, then restarted Spring Boot"],
          ].map(([c, s], i) =>
            new TableRow({ children: [
              new TableCell({ borders: allBorders, width: { size: 3600, type: WidthType.DXA }, shading: { fill: i%2===0 ? "FFF2CC" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: c, size: 20, font: "Calibri" })] })] }),
              new TableCell({ borders: allBorders, width: { size: 5760, type: WidthType.DXA }, shading: { fill: i%2===0 ? "E2EFDA" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: s, size: 20, font: "Calibri" })] })] }),
            ]})
          )
        ]
      }),
      blank(), br(),

      // ── 6. DELIVERABLES ───────────────────────────────────────────
      h1("7. Deliverables — Status"),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [6240, 3120],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: allBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: "Deliverable", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
            new TableCell({ borders: allBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: "1F3864", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Status", bold: true, size: 20, color: "FFFFFF", font: "Calibri" })] })] }),
          ]}),
          ...[
            "RBAC with @PreAuthorize on all endpoints",
            "Admin Controller — 5 admin endpoints",
            "Admin Panel in frontend (promote/demote/delete users)",
            "Overdue task detection, badge, filter, scheduler",
            "Async email notifications (@Async)",
            "Input validation (@Valid) with error responses",
            "Swagger / OpenAPI docs at /swagger-ui.html",
            "Two-stage Dockerfile",
            "Deployed live on Render — https://week3-taskmanagement.onrender.com",
            "README updated with Week 3 + Week 4 documentation",
            "Presentation slides (11 slides)",
            "Demo script",
            "Weekly Report",
          ].map((item, i) =>
            new TableRow({ children: [
              new TableCell({ borders: allBorders, width: { size: 6240, type: WidthType.DXA }, shading: { fill: i%2===0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: item, size: 20, font: "Calibri" })] })] }),
              new TableCell({ borders: allBorders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: i%2===0 ? "EBF3FB" : "FFFFFF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Completed", bold: true, size: 20, color: "1A6B1A", font: "Calibri" })] })] }),
            ]})
          )
        ]
      }),
      blank(), br(),

      // ── 7. SIGNATURE ─────────────────────────────────────────────
      h1("8. Trainee Declaration"),
      p("I confirm that all tasks assigned for Week 4 have been completed, tested, and deployed as described in this report."),
      blank(),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Student Signature", bold: true, size: 22, font: "Calibri" })] }),
      new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: "______________________________", size: 22, font: "Calibri" })] }),
      new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Date", bold: true, size: 22, font: "Calibri" })] }),
      new Paragraph({ children: [new TextRun({ text: "______________________________", size: 22, font: "Calibri" })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Jeevan_Kumar_Gujja_Week4_Report.docx", buf);
  console.log("Done: Jeevan_Kumar_Gujja_Week4_Report.docx");
}).catch(e => { console.error(e); process.exit(1); });
