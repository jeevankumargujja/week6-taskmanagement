package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.CommentRequest;
import com.hashclick.taskmanagement.dto.CommentResponse;
import com.hashclick.taskmanagement.enums.Priority;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.model.Comment;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.CommentRepository;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.springframework.security.access.AccessDeniedException;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock CommentRepository commentRepository;
    @Mock TaskRepository    taskRepository;
    @Mock UserRepository    userRepository;

    @InjectMocks CommentService commentService;

    private User creator;
    private User stranger;
    private Task task;

    @BeforeEach
    void setup() {
        creator  = new User("Alice", "alice@test.com", "pass", Role.ROLE_USER); creator.setId(1L);
        stranger = new User("Eve",   "eve@test.com",   "pass", Role.ROLE_USER); stranger.setId(2L);

        task = new Task();
        task.setId(10L);
        task.setTitle("Task A");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(Priority.MEDIUM);
        task.setCreatedBy(creator);
    }

    @Test
    void addComment_byCreator_succeeds() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(creator));

        Comment saved = new Comment();
        saved.setId(1L); saved.setContent("Hello"); saved.setTask(task); saved.setAuthor(creator);
        when(commentRepository.save(any())).thenReturn(saved);

        CommentRequest req = new CommentRequest(); req.setContent("Hello");
        CommentResponse resp = commentService.addComment(10L, req, "alice@test.com");
        assertThat(resp.getContent()).isEqualTo("Hello");
        assertThat(resp.getAuthorName()).isEqualTo("Alice");
    }

    @Test
    void addComment_byStranger_throwsAccessDenied() {
        when(taskRepository.findById(10L)).thenReturn(Optional.of(task));
        when(userRepository.findByEmail("eve@test.com")).thenReturn(Optional.of(stranger));

        CommentRequest req = new CommentRequest(); req.setContent("Intruder");
        assertThatThrownBy(() -> commentService.addComment(10L, req, "eve@test.com"))
            .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void deleteComment_byAuthor_callsDelete() {
        Comment comment = new Comment();
        comment.setId(5L); comment.setContent("bye"); comment.setTask(task); comment.setAuthor(creator);

        when(commentRepository.findById(5L)).thenReturn(Optional.of(comment));
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(creator));

        commentService.deleteComment(5L, "alice@test.com");
        verify(commentRepository, times(1)).delete(comment);
    }

    @Test
    void deleteComment_byStranger_throwsAccessDenied() {
        Comment comment = new Comment();
        comment.setId(5L); comment.setContent("bye"); comment.setTask(task); comment.setAuthor(creator);

        when(commentRepository.findById(5L)).thenReturn(Optional.of(comment));
        when(userRepository.findByEmail("eve@test.com")).thenReturn(Optional.of(stranger));

        assertThatThrownBy(() -> commentService.deleteComment(5L, "eve@test.com"))
            .isInstanceOf(AccessDeniedException.class);
    }
}
