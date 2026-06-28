package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.enums.Role;
import com.hashclick.taskmanagement.model.Project;
import com.hashclick.taskmanagement.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ProjectRepositoryTest {

    @Autowired ProjectRepository projectRepository;
    @Autowired UserRepository    userRepository;

    private User owner;

    @BeforeEach
    void setup() {
        owner = userRepository.save(new User("Alice", "alice@test.com", "pass", Role.ROLE_USER));
    }

    @Test
    void save_and_findByOwner() {
        Project p = new Project();
        p.setName("Test Project");
        p.setOwner(owner);
        projectRepository.save(p);

        List<Project> found = projectRepository.findByOwner(owner);
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getName()).isEqualTo("Test Project");
    }

    @Test
    void existsByNameAndOwner_returnsTrue_whenDuplicate() {
        Project p = new Project();
        p.setName("Duplicate");
        p.setOwner(owner);
        projectRepository.save(p);

        assertThat(projectRepository.existsByNameAndOwner("Duplicate", owner)).isTrue();
        assertThat(projectRepository.existsByNameAndOwner("Other", owner)).isFalse();
    }

    @Test
    void findByOwner_withPageable_returnsPage() {
        for (int i = 1; i <= 5; i++) {
            Project p = new Project();
            p.setName("Project " + i);
            p.setOwner(owner);
            projectRepository.save(p);
        }
        Page<Project> page = projectRepository.findByOwner(owner, PageRequest.of(0, 3));
        assertThat(page.getTotalElements()).isEqualTo(5);
        assertThat(page.getContent()).hasSize(3);
    }

    @Test
    void findByStatus_returnsMatchingProjects() {
        Project active = new Project(); active.setName("Active"); active.setStatus("ACTIVE"); active.setOwner(owner);
        Project done   = new Project(); done.setName("Done");   done.setStatus("COMPLETED"); done.setOwner(owner);
        projectRepository.saveAll(List.of(active, done));

        assertThat(projectRepository.findByStatus("ACTIVE")).hasSize(1);
        assertThat(projectRepository.findByStatus("COMPLETED")).hasSize(1);
    }
}
