package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.DashboardStats;
import com.hashclick.taskmanagement.dto.UserResponse;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public AdminService(UserRepository userRepository, TaskRepository taskRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    public UserResponse getUserById(Long id) {
        return UserResponse.from(findUser(id));
    }

    public UserResponse changeRole(Long id, String role) {
        User user = findUser(id);
        user.setRole(Role.valueOf(role.toUpperCase().startsWith("ROLE_") ? role.toUpperCase() : "ROLE_" + role.toUpperCase()));
        return UserResponse.from(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        userRepository.delete(findUser(id));
    }

    public DashboardStats getDashboardStats() {
        long totalUsers      = userRepository.count();
        long totalTasks      = taskRepository.count();
        long todoCount       = taskRepository.countByStatus(TaskStatus.TODO);
        long inProgressCount = taskRepository.countByStatus(TaskStatus.IN_PROGRESS);
        long doneCount       = taskRepository.countByStatus(TaskStatus.DONE);
        long overdueCount    = taskRepository.countOverdue(LocalDate.now());
        return new DashboardStats(totalUsers, totalTasks, todoCount, inProgressCount, doneCount, overdueCount);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
