package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.CommentRequest;
import com.hashclick.taskmanagement.dto.CommentResponse;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.Comment;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.CommentRepository;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository    taskRepository;
    private final UserRepository    userRepository;

    public CommentService(CommentRepository commentRepository,
                          TaskRepository taskRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.taskRepository    = taskRepository;
        this.userRepository    = userRepository;
    }

    public CommentResponse addComment(Long taskId, CommentRequest request, String authorEmail) {
        Task task   = findTask(taskId);
        User author = findUser(authorEmail);

        if (!isAdmin(author) && !isParticipant(task, author))
            throw new AccessDeniedException("You must be involved in the task to comment");

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setAuthor(author);
        return CommentResponse.from(commentRepository.save(comment));
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getTaskComments(Long taskId, String email) {
        Task task = findTask(taskId);
        User user = findUser(email);
        if (!isAdmin(user) && !isParticipant(task, user))
            throw new AccessDeniedException("You don't have access to this task's comments");
        return commentRepository.findByTaskIdWithAuthor(taskId)
            .stream().map(CommentResponse::from).toList();
    }

    public CommentResponse updateComment(Long commentId, CommentRequest request, String email) {
        Comment comment = findComment(commentId);
        User user = findUser(email);
        if (!isAdmin(user) && !comment.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("You can only edit your own comments");
        comment.setContent(request.getContent());
        return CommentResponse.from(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId, String email) {
        Comment comment = findComment(commentId);
        User user = findUser(email);
        if (!isAdmin(user) && !comment.getAuthor().getId().equals(user.getId()))
            throw new AccessDeniedException("You can only delete your own comments");
        commentRepository.delete(comment);
    }

    private boolean isAdmin(User user) { return user.getRole() == Role.ROLE_ADMIN; }

    private boolean isParticipant(Task task, User user) {
        return (task.getCreatedBy() != null && task.getCreatedBy().getId().equals(user.getId())) ||
               (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId()));
    }

    private Comment findComment(Long id) {
        return commentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + id));
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
