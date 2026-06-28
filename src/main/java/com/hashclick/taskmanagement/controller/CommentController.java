package com.hashclick.taskmanagement.controller;

import com.hashclick.taskmanagement.dto.CommentRequest;
import com.hashclick.taskmanagement.dto.CommentResponse;
import com.hashclick.taskmanagement.service.CommentService;
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
@RequestMapping("/api")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Comments", description = "Task comment endpoints")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/tasks/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Add a comment to a task")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long taskId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(201).body(commentService.addComment(taskId, request, user.getUsername()));
    }

    @GetMapping("/tasks/{taskId}/comments")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Get all comments for a task")
    public ResponseEntity<List<CommentResponse>> getTaskComments(
            @PathVariable Long taskId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(commentService.getTaskComments(taskId, user.getUsername()));
    }

    @PutMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Update a comment (author or admin only)")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request, user.getUsername()));
    }

    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @Operation(summary = "Delete a comment (author or admin only)")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails user) {
        commentService.deleteComment(commentId, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
