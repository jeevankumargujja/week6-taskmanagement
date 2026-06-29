const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, PageBreak, ImageRun
} = require("docx");
const fs = require("fs");

const SCREENSHOTS = "C:/Users/jeeva/week3-taskmanagement/Screenshots/week6";

function screenshot(filename, widthPx, heightPx) {
  const data = fs.readFileSync(`${SCREENSHOTS}/${filename}`);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new ImageRun({
      type: "png",
      data,
      transformation: { width: widthPx, height: heightPx },
      altText: { title: filename, description: filename, name: filename }
    })]
  });
}

function screenshotWithCaption(filename, caption, widthPx, heightPx) {
  return [
    screenshot(filename, widthPx, heightPx),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
      children: [new TextRun({ text: caption, size: 16, font: "Arial", color: "666666", italics: true })]
    })
  ];
}

const BLUE       = "1F3864";
const LIGHT_BLUE = "D6E4F0";
const MID_BLUE   = "2E75B6";
const WHITE      = "FFFFFF";
const GRAY       = "F2F2F2";
const DARK_GRAY  = "404040";
const GREEN      = "1E7145";
const LIGHT_GREEN= "E2EFDA";
const RED        = "C00000";

const border = (color = "CCCCCC") => ({
  top:    { style: BorderStyle.SINGLE, size: 1, color },
  bottom: { style: BorderStyle.SINGLE, size: 1, color },
  left:   { style: BorderStyle.SINGLE, size: 1, color },
  right:  { style: BorderStyle.SINGLE, size: 1, color },
});

const noBorder = () => ({
  top:    { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right:  { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
});

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 28, color: BLUE, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: MID_BLUE, font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: DARK_GRAY, ...opts })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial", color: DARK_GRAY })]
  });
}

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2500, type: WidthType.DXA },
        borders: noBorder(),
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, font: "Arial", color: BLUE })] })]
      }),
      new TableCell({
        width: { size: 6860, type: WidthType.DXA },
        borders: noBorder(),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, font: "Arial", color: DARK_GRAY })] })]
      })
    ]
  });
}

function sectionBox(title, children) {
  return [
    heading1(title),
    ...children,
    new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun("")] })
  ];
}

function dayRow(day, items) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2000, type: WidthType.DXA },
        borders: border("BBBBBB"),
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.TOP,
        children: [new Paragraph({ children: [new TextRun({ text: day, bold: true, size: 18, font: "Arial", color: BLUE })] })]
      }),
      new TableCell({
        width: { size: 7360, type: WidthType.DXA },
        borders: border("BBBBBB"),
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: items.map(i => new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { before: 30, after: 30 },
          children: [new TextRun({ text: i, size: 18, font: "Arial", color: DARK_GRAY })]
        }))
      })
    ]
  });
}

function tableHeader(cols, widths) {
  return new TableRow({
    tableHeader: true,
    children: cols.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: border("999999"),
      shading: { fill: BLUE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: c, bold: true, size: 18, font: "Arial", color: WHITE })] })]
    }))
  });
}

function tableDataRow(cells, widths, shade = false) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: border("CCCCCC"),
      shading: { fill: shade ? GRAY : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: c, size: 18, font: "Arial", color: DARK_GRAY })] })]
    }))
  });
}

