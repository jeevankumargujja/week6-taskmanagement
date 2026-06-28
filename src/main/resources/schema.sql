-- ============================================================
--  Task Management System — MySQL Schema (Week 6)
--  Run against: taskmanagement_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS taskmanagement_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE taskmanagement_db;

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    name       VARCHAR(50)  NOT NULL,
    email      VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'ROLE_USER',
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    INDEX      idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── projects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)  NOT NULL,
    description VARCHAR(1000),
    status      VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    start_date  DATE,
    end_date    DATE,
    created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id    BIGINT        NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_project_owner  (owner_id),
    INDEX idx_project_status (status),
    CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── tasks ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    title        VARCHAR(100) NOT NULL,
    description  VARCHAR(500),
    status       VARCHAR(20)  NOT NULL DEFAULT 'TODO',
    priority     VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM',
    due_date     DATE,
    created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    assigned_to  BIGINT,
    created_by   BIGINT       NOT NULL,
    project_id   BIGINT,
    PRIMARY KEY (id),
    INDEX idx_task_status      (status),
    INDEX idx_task_due_date    (due_date),
    INDEX idx_task_assigned_to (assigned_to),
    INDEX idx_task_created_by  (created_by),
    INDEX idx_task_project     (project_id),
    -- composite index for overdue queries
    INDEX idx_task_due_status  (due_date, status),
    CONSTRAINT fk_task_assigned FOREIGN KEY (assigned_to) REFERENCES users    (id) ON DELETE SET NULL,
    CONSTRAINT fk_task_creator  FOREIGN KEY (created_by)  REFERENCES users    (id) ON DELETE CASCADE,
    CONSTRAINT fk_task_project  FOREIGN KEY (project_id)  REFERENCES projects (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── comments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    content    VARCHAR(2000) NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    task_id    BIGINT        NOT NULL,
    author_id  BIGINT        NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_comment_task   (task_id),
    INDEX idx_comment_author (author_id),
    CONSTRAINT fk_comment_task   FOREIGN KEY (task_id)   REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
