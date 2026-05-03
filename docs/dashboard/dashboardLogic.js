function calculateCompletionPercentage(tasks) {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}

function countTaskStatuses(tasks) {
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "completed").length,
    inProgress: tasks.filter(task => task.status === "in progress").length,
    notStarted: tasks.filter(task => task.status === "not started").length
  };
}

function filterTasks(tasks, memberFilter, statusFilter) {
  return tasks.filter(task => {
    const matchesMember = memberFilter === "all" || task.assignee === memberFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesMember && matchesStatus;
  });
}

function isDueThisWeek(dueDateString, today = new Date()) {
  const dueDate = new Date(dueDateString);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(startOfToday.getDate() + 7);

  return dueDate >= startOfToday && dueDate <= endOfWeek;
}

function isOverdue(dueDateString, status, today = new Date()) {
  const dueDate = new Date(dueDateString);
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return dueDate < startOfToday && status !== "completed";
}

module.exports = {
  calculateCompletionPercentage,
  countTaskStatuses,
  filterTasks,
  isDueThisWeek,
  isOverdue
};