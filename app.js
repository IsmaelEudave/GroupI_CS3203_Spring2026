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
    
    const inviteForm = document.getElementById('invite-form');
    const inviteEmailInput = document.getElementById('invite-email-input');
    
    // Inbox Elements
    const inboxModal = document.getElementById('inbox-modal');
    const closeInboxBtn = document.getElementById('close-inbox-btn');
    const inboxBtn = document.getElementById('inbox-btn');
    const inboxBadge = document.getElementById('inbox-badge');
    const inboxList = document.getElementById('inbox-list');

    // Theme Toggle Elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');

    let tasks = []; // { id, text, completed, assigneeId }
    let currentTaskToAssign = null;
    
    // Mock Pending Invites
    let pendingInvites = [
        { id: 'inv1', taskId: 't1', taskText: 'Design new landing page', inviterName: 'Alice Smith', color: '#ec4899', initials: 'AS' },
        { id: 'inv2', taskId: 't2', taskText: 'Review architecture plan', inviterName: 'Dave Brown', color: '#f59e0b', initials: 'DB' }
    ];

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

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme-preference') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        setMoonIcon();
    }

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme-preference', 'dark');
            setSunIcon();
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme-preference', 'light');
            setMoonIcon();
        }
    });

    function setSunIcon() {
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    }

    function setMoonIcon() {
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }

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
    
    closeInboxBtn.addEventListener('click', closeInbox);
    inboxModal.addEventListener('click', (e) => {
        if (e.target === inboxModal) closeInbox();
    });
    
    inboxBtn.addEventListener('click', openInbox);
    
    inviteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = inviteEmailInput.value.trim();
        if (email) {
            inviteUserByEmail(email);
            inviteEmailInput.value = '';
        }
    });

    function getInitials(name) {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    function generateNameFromEmail(email) {
        const namePart = email.split('@')[0];
        return namePart.split(/[._-]/).map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ') || 'GuestUser';
    }

    const avatarColors = ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

    function inviteUserByEmail(email) {
        const name = generateNameFromEmail(email);
        const color = avatarColors[users.length % avatarColors.length];
        
        const newUser = {
            id: 'u' + Date.now().toString(),
            name: name,
            email: email,
            role: 'Guest',
            color: color,
            initials: getInitials(name)
        };
        
        users.push(newUser);
        renderUserList();
        assignUser(newUser.id);
    }

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

    // Inbox Logic
    function openInbox() {
        renderInbox();
        inboxModal.classList.remove('hidden');
    }

    function closeInbox() {
        inboxModal.classList.add('hidden');
    }

    function updateInboxBadge() {
        if (pendingInvites.length > 0) {
            inboxBadge.textContent = pendingInvites.length;
            inboxBadge.classList.remove('hidden');
        } else {
            inboxBadge.classList.add('hidden');
        }
    }

    window.acceptInvite = function(id) {
        const inviteIndex = pendingInvites.findIndex(inv => inv.id === id);
        if (inviteIndex > -1) {
            const invite = pendingInvites[inviteIndex];
            pendingInvites.splice(inviteIndex, 1);
            
            // Add task
            const newTask = {
                id: Date.now().toString(),
                text: invite.taskText,
                completed: false,
                assigneeId: null
            };
            tasks.push(newTask);
            renderTask(newTask);
            
            updateInboxBadge();
            renderInbox();
            updateUI();
        }
    };

    window.declineInvite = function(id) {
        const inviteIndex = pendingInvites.findIndex(inv => inv.id === id);
        if (inviteIndex > -1) {
            pendingInvites.splice(inviteIndex, 1);
            updateInboxBadge();
            renderInbox();
        }
    };

    function renderInbox() {
        inboxList.innerHTML = '';
        if (pendingInvites.length === 0) {
            inboxList.innerHTML = '<div class="empty-state" style="padding: 2rem 1rem;"><h3>No pending invites</h3><p>You\'re all caught up!</p></div>';
            return;
        }

        pendingInvites.forEach(inv => {
            const div = document.createElement('div');
            div.className = 'inbox-item';
            
            div.innerHTML = `
                <div class="inbox-item-header">
                    <div class="avatar" style="background-color: ${inv.color}">${inv.initials}</div>
                    <div class="inbox-item-text">
                        <strong>${inv.inviterName}</strong> assigned you a task:<br>
                        "${inv.taskText}"
                    </div>
                </div>
                <div class="inbox-actions">
                    <button class="accept-btn" onclick="acceptInvite('${inv.id}')">Accept</button>
                    <button class="decline-btn" onclick="declineInvite('${inv.id}')">Decline</button>
                </div>
            `;
            inboxList.appendChild(div);
        });
    }

    // Initial badge update
    updateInboxBadge();
});
