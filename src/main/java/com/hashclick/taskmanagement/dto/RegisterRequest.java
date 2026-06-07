package com.hashclick.taskmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank @Size(min = 2, max = 50) private String name;
    @NotBlank @Email                    private String email;
    @NotBlank @Size(min = 6)            private String password;

    public String getName()     { return name; }
    public String getEmail()    { return email; }
    public String getPassword() { return password; }
    public void setName(String n)    { this.name = n; }
    public void setEmail(String e)   { this.email = e; }
    public void setPassword(String p){ this.password = p; }
}
