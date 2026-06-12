package com.hashclick.taskmanagement.dto;

import com.hashclick.taskmanagement.model.User;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private int taskCount;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.id        = user.getId();
        r.name      = user.getName();
        r.email     = user.getEmail();
        r.role      = user.getRole().name();
        r.taskCount = user.getTasks().size();
        return r;
    }

    public Long getId()       { return id; }
    public String getName()   { return name; }
    public String getEmail()  { return email; }
    public String getRole()   { return role; }
    public int getTaskCount() { return taskCount; }
}
