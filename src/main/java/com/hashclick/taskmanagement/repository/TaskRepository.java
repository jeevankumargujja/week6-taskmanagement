package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByCreatedBy(User user);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToId(Long userId);

    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status <> 'DONE'")
    List<Task> findOverdueTasks(LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status <> 'DONE' AND (t.assignedTo = :user OR t.createdBy = :user)")
    List<Task> findOverdueTasksForUser(LocalDate today, User user);

    long countByStatus(TaskStatus status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.dueDate < :today AND t.status <> 'DONE'")
    long countOverdue(LocalDate today);

    List<Task> findByAssignedToOrCreatedBy(User assignedTo, User createdBy);

    List<Task> findByStatusAndAssignedToOrStatusAndCreatedBy(
        TaskStatus s1, User u1, TaskStatus s2, User u2);
}
