package com.hashclick.taskmanagement.dto;

import com.hashclick.taskmanagement.enums.Priority;
import com.hashclick.taskmanagement.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class TaskRequest {
    @NotBlank @Size(min = 3, max = 100) private String title;
    @Size(max = 500)                    private String description;
    private TaskStatus status   = TaskStatus.TODO;
    private Priority   priority = Priority.MEDIUM;
    private LocalDate  dueDate;
    private Long       assignedToUserId;

    public String getTitle()           { return title; }
    public String getDescription()     { return description; }
    public TaskStatus getStatus()      { return status; }
    public Priority getPriority()      { return priority; }
    public LocalDate getDueDate()      { return dueDate; }
    public Long getAssignedToUserId()  { return assignedToUserId; }

    public void setTitle(String t)              { this.title = t; }
    public void setDescription(String d)        { this.description = d; }
    public void setStatus(TaskStatus s)         { this.status = s; }
    public void setPriority(Priority p)         { this.priority = p; }
    public void setDueDate(LocalDate d)         { this.dueDate = d; }
    public void setAssignedToUserId(Long id)    { this.assignedToUserId = id; }
}
