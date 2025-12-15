// Get DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const messageDiv = document.getElementById('message');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Handle form submission
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    
    // Validate input
    if (!taskText) {
        showMessage('Please enter a task!', 'error');
        return;
    }
    
    // Add task via API
    await addTask(taskText);
    
    // Clear input
    taskInput.value = '';
    taskInput.focus();
});

// Load all tasks from backend
async function loadTasks() {
    try {
        const response = await fetch('/tasks');
        const data = await response.json();
        
        if (response.ok) {
            renderTasks(data.tasks);
        } else {
            showMessage('Failed to load tasks', 'error');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showMessage('Network error. Please refresh the page.', 'error');
    }
}

// Add new task
async function addTask(text) {
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('Task added successfully! ✅', 'success');
            await loadTasks(); // Reload tasks
        } else {
            showMessage(data.error || 'Failed to add task', 'error');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Toggle task status
async function toggleTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            await loadTasks(); // Reload tasks
        } else {
            showMessage(data.error || 'Failed to update task', 'error');
        }
    } catch (error) {
        console.error('Error toggling task:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Delete task
async function deleteTask(taskId) {
    try {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showMessage('Task deleted!', 'success');
            await loadTasks(); // Reload tasks
        } else {
            showMessage(data.error || 'Failed to delete task', 'error');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showMessage('Network error. Please try again.', 'error');
    }
}

// Render tasks in the UI
function renderTasks(tasks) {
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Show/hide empty state
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'block';
        
        // Render each task
        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }
    
    // Update statistics
    updateStats(tasks);
}

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);
    
    // Checkbox
    const checkbox = document.createElement('div');
    checkbox.className = `task-checkbox ${task.done ? 'checked' : ''}`;
    checkbox.addEventListener('click', () => toggleTask(task.id));
    
    // Task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
    });
    
    // Assemble task item
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(deleteBtn);
    
    return li;
}

// Update statistics
function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Show message
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        taskInput.focus();
    }
});