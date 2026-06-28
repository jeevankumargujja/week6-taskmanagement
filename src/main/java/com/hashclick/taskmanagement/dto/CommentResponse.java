package com.hashclick.taskmanagement.dto;

import com.hashclick.taskmanagement.model.Comment;
import java.time.LocalDateTime;

public class CommentResponse {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long taskId;
    private String authorName;
    private String authorEmail;

    public static CommentResponse from(Comment comment) {
        CommentResponse r = new CommentResponse();
        r.id        = comment.getId();
        r.content   = comment.getContent();
        r.createdAt = comment.getCreatedAt();
        r.updatedAt = comment.getUpdatedAt();
        r.taskId    = comment.getTask() != null ? comment.getTask().getId() : null;
        if (comment.getAuthor() != null) {
            r.authorName  = comment.getAuthor().getName();
            r.authorEmail = comment.getAuthor().getEmail();
        }
        return r;
    }

    public Long getId()                  { return id; }
    public String getContent()           { return content; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public Long getTaskId()              { return taskId; }
    public String getAuthorName()        { return authorName; }
    public String getAuthorEmail()       { return authorEmail; }
}
