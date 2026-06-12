package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.TaskRequest;
import com.hashclick.taskmanagement.dto.TaskResponse;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.enums.TaskStatus;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                       NotificationService notificationService) {
        this.taskRepository      = taskRepository;
        this.userRepository      = userRepository;
        this.notificationService = notificationService;
    }

    public TaskResponse createTask(TaskRequest request, String creatorEmail) {
        User creator = findUser(creatorEmail);
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO);
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setCreatedBy(creator);
        if (request.getAssignedToUserId() != null) {
            User assignee = findUserById(request.getAssignedToUserId());
            task.setAssignedTo(assignee);
            notificationService.notifyTaskAssigned(assignee, task);
        }
        return TaskResponse.from(taskRepository.save(task));
    }

    /** Admin sees all tasks; regular users see only their own (created or assigned). */
    public List<TaskResponse> getAllTasksForUser(String email) {
        User user = findUser(email);
        if (isAdmin(user))
            return taskRepository.findAll().stream().map(TaskResponse::from).toList();
        return taskRepository.findByAssignedToOrCreatedBy(user, user)
                .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse getTaskById(Long id, String email) {
        Task task = findTask(id);
        User user = findUser(email);
        if (!isAdmin(user) && !isParticipant(task, user))
            throw new AccessDeniedException("You don't have access to this task");
        return TaskResponse.from(task);
    }

    public List<TaskResponse> getMyTasks(String email) {
        return taskRepository.findByAssignedTo(findUser(email)).stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getOverdueTasks(String email) {
        User user = findUser(email);
        if (isAdmin(user))
            return taskRepository.findOverdueTasks(LocalDate.now()).stream().map(TaskResponse::from).toList();
        return taskRepository.findOverdueTasksForUser(LocalDate.now(), user)
                .stream().map(TaskResponse::from).toList();
    }

    public List<TaskResponse> getTasksByStatus(TaskStatus status, String email) {
        User user = findUser(email);
        if (isAdmin(user))
            return taskRepository.findByStatus(status).stream().map(TaskResponse::from).toList();
        return taskRepository.findByStatusAndAssignedToOrStatusAndCreatedBy(status, user, status, user)
                .stream().map(TaskResponse::from).toList();
    }

    public TaskResponse updateTask(Long id, TaskRequest request, String editorEmail) {
        Task task = findTask(id);
        User editor = findUser(editorEmail);
        requireCreatorOrAdmin(task, editor);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : task.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        if (request.getAssignedToUserId() != null) {
            User newAssignee = findUserById(request.getAssignedToUserId());
            boolean reassigned = task.getAssignedTo() == null ||
                                 !task.getAssignedTo().getId().equals(newAssignee.getId());
            task.setAssignedTo(newAssignee);
            if (reassigned) notificationService.notifyTaskAssigned(newAssignee, task);
        }
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse updateStatus(Long id, TaskStatus status, String userEmail) {
        Task task = findTask(id);
        User user = findUser(userEmail);
        if (!isAdmin(user) && !isParticipant(task, user))
            throw new AccessDeniedException("Not authorized to update this task's status");
        task.setStatus(status);
        return TaskResponse.from(taskRepository.save(task));
    }

    public TaskResponse assignTask(Long taskId, Long userId) {
        Task task = findTask(taskId);
        User assignee = findUserById(userId);
        task.setAssignedTo(assignee);
        Task saved = taskRepository.save(task);
        notificationService.notifyTaskAssigned(assignee, saved);
        return TaskResponse.from(saved);
    }

    public void deleteTask(Long id, String userEmail) {
        Task task = findTask(id);
        requireCreatorOrAdmin(task, findUser(userEmail));
        taskRepository.delete(task);
    }

    private void requireCreatorOrAdmin(Task task, User user) {
        if (!isAdmin(user) && !isCreator(task, user))
            throw new AccessDeniedException("You can only modify tasks you created");
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ROLE_ADMIN;
    }

    private boolean isCreator(Task task, User user) {
        return task.getCreatedBy() != null && task.getCreatedBy().getId().equals(user.getId());
    }

    private boolean isParticipant(Task task, User user) {
        return isCreator(task, user) ||
               (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(user.getId()));
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
