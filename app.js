document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCountElement = document.getElementById('task-count');
    const emptyStateTemplate = document.getElementById('empty-state-template');
    
    let tasks = []; // Array of task objects: { id, text, completed }

    // Initialize Empty State check
    updateUI();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    function addTask(text) {
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        tasks.push(newTask);
        
        renderTask(newTask);
        updateUI();
    }

    function toggleTaskComplete(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index > -1) {
            tasks[index].completed = !tasks[index].completed;
            
            // Update DOM directly for smoother animation
            const taskItem = document.getElementById(`task-${id}`);
            if (taskItem) {
                if (tasks[index].completed) {
                    taskItem.classList.add('completed');
                } else {
                    taskItem.classList.remove('completed');
                }
            }
            updateTaskCount();
        }
    }

    function deleteTask(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index > -1) {
            tasks.splice(index, 1);
            
            const taskItem = document.getElementById(`task-${id}`);
            if (taskItem) {
                // Add removal animation class
                taskItem.classList.add('removing');
                // Wait for animation to finish before removing from DOM
                taskItem.addEventListener('animationend', () => {
                    taskItem.remove();
                    updateUI();
                });
            } else {
                updateUI();
            }
        }
    }

    function renderTask(task) {
        // Remove empty state if present
        const emptyState = taskList.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.id = `task-${task.id}`;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        `;
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        // Add to beginning of list
        taskList.prepend(li);
    }

    function updateUI() {
        if (tasks.length === 0) {
            // Show empty state
            taskList.innerHTML = ''; // Clear task list entirely
            const template = emptyStateTemplate.content.cloneNode(true);
            taskList.appendChild(template);
        }
        updateTaskCount();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        if (tasks.length === 0) {
            taskCountElement.textContent = '0 tasks';
        } else if (activeTasks === 0) {
            taskCountElement.textContent = 'All done!';
        } else if (activeTasks === 1) {
            taskCountElement.textContent = '1 task remaining';
        } else {
            taskCountElement.textContent = `${activeTasks} tasks remaining`;
        }
    }
});
