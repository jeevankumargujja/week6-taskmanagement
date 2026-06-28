-- ============================================================
--  Sample Data — Task Management System (Week 6)
--  Passwords are BCrypt hashes of 'password123'
-- ============================================================

-- ── Users ─────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(1, 'Admin User',   'admin@hashclick.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN'),
(2, 'Alice Johnson','alice@hashclick.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER'),
(3, 'Bob Smith',    'bob@hashclick.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER'),
(4, 'Carol White',  'carol@hashclick.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_USER');

-- ── Projects ──────────────────────────────────────────────────────────────────
INSERT IGNORE INTO projects (id, name, description, status, start_date, end_date, owner_id) VALUES
(1, 'Backend API Revamp',   'Refactor REST API for improved performance and scalability', 'ACTIVE',    '2026-06-01', '2026-08-31', 1),
(2, 'Mobile App Launch',    'iOS and Android app for task management on the go',          'ACTIVE',    '2026-06-15', '2026-09-30', 2),
(3, 'Database Migration',   'Migrate from H2 to MySQL with zero downtime',                'COMPLETED', '2026-05-01', '2026-06-30', 1),
(4, 'Customer Portal',      'Self-service portal for enterprise customers',               'ON_HOLD',   '2026-07-01', '2026-12-31', 3);

-- ── Tasks ─────────────────────────────────────────────────────────────────────
INSERT IGNORE INTO tasks (id, title, description, status, priority, due_date, created_by, assigned_to, project_id) VALUES
(1,  'Design database schema',       'ERD + normalization up to 3NF',            'DONE',        'HIGH',   '2026-06-10', 1, 2, 1),
(2,  'Set up JPA entities',          'User, Task, Project, Comment entities',    'DONE',        'HIGH',   '2026-06-15', 1, 2, 1),
(3,  'Implement pagination API',     'Page/size/sort params on all list endpoints', 'IN_PROGRESS','MEDIUM','2026-06-30', 1, 3, 1),
(4,  'Add query optimizations',      'Indexes, EntityGraph, N+1 fix',            'IN_PROGRESS', 'HIGH',   '2026-06-28', 1, 1, 1),
(5,  'Write integration tests',      'JUnit 5 + MockMvc test suite',             'TODO',        'MEDIUM', '2026-07-05', 1, 2, 1),
(6,  'Set up CI pipeline',           'GitHub Actions for build and test',        'TODO',        'LOW',    '2026-07-10', 2, 3, 2),
(7,  'Design mobile wireframes',     'Figma mockups for core screens',           'DONE',        'HIGH',   '2026-06-20', 2, 2, 2),
(8,  'Overdue: fix login bug',       'JWT token expiry not handled on mobile',   'TODO',        'CRITICAL','2026-06-01',3, 3, 2),
(9,  'Data migration scripts',       'ETL from H2 to MySQL',                    'DONE',        'HIGH',   '2026-06-25', 1, 1, 3),
(10, 'Validate migrated data',       'Row counts and integrity checks',          'DONE',        'HIGH',   '2026-06-28', 1, 2, 3);

-- ── Comments ──────────────────────────────────────────────────────────────────
INSERT IGNORE INTO comments (id, content, task_id, author_id) VALUES
(1, 'Schema reviewed and approved — moving to implementation.',       1, 1),
(2, 'Used draw.io for ERD, shared in Confluence.',                    1, 2),
(3, 'JPA entities are done; Hibernate DDL validated against schema.', 2, 2),
(4, 'Pagination using Spring Pageable — works on tasks and projects.',3, 3),
(5, 'Added EntityGraph to fix the N+1 on task list query.',          4, 1),
(6, 'Composite index on (due_date, status) cut overdue query by 60%.',4, 1),
(7, 'Wireframes sent to stakeholders for review.',                    7, 2),
(8, 'This is blocking the demo — needs P0 attention.',               8, 3);
