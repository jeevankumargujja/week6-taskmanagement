package com.hashclick.taskmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects", indexes = {
    @Index(name = "idx_project_owner", columnList = "owner_id"),
    @Index(name = "idx_project_status", columnList = "status")
})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min = 3, max = 100)
    @Column(nullable = false)
    private String name;

    @Size(max = 1000)
    private String description;

    @Column(nullable = false)
    private String status = "ACTIVE";

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks = new ArrayList<>();

    public Project() {}

    @PreUpdate
    public void onUpdate() { this.updatedAt = LocalDateTime.now(); }

    public Long getId()                  { return id; }
    public String getName()              { return name; }
    public String getDescription()       { return description; }
    public String getStatus()            { return status; }
    public LocalDate getStartDate()      { return startDate; }
    public LocalDate getEndDate()        { return endDate; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public User getOwner()               { return owner; }
    public List<Task> getTasks()         { return tasks; }

    public void setId(Long id)                   { this.id = id; }
    public void setName(String name)             { this.name = name; }
    public void setDescription(String desc)      { this.description = desc; }
    public void setStatus(String status)         { this.status = status; }
    public void setStartDate(LocalDate d)        { this.startDate = d; }
    public void setEndDate(LocalDate d)          { this.endDate = d; }
    public void setOwner(User owner)             { this.owner = owner; }
    public void setTasks(List<Task> tasks)       { this.tasks = tasks; }
    public void setUpdatedAt(LocalDateTime dt)   { this.updatedAt = dt; }
}
