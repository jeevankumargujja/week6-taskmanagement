package com.hashclick.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class ProjectRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Project name must be 3-100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Pattern(regexp = "ACTIVE|ON_HOLD|COMPLETED|CANCELLED",
             message = "Status must be ACTIVE, ON_HOLD, COMPLETED, or CANCELLED")
    private String status = "ACTIVE";

    private LocalDate startDate;
    private LocalDate endDate;

    public String getName()          { return name; }
    public String getDescription()   { return description; }
    public String getStatus()        { return status; }
    public LocalDate getStartDate()  { return startDate; }
    public LocalDate getEndDate()    { return endDate; }

    public void setName(String name)           { this.name = name; }
    public void setDescription(String desc)    { this.description = desc; }
    public void setStatus(String status)       { this.status = status; }
    public void setStartDate(LocalDate d)      { this.startDate = d; }
    public void setEndDate(LocalDate d)        { this.endDate = d; }
}
