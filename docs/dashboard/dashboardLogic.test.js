const {
  calculateCompletionPercentage,
  countTaskStatuses,
  filterTasks,
  isDueThisWeek,
  isOverdue
} = require("./dashboardLogic");

describe("Task Insights Dashboard logic", () => {
  const tasks = [
    { title: "Task 1", status: "completed", assignee: "Ana", dueDate: "2026-04-02" },
    { title: "Task 2", status: "in progress", assignee: "Jason", dueDate: "2026-04-04" },
    { title: "Task 3", status: "not started", assignee: "Ana", dueDate: "2026-04-10" }
  ];

  test("calculates completion percentage", () => {
    expect(calculateCompletionPercentage(tasks)).toBe(33);
  });

  test("returns 0 percent when there are no tasks", () => {
    expect(calculateCompletionPercentage([])).toBe(0);
  });

  test("counts task statuses correctly", () => {
    expect(countTaskStatuses(tasks)).toEqual({
      total: 3,
      completed: 1,
      inProgress: 1,
      notStarted: 1
    });
  });

  test("filters by team member", () => {
    const result = filterTasks(tasks, "Ana", "all");
    expect(result.length).toBe(2);
  });

  test("filters by status", () => {
    const result = filterTasks(tasks, "all", "completed");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Task 1");
  });

  test("filters by team member and status", () => {
    const result = filterTasks(tasks, "Ana", "completed");
    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Task 1");
  });

  test("identifies due this week", () => {
    const today = new Date("2026-04-02");
    expect(isDueThisWeek("2026-04-05", today)).toBe(true);
  });

  test("identifies not due this week", () => {
    const today = new Date("2026-04-02");
    expect(isDueThisWeek("2026-04-15", today)).toBe(false);
  });

  test("identifies overdue incomplete task", () => {
    const today = new Date("2026-04-02");
    expect(isOverdue("2026-03-30", "in progress", today)).toBe(true);
  });

  test("does not mark completed task overdue", () => {
    const today = new Date("2026-04-02");
    expect(isOverdue("2026-03-30", "completed", today)).toBe(false);
  });
});