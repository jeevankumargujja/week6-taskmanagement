package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByCreatedBy(User user);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToId(Long userId);
}
