document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCountElement = document.getElementById('task-count');
    const emptyStateTemplate = document.getElementById('empty-state-template');
    
    // Modal Elements
    const inviteModal = document.getElementById('invite-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const userListContainer = document.getElementById('user-list');
    
    let tasks = []; // { id, text, completed, assigneeId }
    let currentTaskToAssign = null;

    // Mock Users
    const users = [
        { id: 'u1', name: 'Alice Smith', role: 'Designer', color: '#ec4899', initials: 'AS' },
        { id: 'u2', name: 'Bob Jones', role: 'Developer', color: '#3b82f6', initials: 'BJ' },
        { id: 'u3', name: 'Carol White', role: 'Manager', color: '#10b981', initials: 'CW' },
        { id: 'u4', name: 'Dave Brown', role: 'Content Writer', color: '#f59e0b', initials: 'DB' }
    ];

    // Initialize Empty State check
    updateUI();
    renderUserList();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    inviteModal.addEventListener('click', (e) => {
        if (e.target === inviteModal) closeModal();
    });

    function addTask(text) {
        const newTask = {
            id: Date.now().toString(),
            text,
            completed: false,
            assigneeId: null
        };
        tasks.push(newTask);
        
        renderTask(newTask);
        updateUI();
    }

    function toggleTaskComplete(id) {
        const index = tasks.findIndex(task => task.id === id);
        if (index > -1) {
            tasks[index].completed = !tasks[index].completed;
            
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
                taskItem.classList.add('removing');
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

        // Actions Container (Assignee + Delete)
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        // Assignee Element
        const assigneeDiv = document.createElement('div');
        assigneeDiv.className = 'assignee-container';
        assigneeDiv.id = `assignee-${task.id}`;
        
        updateAssigneeUI(assigneeDiv, task);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        `;
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionsDiv.appendChild(assigneeDiv);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);

        taskList.prepend(li);
    }

    function updateAssigneeUI(container, task) {
        container.innerHTML = '';
        if (task.assigneeId) {
            const user = users.find(u => u.id === task.assigneeId);
            if (user) {
                const avatar = document.createElement('div');
                avatar.className = 'avatar';
                avatar.style.backgroundColor = user.color;
                avatar.textContent = user.initials;
                avatar.title = user.name;
                avatar.addEventListener('click', () => openModal(task.id));
                container.appendChild(avatar);
                return;
            }
        }
        
        // Show Invite Button
        const inviteBtn = document.createElement('button');
        inviteBtn.className = 'invite-btn';
        inviteBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Assign
        `;
        inviteBtn.addEventListener('click', () => openModal(task.id));
        container.appendChild(inviteBtn);
    }

    function updateUI() {
        if (tasks.length === 0) {
            taskList.innerHTML = ''; 
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

    // Modal & Assignment Logic
    function openModal(taskId) {
        currentTaskToAssign = taskId;
        const task = tasks.find(t => t.id === taskId);
        
        // Highlight current assignee if any
        document.querySelectorAll('.user-option').forEach(opt => {
            if (task && opt.dataset.userId === task.assigneeId) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });

        inviteModal.classList.remove('hidden');
    }

    function closeModal() {
        inviteModal.classList.add('hidden');
        currentTaskToAssign = null;
    }

    function assignUser(userId) {
        if (!currentTaskToAssign) return;

        const taskIndex = tasks.findIndex(t => t.id === currentTaskToAssign);
        if (taskIndex > -1) {
            // Toggle off if clicking the same user
            if (tasks[taskIndex].assigneeId === userId) {
                tasks[taskIndex].assigneeId = null;
            } else {
                tasks[taskIndex].assigneeId = userId;
            }
            
            // Update UI
            const container = document.getElementById(`assignee-${currentTaskToAssign}`);
            if (container) {
                updateAssigneeUI(container, tasks[taskIndex]);
            }
        }
        closeModal();
    }

    function renderUserList() {
        userListContainer.innerHTML = '';
        users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'user-option';
            div.dataset.userId = user.id;
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.style.backgroundColor = user.color;
            avatar.textContent = user.initials;

            const infoDiv = document.createElement('div');
            infoDiv.className = 'user-option-info';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'user-option-name';
            nameSpan.textContent = user.name;
            
            const roleSpan = document.createElement('span');
            roleSpan.className = 'user-option-role';
            roleSpan.textContent = user.role;

            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(roleSpan);
            
            div.appendChild(avatar);
            div.appendChild(infoDiv);

            div.addEventListener('click', () => assignUser(user.id));
            userListContainer.appendChild(div);
        });
    }
});
