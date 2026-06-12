package com.hashclick.taskmanagement.service;

import com.hashclick.taskmanagement.model.Task;
import com.hashclick.taskmanagement.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@taskmanager.local}")
    private String fromAddress;

    @Value("${notifications.email.enabled:false}")
    private boolean emailEnabled;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void notifyTaskAssigned(User assignee, Task task) {
        String message = String.format(
            "Hi %s,\n\nYou have been assigned a new task:\n\nTitle: %s\nPriority: %s\nDue: %s\n\nPlease log in to view details.",
            assignee.getName(), task.getTitle(), task.getPriority(),
            task.getDueDate() != null ? task.getDueDate().toString() : "No due date"
        );
        sendEmail(assignee.getEmail(), "Task Assigned: " + task.getTitle(), message);
    }

    @Async
    public void notifyOverdueTask(User user, Task task) {
        String message = String.format(
            "Hi %s,\n\nThe following task is overdue:\n\nTitle: %s\nDue: %s\nStatus: %s\n\nPlease update the task status.",
            user.getName(), task.getTitle(), task.getDueDate(), task.getStatus()
        );
        sendEmail(user.getEmail(), "Overdue Task: " + task.getTitle(), message);
    }

    private void sendEmail(String to, String subject, String body) {
        if (!emailEnabled) {
            log.info("[NOTIFICATION] To: {} | Subject: {} | Body: {}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
