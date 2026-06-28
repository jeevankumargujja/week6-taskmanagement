package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.enums.Priority;
import com.hashclick.taskmanagement.model.Comment;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CommentRepositoryTest {

    @Autowired CommentRepository commentRepository;
    @Autowired TaskRepository    taskRepository;
    @Autowired UserRepository    userRepository;

    private Task task;
    private User user;

    @BeforeEach
    void setup() {
        user = userRepository.save(new User("Bob", "bob@test.com", "pass", Role.ROLE_USER));
        task = new Task();
        task.setTitle("Sample Task");
        task.setStatus(TaskStatus.TODO);
        task.setPriority(Priority.MEDIUM);
        task.setCreatedBy(user);
        task = taskRepository.save(task);
    }

    @Test
    void addComment_and_findByTaskId() {
        Comment c = new Comment();
        c.setContent("First comment");
        c.setTask(task);
        c.setAuthor(user);
        commentRepository.save(c);

        List<Comment> found = commentRepository.findByTaskIdWithAuthor(task.getId());
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getContent()).isEqualTo("First comment");
        assertThat(found.get(0).getAuthor().getName()).isEqualTo("Bob");
    }

    @Test
    void findByTaskOrderByCreatedAtDesc_returnsNewestFirst() {
        for (int i = 1; i <= 3; i++) {
            Comment c = new Comment();
            c.setContent("Comment " + i);
            c.setTask(task);
            c.setAuthor(user);
            commentRepository.save(c);
        }
        List<Comment> ordered = commentRepository.findByTaskOrderByCreatedAtDesc(task);
        assertThat(ordered).hasSize(3);
        assertThat(ordered.get(0).getContent()).isEqualTo("Comment 3");
    }

    @Test
    void countByTask_returnsCorrectCount() {
        for (int i = 0; i < 4; i++) {
            Comment c = new Comment();
            c.setContent("c" + i);
            c.setTask(task);
            c.setAuthor(user);
            commentRepository.save(c);
        }
        assertThat(commentRepository.countByTask(task)).isEqualTo(4);
    }
}
