package com.hashclick.taskmanagement.controller;

import com.hashclick.taskmanagement.dto.TaskRequest;
import com.hashclick.taskmanagement.dto.TaskResponse;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request,
                                                   @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(201).body(taskService.createTask(request, user.getUsername()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Get all tasks (admin sees all, user sees own)")
    public ResponseEntity<List<TaskResponse>> getAllTasks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getAllTasksForUser(user.getUsername()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Get a task by ID")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id,
                                                @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getTaskById(id, user.getUsername()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Get tasks assigned to me")
    public ResponseEntity<List<TaskResponse>> getMyTasks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getMyTasks(user.getUsername()));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Get overdue tasks")
    public ResponseEntity<List<TaskResponse>> getOverdueTasks(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getOverdueTasks(user.getUsername()));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Filter tasks by status")
    public ResponseEntity<List<TaskResponse>> getByStatus(@PathVariable TaskStatus status,
                                                          @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.getTasksByStatus(status, user.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Update a task (creator or admin only)")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                   @Valid @RequestBody TaskRequest request,
                                                   @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.updateTask(id, request, user.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Update task status (assignee, creator, or admin)")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable Long id,
                                                     @RequestParam TaskStatus status,
                                                     @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(taskService.updateStatus(id, status, user.getUsername()));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign task to user (admin only)")
    public ResponseEntity<TaskResponse> assignTask(@PathVariable Long id,
                                                   @RequestParam Long userId) {
        return ResponseEntity.ok(taskService.assignTask(id, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Delete a task (creator or admin only)")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails user) {
        taskService.deleteTask(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
