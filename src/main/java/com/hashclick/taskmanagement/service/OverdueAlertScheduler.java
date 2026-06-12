package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.repository.TaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;

@Component
public class OverdueAlertScheduler {

    private static final Logger log = LoggerFactory.getLogger(OverdueAlertScheduler.class);

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public OverdueAlertScheduler(TaskRepository taskRepository,
                                  NotificationService notificationService) {
        this.taskRepository      = taskRepository;
        this.notificationService = notificationService;
    }

    // Runs every day at 8:00 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void sendOverdueAlerts() {
        List<Task> overdueTasks = taskRepository.findOverdueTasks(LocalDate.now());
        log.info("Overdue alert job: found {} overdue tasks", overdueTasks.size());
        for (Task task : overdueTasks) {
            if (task.getAssignedTo() != null)
                notificationService.notifyOverdueTask(task.getAssignedTo(), task);
            if (task.getCreatedBy() != null &&
                (task.getAssignedTo() == null ||
                 !task.getCreatedBy().getId().equals(task.getAssignedTo().getId())))
                notificationService.notifyOverdueTask(task.getCreatedBy(), task);
        }
    }
}
