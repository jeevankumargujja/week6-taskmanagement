package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.PagedResponse;
import com.hashclick.taskmanagement.dto.ProjectRequest;
import com.hashclick.taskmanagement.dto.ProjectResponse;
import com.hashclick.taskmanagement.dto.TaskResponse;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.exception.DuplicateResourceException;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.Project;
import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.ProjectRepository;
import com.hashclick.taskmanagement.repository.TaskRepository;
import com.hashclick.taskmanagement.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TaskRepository    taskRepository;
    private final UserRepository    userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          TaskRepository taskRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository    = taskRepository;
        this.userRepository    = userRepository;
    }

    public ProjectResponse createProject(ProjectRequest request, String ownerEmail) {
        User owner = findUser(ownerEmail);
        if (projectRepository.existsByNameAndOwner(request.getName(), owner))
            throw new DuplicateResourceException("You already have a project named: " + request.getName());

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setOwner(owner);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public PagedResponse<ProjectResponse> getAllProjects(String email, Pageable pageable) {
        User user = findUser(email);
        Page<Project> page = isAdmin(user)
            ? projectRepository.findAll(pageable)
            : projectRepository.findByOwner(user, pageable);
        return PagedResponse.from(page.map(ProjectResponse::from));
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long id, String email) {
        Project project = findProject(id);
        User user = findUser(email);
        if (!isAdmin(user) && !project.getOwner().getId().equals(user.getId()))
            throw new AccessDeniedException("You don't have access to this project");
        return ProjectResponse.from(project);
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request, String email) {
        Project project = findProject(id);
        User user = findUser(email);
        requireOwnerOrAdmin(project, user);

        if (!project.getName().equals(request.getName()) &&
            projectRepository.existsByNameAndOwner(request.getName(), project.getOwner()))
            throw new DuplicateResourceException("You already have a project named: " + request.getName());

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        if (request.getStatus() != null) project.setStatus(request.getStatus());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        return ProjectResponse.from(projectRepository.save(project));
    }

    public void deleteProject(Long id, String email) {
        Project project = findProject(id);
        requireOwnerOrAdmin(project, findUser(email));
        projectRepository.delete(project);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TaskResponse> getProjectTasks(Long projectId, String email, Pageable pageable) {
        Project project = findProject(projectId);
        User user = findUser(email);
        if (!isAdmin(user) && !project.getOwner().getId().equals(user.getId()))
            throw new AccessDeniedException("You don't have access to this project");
        Page<Task> page = taskRepository.findByProject(project, pageable);
        return PagedResponse.from(page.map(TaskResponse::from));
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getProjectStats(Long projectId, String email) {
        Project project = findProject(projectId);
        User user = findUser(email);
        if (!isAdmin(user) && !project.getOwner().getId().equals(user.getId()))
            throw new AccessDeniedException("You don't have access to this project");
        List<Object[]> rows = taskRepository.countByStatusForProject(projectId);
        return rows.stream().collect(Collectors.toMap(
            r -> r[0].toString(),
            r -> (Long) r[1]
        ));
    }

    private void requireOwnerOrAdmin(Project project, User user) {
        if (!isAdmin(user) && !project.getOwner().getId().equals(user.getId()))
            throw new AccessDeniedException("You can only modify your own projects");
    }

    private boolean isAdmin(User user) { return user.getRole() == Role.ROLE_ADMIN; }

    private Project findProject(Long id) {
        return projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }
}
