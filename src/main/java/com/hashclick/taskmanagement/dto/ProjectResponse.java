package com.hashclick.taskmanagement.dto;

import com.hashclick.taskmanagement.model.Project;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerName;
    private String ownerEmail;
    private long taskCount;

    public static ProjectResponse from(Project project) {
        ProjectResponse r = new ProjectResponse();
        r.id          = project.getId();
        r.name        = project.getName();
        r.description = project.getDescription();
        r.status      = project.getStatus();
        r.startDate   = project.getStartDate();
        r.endDate     = project.getEndDate();
        r.createdAt   = project.getCreatedAt();
        r.updatedAt   = project.getUpdatedAt();
        if (project.getOwner() != null) {
            r.ownerName  = project.getOwner().getName();
            r.ownerEmail = project.getOwner().getEmail();
        }
        r.taskCount = project.getTasks() != null ? project.getTasks().size() : 0;
        return r;
    }

    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public String getDescription()       { return description; }
    public String getStatus()            { return status; }
    public LocalDate getStartDate()      { return startDate; }
    public LocalDate getEndDate()        { return endDate; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public String getOwnerName()         { return ownerName; }
    public String getOwnerEmail()        { return ownerEmail; }
    public long getTaskCount()           { return taskCount; }
}
