package com.hashclick.taskmanagement.repository;

import com.hashclick.taskmanagement.model.Comment;
import com.hashclick.taskmanagement.model.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByTaskOrderByCreatedAtDesc(Task task);

    @EntityGraph(attributePaths = {"author"})
    Page<Comment> findByTask(Task task, Pageable pageable);

    @Query("SELECT c FROM Comment c JOIN FETCH c.author WHERE c.task.id = :taskId ORDER BY c.createdAt DESC")
    List<Comment> findByTaskIdWithAuthor(Long taskId);

    long countByTask(Task task);
}
