async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = tasks.map(task =>
        `<li>${task.task} 
            <button onclick="updateTask(${task.id})">Update</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        </li>`
    ).join('');
    
}

async function addTask(event) {
    event.preventDefault();
    const taskInput = document.getElementById('task-input');
    const task = taskInput.value;
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `task=${encodeURIComponent(task)}`,
    });
    taskInput.value = '';
    fetchTasks();
}

async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
    });
    fetchTasks();
}

async function updateTask(id) {
    const newTask = prompt('Enter the updated task:');
    if (newTask !== null) {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `task=${encodeURIComponent(newTask)}`,
        });
        fetchTasks();
    }
}


document.getElementById('task-form').addEventListener('submit', addTask);
fetchTasks();