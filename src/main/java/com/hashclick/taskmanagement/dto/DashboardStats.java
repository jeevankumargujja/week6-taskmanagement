package com.hashclick.taskmanagement.dto;

public class DashboardStats {
    private long totalUsers;
    private long totalTasks;
    private long todoCount;
    private long inProgressCount;
    private long doneCount;
    private long overdueCount;

    public DashboardStats(long totalUsers, long totalTasks, long todoCount,
                          long inProgressCount, long doneCount, long overdueCount) {
        this.totalUsers      = totalUsers;
        this.totalTasks      = totalTasks;
        this.todoCount       = todoCount;
        this.inProgressCount = inProgressCount;
        this.doneCount       = doneCount;
        this.overdueCount    = overdueCount;
    }

    public long getTotalUsers()      { return totalUsers; }
    public long getTotalTasks()      { return totalTasks; }
    public long getTodoCount()       { return todoCount; }
    public long getInProgressCount() { return inProgressCount; }
    public long getDoneCount()       { return doneCount; }
    public long getOverdueCount()    { return overdueCount; }
}
