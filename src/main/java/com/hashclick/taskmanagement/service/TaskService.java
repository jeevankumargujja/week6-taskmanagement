package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.TaskRequest;
import com.hashclick.taskmanagement.dto.TaskResponse;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse createTask(TaskRequest request, String creatorEmail) {
        User creator = findUser(creatorEmail);
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(creator);
        if (request.getAssignedToUserId() != null)
            task.setAssignedTo(findUserById(request.getAssignedToUserId()));
        return TaskResponse.from(taskRepository.save(task));
    }

    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getTaskById(Long id) {
        return TaskResponse.from(findTask(id));
    }

    public List<TaskResponse> getMyTasks(String email) {
        return taskRepository.findByAssignedTo(findUser(email)).stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status).stream().map(TaskResponse::from).toList();
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String editorEmail) {
        Task task = findTask(id);
        User editor = findUser(editorEmail);
        requireCreatorOrAdmin(task, editor);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        if (request.getAssignedToUserId() != null)
            task.setAssignedTo(findUserById(request.getAssignedToUserId()));
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateStatus(Long id, TaskStatus status, String userEmail) {
        Task task = findTask(id);
        User user = findUser(userEmail);
        boolean isAssignee = task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId());
        boolean isCreator  = task.getCreatedBy()  != null && task.getCreatedBy().getId().equals(user.getId());
        boolean isAdmin    = user.getRole().name().equals("ROLE_ADMIN");
        if (!isAdmin && !isAssignee && !isCreator)
            throw new AccessDeniedException("Not authorized to update this task's status");
        task.setStatus(status);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse assignTask(Long taskId, Long userId) {
        Task task = findTask(taskId);
        task.setAssignedTo(findUserById(userId));
        return TaskResponse.from(taskRepository.save(task));
    }

    public void deleteTask(Long id, String userEmail) {
        Task task = findTask(id);
        requireCreatorOrAdmin(task, findUser(userEmail));
        taskRepository.delete(task);
    }

    private void requireCreatorOrAdmin(Task task, User user) {
        boolean isAdmin   = user.getRole().name().equals("ROLE_ADMIN");
        boolean isCreator = task.getCreatedBy() != null && task.getCreatedBy().getId().equals(user.getId());
        if (!isAdmin && !isCreator)
            throw new AccessDeniedException("You can only modify tasks you created");
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }
}
