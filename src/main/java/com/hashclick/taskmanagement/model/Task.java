package com.hashclick.taskmanagement.model;

import com.hashclick.taskmanagement.enums.Priority;
import com.hashclick.taskmanagement.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min = 3, max = 100)
    @Column(nullable = false)
    private String title;

    @Size(max = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public Task() {}

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId()                  { return id; }
    public String getTitle()             { return title; }
    public String getDescription()       { return description; }
    public TaskStatus getStatus()        { return status; }
    public Priority getPriority()        { return priority; }
    public LocalDate getDueDate()        { return dueDate; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public User getAssignedTo()          { return assignedTo; }
    public User getCreatedBy()           { return createdBy; }

    public void setId(Long id)                  { this.id = id; }
    public void setTitle(String title)          { this.title = title; }
    public void setDescription(String desc)     { this.description = desc; }
    public void setStatus(TaskStatus status)    { this.status = status; }
    public void setPriority(Priority priority)  { this.priority = priority; }
    public void setDueDate(LocalDate d)         { this.dueDate = d; }
    public void setAssignedTo(User user)        { this.assignedTo = user; }
    public void setCreatedBy(User user)         { this.createdBy = user; }
    public void setUpdatedAt(LocalDateTime dt)  { this.updatedAt = dt; }
}
