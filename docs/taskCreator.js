// taskCreator.js
import { communicationService } from './communicationService.js';


// 1. ISOLATED CSS
const taskCreatorCSS = `
  .tc-container { font-family: sans-serif; color: white; }
  .tc-container * { box-sizing: border-box; margin: 0; padding: 0; }
  .tc-container .wrap { width: 100%; }
  .tc-container h2 { font-size: 18px; font-weight: 500; margin-bottom: 1.5rem; }
  .tc-container .field { margin-bottom: 1rem; }
  .tc-container label { display: block; font-size: 13px; color: #888; margin-bottom: 6px; }
  .tc-container input, .tc-container select, .tc-container textarea { width: 100%; border: 0.5px solid #333; border-radius: 6px; padding: 8px 12px; font-size: 14px; background: #0f0f11; color: white; }
  .tc-container textarea { resize: vertical; min-height: 72px; line-height: 1.5; }
  .tc-container .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tc-container .priority-group { display: flex; gap: 8px; }
  .tc-container .priority-btn { flex: 1; padding: 7px 0; font-size: 13px; border: 0.5px solid #333; border-radius: 6px; background: #0f0f11; color: #888; cursor: pointer; transition: all 0.15s; }
  .tc-container .priority-btn.low.active { background: #EAF3DE; border-color: #639922; color: #3B6D11; }
  .tc-container .priority-btn.medium.active { background: #FAEEDA; border-color: #BA7517; color: #854F0B; }
  .tc-container .priority-btn.high.active { background: #FCEBEB; border-color: #E24B4A; color: #A32D2D; }
  .tc-container .actions { display: flex; gap: 10px; margin-top: 1.5rem; }
  .tc-container .btn-primary { flex: 1; padding: 9px 0; font-size: 14px; font-weight: 500; border: 0.5px solid #333; border-radius: 6px; cursor: pointer; background: #e8b84b; color: #0f0f11; }
  .tc-container .btn-secondary { padding: 9px 16px; font-size: 14px; border: 0.5px solid #333; border-radius: 6px; cursor: pointer; background: transparent; color: white; }
  .tc-container .task-list { margin-top: 1.5rem; border-top: 0.5px solid #333; padding-top: 1.5rem; }
  .tc-container .task-list h3 { font-size: 14px; font-weight: 500; color: #888; margin-bottom: 12px; }
  .tc-container .task-item { background: #16161a; border: 0.5px solid #333; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 10px; }
  .tc-container .task-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .tc-container .dot-low { background: #639922; }
  .tc-container .dot-medium { background: #BA7517; }
  .tc-container .dot-high { background: #E24B4A; }
  .tc-container .task-info { flex: 1; min-width: 0; }
  .tc-container .task-title { font-size: 14px; font-weight: 500; color: white; }
  .tc-container .task-meta { font-size: 12px; color: #888; margin-top: 3px; }
  .tc-container .task-badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 4px; margin-left: 8px; }
  .tc-container .badge-low { background: #EAF3DE; color: #3B6D11; }
  .tc-container .badge-medium { background: #FAEEDA; color: #854F0B; }
  .tc-container .badge-high { background: #FCEBEB; color: #A32D2D; }
  .tc-container .task-actions { display: flex; gap: 8px; flex-shrink: 0; }
  .tc-container .task-btn { background: none; border: none; cursor: pointer; color: #888; font-size: 16px; padding: 0 2px; line-height: 1; transition: color 0.15s; }
  .tc-container .task-btn.remove:hover { color: #e05a5a; }
  .tc-container .task-btn.share { font-size: 14px; margin-top: 1px; }
  .tc-container .task-btn.share:hover { color: #e8b84b; }
  .tc-container .empty { font-size: 13px; color: #888; text-align: center; padding: 1rem 0; }
  .tc-container .task-count { font-size: 12px; color: #888; float: right; font-weight: 400; }
  .tc-container .task-count.at-limit { color: #E24B4A; }
  .tc-container .limit-msg { font-size: 12px; color: #E24B4A; margin-top: 6px; display: none; }
`;

// 2. ISOLATED HTML
const taskCreatorHTML = `
  <div class="tc-container">
    <div class="wrap">
      <h2>New task</h2>
      <div class="field">
        <label>Title</label>
        <input type="text" id="tc-title" placeholder="e.g. Team standup, Review PR...">
      </div>
      <div class="row">
        <div class="field">
          <label>Date</label>
          <input type="date" id="tc-date">
        </div>
        <div class="field">
          <label>Time</label>
          <input type="time" id="tc-time">
        </div>
      </div>
      <div class="row">
        <div class="field">
          <label>End time</label>
          <input type="time" id="tc-endTime">
        </div>
        <div class="field">
          <label>Category</label>
          <select id="tc-category">
            <option value="Meeting">Meeting</option>
            <option value="Task">Task</option>
            <option value="Reminder">Reminder</option>
            <option value="Event">Event</option>
            <option value="Deadline">Deadline</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label>Priority</label>
        <div class="priority-group">
          <button class="priority-btn low" data-priority="low">Low</button>
          <button class="priority-btn medium active" data-priority="medium">Medium</button>
          <button class="priority-btn high" data-priority="high">High</button>
        </div>
      </div>
      <div class="field">
        <label>Notes</label>
        <textarea id="tc-notes" placeholder="Optional details..."></textarea>
      </div>
      <div class="actions">
        <button class="btn-secondary" id="tc-clear-btn">Clear</button>
        <button class="btn-primary" id="tc-add-btn">Add task</button>
      </div>

      <div class="task-list" id="tc-taskList">
        <h3>Upcoming tasks <span class="task-count" id="tc-taskCount">0 / 100</span></h3>
        <div id="tc-tasks"><p class="empty">No tasks yet</p></div>
        <p class="limit-msg" id="tc-limitMsg">Task limit reached (100). Remove a task to add a new one.</p>
      </div>
    </div>
  </div>
`;