function passRow(cells, widths) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      width: { size: widths[i], type: WidthType.DXA },
      borders: border("CCCCCC"),
      shading: { fill: i === 3 ? LIGHT_GREEN : WHITE, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({
        alignment: i === 3 ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [new TextRun({ text: c, size: 18, font: "Arial", color: i === 3 ? GREEN : DARK_GRAY, bold: i === 3 })]
      })]
    }))
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 260 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } },
          children: [
            new TextRun({ text: "Task Management System  |  Week 6 Report", size: 18, font: "Arial", color: "888888" }),
            new TextRun({ text: "  |  Jeevan Kumar Gujja", size: 18, font: "Arial", color: "888888" })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } },
          children: [
            new TextRun({ text: "Hashclick Solutions LLC  |  Confidential", size: 16, font: "Arial", color: "888888" }),
            new TextRun({ text: "    Page ", size: 16, font: "Arial", color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial", color: "888888" }),
          ]
        })]
      })
    },
    children: [

      // ── TITLE BLOCK ────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: "WEEKLY PROJECT REPORT", bold: true, size: 40, font: "Arial", color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Week 6  |  June 23 – June 28, 2026", size: 24, font: "Arial", color: MID_BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 240 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: MID_BLUE, space: 6 } },
        children: [new TextRun({ text: "Task Management System", size: 22, font: "Arial", color: "666666", italics: true })]
      }),

      // ── INFO TABLE ─────────────────────────────────────────────────────────
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2500, 6860],
        rows: [
          infoRow("Name",    "Jeevan Kumar Gujja"),
          infoRow("Role",    "Java Developer"),
          infoRow("Company", "Hashclick Solutions LLC"),
          infoRow("Project", "Task Management System"),
          infoRow("Period",  "Week 6  |  June 23 – June 28, 2026"),
          infoRow("GitHub",  "https://github.com/jeevankumargujja/week6-taskmanagement"),
        ]
      }),

      new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun("")] }),

      // ── SECTION 1: EXECUTIVE SUMMARY ──────────────────────────────────────
      ...sectionBox("1.  Executive Summary", [
        para("This week focused on advanced backend development with full database integration. The Task Management System was significantly extended with two new JPA entities (Project and Comment), introducing a three-level entity relationship chain. A production-ready MySQL schema was designed with proper foreign key constraints and eight performance indexes. Query optimization was achieved through @EntityGraph (eliminating N+1 queries), pagination on all list endpoints, and a HikariCP connection pool. Exception handling was expanded with four new handlers, and 15 unit and integration tests were written — all passing."),
      ]),

      // ── SECTION 2: OBJECTIVES ─────────────────────────────────────────────
      ...sectionBox("2.  Week 6 Objectives", [
        bullet("Integrate MySQL/PostgreSQL with microservices"),
        bullet("Implement JPA/Hibernate entity relationships"),
        bullet("Add validation and exception handling"),
        bullet("Optimize queries and performance"),
        bullet("Design database schema"),
        bullet("Write sample data and test cases"),
      ]),

      // ── SECTION 3: DAILY BREAKDOWN ────────────────────────────────────────
      heading1("3.  Daily Breakdown"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2000, 7360],
        rows: [
          tableHeader(["Day", "Work Completed"], [2000, 7360]),
          dayRow("Monday\nJune 23", [
            "Analyzed existing entity structure (User, Task)",
            "Designed extended database schema for Project and Comment entities",
            "Created ERD: User → Project → Task → Comment",
            "Planned index strategy for performance optimization",
          ]),
          dayRow("Tuesday\nJune 24", [
            "Implemented Project entity with @Table indexes on owner_id and status",
            "Implemented Comment entity with @Table indexes on task_id and author_id",
            "Updated Task entity: added ManyToOne → Project, OneToMany → Comment",
            "Updated User entity relationships",
          ]),
          dayRow("Wednesday\nJune 25", [
            "Created ProjectRepository with paginated finders and aggregate queries",
            "Created CommentRepository with @EntityGraph to prevent N+1 queries",
            "Updated TaskRepository: pagination, keyword search, project stats query",
            "Added composite index on (due_date, status) for overdue query optimization",
          ]),
          dayRow("Thursday\nJune 26", [
            "Built ProjectService: full CRUD, access control, DuplicateResourceException",
            "Built CommentService: author-only edit/delete enforcement",
            "Updated TaskService: project linking, paged queries, keyword search",
            "Created PagedResponse<T> generic DTO wrapper for pagination",
          ]),
          dayRow("Friday\nJune 27", [
            "Created ProjectController with /stats endpoint for task status breakdown",
            "Created CommentController for task comment CRUD",
            "Updated TaskController with /paged and /search endpoints",
            "Expanded GlobalExceptionHandler with 4 new exception handlers",
          ]),
          dayRow("Saturday\nJune 28", [
            "Created production-ready schema.sql (MySQL DDL, FK constraints, 8 indexes)",
            "Created data.sql: 4 users, 4 projects, 10 tasks, 8 comments",
            "Wrote 15 unit and integration tests — all passing",
            "Updated README (Week 3–6) and pushed to GitHub",
          ]),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 4: TECHNICAL IMPLEMENTATIONS ──────────────────────────────
      heading1("4.  Technical Implementations"),

      heading2("4.1  Entity Relationships"),
      para("The following three-level relationship chain was implemented:"),
      bullet("Project: ManyToOne → User (owner),  OneToMany → Task"),
      bullet("Comment: ManyToOne → Task,  ManyToOne → User (author)"),
      bullet("Task (updated): ManyToOne → Project,  OneToMany → Comment"),
      bullet("Full chain: User → Project → Task → Comment"),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      heading2("4.2  Database Schema Design (MySQL)"),
      para("Four tables with FK constraints and eight performance indexes:"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          tableHeader(["Index Name", "Column(s)"], [2800, 6560]),
          tableDataRow(["idx_task_status",     "status"], [2800, 6560], false),
          tableDataRow(["idx_task_due_date",   "due_date"], [2800, 6560], true),
          tableDataRow(["idx_task_assigned_to","assigned_to"], [2800, 6560], false),
          tableDataRow(["idx_task_project",    "project_id"], [2800, 6560], true),
          tableDataRow(["idx_task_due_status", "(due_date, status)  — composite"], [2800, 6560], false),
          tableDataRow(["idx_project_owner",   "owner_id"], [2800, 6560], true),
          tableDataRow(["idx_comment_task",    "task_id"], [2800, 6560], false),
          tableDataRow(["idx_comment_author",  "author_id"], [2800, 6560], true),
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      heading2("4.3  Query Optimization"),
      bullet("@EntityGraph on task/comment list queries — eliminates N+1 database calls"),
      bullet("@Transactional(readOnly=true) on all read methods"),
      bullet("Paginated Page<T> responses replacing List<T> on all list endpoints"),
      bullet("Keyword search using JPQL LOWER(CONCAT('%'...)) for case-insensitive matching"),
      bullet("Aggregate query countByStatusForProject using GROUP BY — avoids loading full entity list"),
      bullet("HikariCP connection pool: max-pool-size=10, min-idle=2"),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      heading2("4.4  New API Endpoints"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1400, 3960, 4000],
        rows: [
          tableHeader(["Method", "Endpoint", "Description"], [1400, 3960, 4000]),
          tableDataRow(["POST",   "/api/projects",              "Create a new project"], [1400, 3960, 4000], false),
          tableDataRow(["GET",    "/api/projects",              "Get all projects (paginated)"], [1400, 3960, 4000], true),
          tableDataRow(["GET",    "/api/projects/{id}",         "Get project by ID"], [1400, 3960, 4000], false),
          tableDataRow(["PUT",    "/api/projects/{id}",         "Update a project"], [1400, 3960, 4000], true),
          tableDataRow(["DELETE", "/api/projects/{id}",         "Delete a project"], [1400, 3960, 4000], false),
          tableDataRow(["GET",    "/api/projects/{id}/tasks",   "Get project tasks (paginated)"], [1400, 3960, 4000], true),
          tableDataRow(["GET",    "/api/projects/{id}/stats",   "Task status stats for project"], [1400, 3960, 4000], false),
          tableDataRow(["POST",   "/api/tasks/{id}/comments",   "Add comment to a task"], [1400, 3960, 4000], true),
          tableDataRow(["GET",    "/api/tasks/{id}/comments",   "Get all comments on a task"], [1400, 3960, 4000], false),
          tableDataRow(["PUT",    "/api/comments/{id}",         "Update comment (author/admin)"], [1400, 3960, 4000], true),
          tableDataRow(["DELETE", "/api/comments/{id}",         "Delete comment (author/admin)"], [1400, 3960, 4000], false),
          tableDataRow(["GET",    "/api/tasks/paged",           "Paginated task list"], [1400, 3960, 4000], true),
          tableDataRow(["GET",    "/api/tasks/search",          "Keyword search across tasks"], [1400, 3960, 4000], false),
        ]
      }),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      heading2("4.5  Exception Handling"),
      bullet("DuplicateResourceException → HTTP 409 Conflict (duplicate project name)"),
      bullet("MethodArgumentTypeMismatchException → HTTP 400 with clear message"),
      bullet("MissingServletRequestParameterException → HTTP 400 with parameter name"),
      bullet("All prior handlers retained: ResourceNotFoundException, AccessDeniedException, BadCredentialsException"),
      new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] }),

      heading2("4.6  Validation"),
      bullet("@NotBlank and @Size on all entity fields"),
      bullet("@Pattern on ProjectRequest.status — enforces ACTIVE|ON_HOLD|COMPLETED|CANCELLED"),
      bullet("@Valid enforced on all controller request bodies"),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 5: TEST RESULTS ───────────────────────────────────────────
      heading1("5.  Test Results"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3200, 2160, 1800, 2200],
        rows: [
          tableHeader(["Test Class", "Type", "Tests", "Result"], [3200, 2160, 1800, 2200]),
          passRow(["ProjectRepositoryTest", "@DataJpaTest",  "4", "PASS"], [3200, 2160, 1800, 2200]),
          passRow(["CommentRepositoryTest", "@DataJpaTest",  "4", "PASS"], [3200, 2160, 1800, 2200]),
          passRow(["ProjectServiceTest",    "Mockito Unit",  "4", "PASS"], [3200, 2160, 1800, 2200]),
          passRow(["CommentServiceTest",    "Mockito Unit",  "4", "PASS"], [3200, 2160, 1800, 2200]),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3200, type: WidthType.DXA },
                borders: border("999999"),
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "TOTAL", bold: true, size: 18, font: "Arial", color: WHITE })] })]
              }),
              new TableCell({
                width: { size: 2160, type: WidthType.DXA },
                borders: border("999999"),
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "", size: 18, font: "Arial", color: WHITE })] })]
              }),
              new TableCell({
                width: { size: 1800, type: WidthType.DXA },
                borders: border("999999"),
                shading: { fill: BLUE, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "15", bold: true, size: 18, font: "Arial", color: WHITE })] })]
              }),
              new TableCell({
                width: { size: 2200, type: WidthType.DXA },
                borders: border("999999"),
                shading: { fill: GREEN, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "ALL PASS", bold: true, size: 18, font: "Arial", color: WHITE })] })]
              }),
            ]
          })
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun("")] }),

      // ── SECTION 6: FILES ──────────────────────────────────────────────────
      heading1("6.  Files Created / Modified"),

      heading2("New Files (19)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          tableHeader(["File", "Purpose"], [3600, 5760]),
          tableDataRow(["model/Project.java",           "Project entity with owner and tasks"], [3600, 5760], false),
          tableDataRow(["model/Comment.java",           "Comment entity linked to task and author"], [3600, 5760], true),
          tableDataRow(["repository/ProjectRepository", "Paginated queries and duplicate check"], [3600, 5760], false),
          tableDataRow(["repository/CommentRepository", "@EntityGraph queries and count"], [3600, 5760], true),
          tableDataRow(["service/ProjectService",       "CRUD, access control, duplicate guard"], [3600, 5760], false),
          tableDataRow(["service/CommentService",       "Comment CRUD with author enforcement"], [3600, 5760], true),
          tableDataRow(["controller/ProjectController", "REST endpoints including /stats"], [3600, 5760], false),
          tableDataRow(["controller/CommentController", "REST endpoints for task comments"], [3600, 5760], true),
          tableDataRow(["dto/ProjectRequest/Response",  "Project input/output DTOs"], [3600, 5760], false),
          tableDataRow(["dto/CommentRequest/Response",  "Comment input/output DTOs"], [3600, 5760], true),
          tableDataRow(["dto/PagedResponse<T>",         "Generic pagination wrapper"], [3600, 5760], false),
          tableDataRow(["exception/DuplicateResource",  "409 Conflict exception"], [3600, 5760], true),
          tableDataRow(["resources/schema.sql",         "MySQL DDL with indexes and FK constraints"], [3600, 5760], false),
          tableDataRow(["resources/data.sql",           "Sample data for local demo"], [3600, 5760], true),
          tableDataRow(["test/ProjectRepositoryTest",   "@DataJpaTest — 4 tests"], [3600, 5760], false),
          tableDataRow(["test/CommentRepositoryTest",   "@DataJpaTest — 4 tests"], [3600, 5760], true),
          tableDataRow(["test/ProjectServiceTest",      "Mockito unit — 4 tests"], [3600, 5760], false),
          tableDataRow(["test/CommentServiceTest",      "Mockito unit — 4 tests"], [3600, 5760], true),
          tableDataRow(["test/resources/application",  "Disable SQL init during tests"], [3600, 5760], false),
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 60 }, children: [new TextRun("")] }),

      heading2("Modified Files (8)"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3600, 5760],
        rows: [
          tableHeader(["File", "Changes"], [3600, 5760]),
          tableDataRow(["model/Task.java",              "Added project FK, comments list, DB indexes"], [3600, 5760], false),
          tableDataRow(["repository/TaskRepository",    "Pagination, @EntityGraph, search, stats query"], [3600, 5760], true),
          tableDataRow(["service/TaskService",          "Project linking, paged queries, search"], [3600, 5760], false),
          tableDataRow(["controller/TaskController",    "/paged and /search endpoints"], [3600, 5760], true),
          tableDataRow(["dto/TaskRequest",              "Added projectId field"], [3600, 5760], false),
          tableDataRow(["dto/TaskResponse",             "Added projectId, projectName fields"], [3600, 5760], true),
          tableDataRow(["exception/GlobalException",    "4 new exception handlers"], [3600, 5760], false),
          tableDataRow(["resources/application",       "HikariCP config, show-sql enabled"], [3600, 5760], true),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ── SECTION 7: GITHUB ─────────────────────────────────────────────────
      ...sectionBox("7.  GitHub", [
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2500, 6860],
          rows: [
            infoRow("Repository", "https://github.com/jeevankumargujja/week6-taskmanagement"),
            infoRow("Branch",     "main"),
            infoRow("Commits",    "3 commits this week"),
          ]
        })
      ]),

      // ── SECTION 8: CHALLENGES ─────────────────────────────────────────────
      heading1("8.  Challenges & Solutions"),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          tableHeader(["Challenge", "Solution"], [4680, 4680]),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "N+1 query problem when loading tasks with related User data", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Applied @EntityGraph to eagerly load associations in a single JOIN query", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                shading: { fill: GRAY, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "data.sql INSERT IGNORE (MySQL syntax) caused @DataJpaTest to fail on H2", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Created test/resources/application.properties with spring.sql.init.mode=never", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Pagination endpoints returning inconsistent response structures", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: border("CCCCCC"),
                shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 },
                children: [new Paragraph({ children: [new TextRun({ text: "Created generic PagedResponse<T> wrapper DTO for all paginated responses", size: 18, font: "Arial", color: DARK_GRAY })] })]
              }),
            ]
          }),
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun("")] }),

      // ── SECTION 9: NEXT STEPS ─────────────────────────────────────────────
      ...sectionBox("9.  Next Steps  (Week 7 Preview)", [
        bullet("Add caching layer using Redis or Spring Cache"),
        bullet("Implement API rate limiting"),
        bullet("Add audit logging for entity changes"),
        bullet("Explore Docker Compose setup (app + MySQL)"),
        bullet("Add comprehensive integration tests with TestContainers"),
      ]),

      // ── SECTION 10: SCREENSHOTS ───────────────────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),
      heading1("10.  Application Screenshots"),

      heading2("10.1  Login Page"),
      ...screenshotWithCaption("01_login_page.png", "Fig 1 — Task Management System Login Page (localhost:8080)", 620, 390),

      heading2("10.2  Swagger API Overview"),
      ...screenshotWithCaption("02_swagger_overview.png", "Fig 2 — Swagger UI with all API groups (Admin, Comments, Projects, Tasks)", 620, 390),

      heading2("10.3  Projects API Endpoints"),
      ...screenshotWithCaption("03_swagger_projects.png", "Fig 3 — New Projects endpoints: CRUD, /tasks, /stats (Week 6 addition)", 620, 390),

      heading2("10.4  Comments API Endpoints"),
      ...screenshotWithCaption("04_swagger_comments.png", "Fig 4 — New Comments endpoints for task collaboration (Week 6 addition)", 620, 390),

      heading2("10.5  H2 In-Memory Database Console"),
      ...screenshotWithCaption("05_h2_console.png", "Fig 5 — H2 Console at /h2-console — dev database browser", 620, 390),

      heading2("10.6  Projects API Response (Paginated)"),
      ...screenshotWithCaption("06_api_projects_response.png", "Fig 6 — GET /api/projects — paginated response with taskCount and owner info", 620, 390),

      heading2("10.7  Tasks Paginated API Response"),
      ...screenshotWithCaption("07_api_tasks_paged.png", "Fig 7 — GET /api/tasks/paged — PagedResponse with page metadata", 620, 390),

      heading2("10.8  Task Comments API Response"),
      ...screenshotWithCaption("08_api_comments_response.png", "Fig 8 — GET /api/tasks/1/comments — comments with author info ordered newest-first", 620, 390),

      heading2("10.9  Project Stats API Response"),
      ...screenshotWithCaption("09_project_stats_response.png", "Fig 9 — GET /api/projects/1/stats — task status breakdown using aggregate query", 620, 390),

      new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun("")] }),

      // ── SIGNATURE BLOCK ───────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 200, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 6 } },
        children: [new TextRun("")]
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: noBorder(),
                margins: { top: 80, bottom: 80, left: 0, right: 120 },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Submitted by:", size: 18, font: "Arial", color: "888888" })] }),
                  new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: "Jeevan Kumar Gujja", bold: true, size: 22, font: "Arial", color: BLUE })] }),
                  new Paragraph({ children: [new TextRun({ text: "Java Developer", size: 18, font: "Arial", color: DARK_GRAY })] }),
                  new Paragraph({ children: [new TextRun({ text: "Hashclick Solutions LLC", size: 18, font: "Arial", color: DARK_GRAY })] }),
                ]
              }),
              new TableCell({
                width: { size: 4680, type: WidthType.DXA },
                borders: noBorder(),
                margins: { top: 80, bottom: 80, left: 120, right: 0 },
                children: [
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Date Submitted:", size: 18, font: "Arial", color: "888888" })] }),
                  new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 40 }, children: [new TextRun({ text: "June 28, 2026", bold: true, size: 22, font: "Arial", color: BLUE })] }),
                ]
              }),
            ]
          })
        ]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Jeevan_Kumar_Gujja_Week6_Report.docx", buf);
  console.log("Done: Jeevan_Kumar_Gujja_Week6_Report.docx");
});
