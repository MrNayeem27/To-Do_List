document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    taskList.addEventListener('click', (e) => {
        const taskItem = e.target.closest('li');
        if (!taskItem) return; // Exit if click wasn't inside a list item

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(taskItem);
        } else if (e.target.classList.contains('complete-btn')) {
            toggleComplete(taskItem);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(taskItem);
        }
    });

    function getTasksFromStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasksToStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('li');
        taskItem.setAttribute('data-id', task.id);
        if (task.completed) {
            taskItem.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.text;
        taskTextSpan.classList.add('task-text'); // Added class for easier selection

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.classList.add('complete-btn');

        const editButton = document.createElement('button'); // Create Edit button
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn'); // Add class

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        actionsDiv.appendChild(completeButton);
        actionsDiv.appendChild(editButton); // Add Edit button to actions
        actionsDiv.appendChild(deleteButton);

        taskItem.appendChild(taskTextSpan);
        taskItem.appendChild(actionsDiv);

        return taskItem;
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert("Please enter a task.");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        const tasks = getTasksFromStorage();
        tasks.push(newTask);
        saveTasksToStorage(tasks);

        const taskElement = createTaskElement(newTask);
        taskList.appendChild(taskElement);

        taskInput.value = '';
        taskInput.focus();
    }

    function deleteTask(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        let tasks = getTasksFromStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToStorage(tasks);
        taskItem.remove();
    }

    function toggleComplete(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        const tasks = getTasksFromStorage();
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasksToStorage(tasks);

            taskItem.classList.toggle('completed');
            const completeButton = taskItem.querySelector('.complete-btn');
            completeButton.textContent = tasks[taskIndex].completed ? 'Undo' : 'Complete';
        }
    }

    function editTask(taskItem) {
        const taskId = taskItem.getAttribute('data-id');
        const taskTextSpan = taskItem.querySelector('.task-text');
        const currentText = taskTextSpan.textContent;

        const newText = prompt("Edit task:", currentText);

        // Proceed only if prompt was not cancelled and new text is not empty/just spaces
        if (newText !== null && newText.trim() !== '') {
            const trimmedNewText = newText.trim();
            const tasks = getTasksFromStorage();
            const taskIndex = tasks.findIndex(task => task.id === taskId);

            if (taskIndex > -1) {
                tasks[taskIndex].text = trimmedNewText;
                saveTasksToStorage(tasks);
                taskTextSpan.textContent = trimmedNewText; // Update text in the list item
            }
        } else if (newText !== null && newText.trim() === '') {
            // Handle case where user entered empty text
            alert("Task text cannot be empty.");
        }
        // If newText is null (user cancelled), do nothing
    }


    function loadTasks() {
        taskList.innerHTML = ''; // Clear existing list before loading
        const tasks = getTasksFromStorage();
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }
});