// 3. INIT FUNCTION
export function initTaskCreator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Inject CSS & HTML
  const style = document.createElement('style');
  style.innerHTML = taskCreatorCSS;
  document.head.appendChild(style);
  container.innerHTML = taskCreatorHTML;

  // Setup Variables
  const MAX_TASKS = 100;
  let priority = 'medium';
  let tasks = [];
  const today = new Date().toISOString().split('T')[0];
  
  // DOM Elements
  const titleInput = document.getElementById('tc-title');
  const dateInput = document.getElementById('tc-date');
  const timeInput = document.getElementById('tc-time');
  const endTimeInput = document.getElementById('tc-endTime');
  const categorySelect = document.getElementById('tc-category');
  const notesInput = document.getElementById('tc-notes');
  const tasksDiv = document.getElementById('tc-tasks');
  const priorityBtns = container.querySelectorAll('.priority-btn');

  dateInput.value = today;

  // Helper Functions
  function setPriority(p, btn) {
    priority = p;
    priorityBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function renderTasks() {
    const atLimit = tasks.length >= MAX_TASKS;
    const addBtn = document.getElementById('tc-add-btn');
    const limitMsg = document.getElementById('tc-limitMsg');
    const countEl = document.getElementById('tc-taskCount');
    countEl.textContent = `${tasks.length} / ${MAX_TASKS}`;
    countEl.classList.toggle('at-limit', atLimit);
    addBtn.disabled = atLimit;
    addBtn.style.opacity = atLimit ? '0.45' : '';
    addBtn.style.cursor = atLimit ? 'not-allowed' : '';
    limitMsg.style.display = atLimit ? 'block' : 'none';
    if (!tasks.length) { tasksDiv.innerHTML = '<p class="empty">No tasks yet</p>'; return; }
    tasksDiv.innerHTML = tasks.map(t => `
      <div class="task-item">
        <div class="task-dot dot-${t.priority}"></div>
        <div class="task-info">
          <div class="task-title">${t.title}<span class="task-badge badge-${t.priority}">${t.priority}</span></div>
          <div class="task-meta">${t.category}${t.date ? ' &middot; ' + formatDate(t.date) : ''}${t.time ? ' &middot; ' + t.time : ''}${t.endTime ? '&ndash;' + t.endTime : ''}${t.notes ? ' &middot; ' + t.notes.substring(0,40) + (t.notes.length > 40 ? '&hellip;' : '') : ''}</div>
        </div>
        <div class="task-actions">
          <button class="task-btn share" data-id="${t.id}" title="Share task">&rarr;</button>
          <button class="task-btn remove" data-id="${t.id}" title="Remove task">&times;</button>
        </div>
      </div>
    `).join('');

    // Attach delete listeners
    container.querySelectorAll('.task-btn.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
      });
    });

    // Attach share listeners
    container.querySelectorAll('.task-btn.share').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        const task = tasks.find(t => t.id === id);
        if (task) {
          communicationService.promptShare(task.title, (email) => {
            communicationService.shareTaskToEmail(task, email);
          });
        }
      });
    });
  }

  function clearForm() {
    titleInput.value = '';
    dateInput.value = today;
    timeInput.value = '';
    notesInput.value = '';
    endTimeInput.value = '';
    categorySelect.value = 'Meeting';
    setPriority('medium', container.querySelector('.priority-btn.medium'));
  }

  function formatDate(d) {
    if (!d) return '';
    const [y,m,day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[+m-1]} ${+day}`;
  }

  // Event Listeners
  priorityBtns.forEach(btn => {
    btn.addEventListener('click', (e) => setPriority(e.target.dataset.priority, e.target));
  });

  document.getElementById('tc-add-btn').addEventListener('click', () => {
    if (tasks.length >= MAX_TASKS) return;
    const title = titleInput.value.trim();
    if (!title) { titleInput.focus(); return; }
    tasks.unshift({ 
      id: Date.now(), title, date: dateInput.value, time: timeInput.value,
      endTime: endTimeInput.value, category: categorySelect.value, priority, notes: notesInput.value.trim() 
    });
    renderTasks();
    clearForm();
  });

  document.getElementById('tc-clear-btn').addEventListener('click', clearForm);
}

// Automatically start the feature and place it in the right box
initTaskCreator('feature-task-creator');
