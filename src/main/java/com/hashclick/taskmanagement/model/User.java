package com.hashclick.taskmanagement.model;

import com.hashclick.taskmanagement.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(min = 2, max = 50)
    @Column(nullable = false)
    private String name;

    @NotBlank @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.ROLE_USER;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Task> tasks = new ArrayList<>();

    public User() {}
    public User(String name, String email, String password, Role role) {
        this.name = name; this.email = email;
        this.password = password; this.role = role;
    }

    public Long getId()           { return id; }
    public String getName()       { return name; }
    public String getEmail()      { return email; }
    public String getPassword()   { return password; }
    public Role getRole()         { return role; }
    public List<Task> getTasks()  { return tasks; }

    public void setId(Long id)           { this.id = id; }
    public void setName(String name)     { this.name = name; }
    public void setEmail(String email)   { this.email = email; }
    public void setPassword(String p)    { this.password = p; }
    public void setRole(Role role)       { this.role = role; }
    public void setTasks(List<Task> t)   { this.tasks = t; }
}
