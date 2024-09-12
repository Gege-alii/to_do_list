const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn'); 
const taskList = document.getElementById('task-list'); 
const notification = document.getElementById('notification'); 

// Function to load tasks from localStorage and display them to the page
function LoadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  tasks.forEach(task => SaveTask(task)); 
}
document.addEventListener('DOMContentLoaded', LoadTasks);

// Function to add a new task
function AddTask() {
  const taskText = taskInput.value.trim(); 
  if (taskText === '') {
    ShowNotification('Please enter a Task this can’t be empty', 'error'); 
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  SaveTask(task); 
  StoreTask(task); 
  taskInput.value = ''; 
  ShowNotification('Task added successfully', 'success'); 
}
addTaskBtn.addEventListener('click', AddTask);

// Function to add a task to (HTML structure)
function SaveTask(task) {
    const li = document.createElement('li'); 
    li.className = task.completed ? 'completed' : ''; 
    li.setAttribute('data-id', task.id); 
    li.innerHTML = `
      <span class="task-text">${task.text}</span>  <!-- Task text -->  
      <div class="task-actions">
        <button class="complete-btn" ${task.completed ? 'disabled' : ''}>${task.completed ? 'Completed' : 'Complete'}</button>
        <button class="edit-btn" ${task.completed ? 'disabled' : ''}>Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;
    taskList.appendChild(li); 
    setTimeout(() => li.classList.add('show'), 50);
  
    li.querySelector('.complete-btn').addEventListener('click', () => CompleteTask(task.id));
    li.querySelector('.edit-btn').addEventListener('click', () => EditTask(task.id));
    li.querySelector('.delete-btn').addEventListener('click', () => DeleteTask(task.id));
  }

// Function to completed task
function CompleteTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = tasks.findIndex(task => task.id === id); 
  tasks[taskIndex].completed = !tasks[taskIndex].completed; 
  localStorage.setItem('tasks', JSON.stringify(tasks));

  const taskElement = document.querySelector(`[data-id='${id}']`);
  taskElement.classList.toggle('completed');

  const editButton = taskElement.querySelector('.edit-btn');
  editButton.disabled = tasks[taskIndex].completed;

   const completeButton = taskElement.querySelector('.complete-btn');
   completeButton.disabled = true;
   completeButton.textContent = 'Completed'; 
  
   ShowNotification('Task completed successfully', 'success'); 
}

// Function to edit task
function EditTask(id) {
  const tasks = JSON.parse(localStorage.getItem('tasks')); 
  const taskIndex = tasks.findIndex(task => task.id === id); 
  const originalTaskText = tasks[taskIndex].text; 
  const newTaskText = prompt('Edit your task', originalTaskText);

  if (newTaskText === null) {
    ShowNotification('Task not edited. The original task is still the same.', 'info'); 
  } else if (newTaskText.trim() === '') {
    ShowNotification('Task cannot be empty. Please write your task or delete it.', 'error'); 
  } else if (newTaskText.trim() === originalTaskText) {
    ShowNotification('No changes made. Task remains the same.', 'info'); 
  } else {
    tasks[taskIndex].text = newTaskText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
    const taskElement = document.querySelector(`[data-id='${id}'] span`);
    taskElement.textContent = newTaskText;

    ShowNotification('Task edited successfully', 'success'); 
  }
}

// Function to delete task
function DeleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')); 
    const newTasks = tasks.filter(task => task.id !== id); 
    localStorage.setItem('tasks', JSON.stringify(newTasks)); 
  
    const taskElement = document.querySelector(`[data-id='${id}']`);
    taskElement.classList.add('fade-out');
    setTimeout(() => taskElement.remove(), 500);

    ShowNotification('Task deleted successfully', 'success'); 
  }

// Function to store a new task in localStorage
function StoreTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks)); 
}

// Function to show notifications for success or error messages
function ShowNotification(message, type) {
    notification.textContent = message; 
    notification.className = `notification show ${type}`; 
    setTimeout(() => notification.classList.remove('show'), 3050); 
  }
