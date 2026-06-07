package com.hashclick.taskmanagement.dto;

import com.hashclick.taskmanagement.enums.Priority;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.model.Task;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private Priority priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String assignedToName;
    private String assignedToEmail;
    private String createdByName;

    public static TaskResponse from(Task task) {
        TaskResponse r = new TaskResponse();
        r.id          = task.getId();
        r.title       = task.getTitle();
        r.description = task.getDescription();
        r.status      = task.getStatus();
        r.priority    = task.getPriority();
        r.dueDate     = task.getDueDate();
        r.createdAt   = task.getCreatedAt();
        r.updatedAt   = task.getUpdatedAt();
        r.createdByName = task.getCreatedBy() != null ? task.getCreatedBy().getName() : null;
        if (task.getAssignedTo() != null) {
            r.assignedToName  = task.getAssignedTo().getName();
            r.assignedToEmail = task.getAssignedTo().getEmail();
        }
        return r;
    }

    public Long getId()                 { return id; }
    public String getTitle()            { return title; }
    public String getDescription()      { return description; }
    public TaskStatus getStatus()       { return status; }
    public Priority getPriority()       { return priority; }
    public LocalDate getDueDate()       { return dueDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getAssignedToName()   { return assignedToName; }
    public String getAssignedToEmail()  { return assignedToEmail; }
    public String getCreatedByName()    { return createdByName; }
}
