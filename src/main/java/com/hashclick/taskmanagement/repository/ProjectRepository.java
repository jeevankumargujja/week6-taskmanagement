package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.model.Project;
import com.hashclick.taskmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User owner);

    Page<Project> findByOwner(User owner, Pageable pageable);

    Page<Project> findAll(Pageable pageable);

    List<Project> findByStatus(String status);

    boolean existsByNameAndOwner(String name, User owner);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.owner WHERE p.id = :id")
    java.util.Optional<Project> findByIdWithOwner(Long id);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.id = :id")
    java.util.Optional<Project> findByIdWithTasks(Long id);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    long countTasksByProjectId(Long projectId);
}
