package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.dto.ProjectRequest;
import com.hashclick.taskmanagement.dto.ProjectResponse;
import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.exception.DuplicateResourceException;
import com.hashclick.taskmanagement.exception.ResourceNotFoundException;
import com.hashclick.taskmanagement.model.Project;
import com.hashclick.taskmanagement.model.User;
import com.hashclick.taskmanagement.repository.ProjectRepository;
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

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock ProjectRepository projectRepository;
    @Mock TaskRepository    taskRepository;
    @Mock UserRepository    userRepository;

    @InjectMocks ProjectService projectService;

    private User owner;

    @BeforeEach
    void setup() {
        owner = new User("Alice", "alice@test.com", "pass", Role.ROLE_USER);
        owner.setId(1L);
    }

    @Test
    void createProject_success() {
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(owner));
        when(projectRepository.existsByNameAndOwner("MyProject", owner)).thenReturn(false);

        Project saved = new Project();
        saved.setId(1L); saved.setName("MyProject"); saved.setOwner(owner);
        when(projectRepository.save(any())).thenReturn(saved);

        ProjectRequest req = new ProjectRequest();
        req.setName("MyProject");

        ProjectResponse response = projectService.createProject(req, "alice@test.com");
        assertThat(response.getName()).isEqualTo("MyProject");
        assertThat(response.getOwnerEmail()).isEqualTo("alice@test.com");
    }

    @Test
    void createProject_throwsDuplicate_whenNameExists() {
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(owner));
        when(projectRepository.existsByNameAndOwner("Dup", owner)).thenReturn(true);

        ProjectRequest req = new ProjectRequest();
        req.setName("Dup");

        assertThatThrownBy(() -> projectService.createProject(req, "alice@test.com"))
            .isInstanceOf(DuplicateResourceException.class)
            .hasMessageContaining("Dup");
    }

    @Test
    void getProjectById_throwsNotFound_whenMissing() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L, "alice@test.com"))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteProject_callsDelete() {
        Project project = new Project();
        project.setId(1L); project.setOwner(owner);
        when(userRepository.findByEmail("alice@test.com")).thenReturn(Optional.of(owner));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.deleteProject(1L, "alice@test.com");
        verify(projectRepository, times(1)).delete(project);
    }
}
