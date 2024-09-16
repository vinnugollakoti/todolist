document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const dueDateTime = document.getElementById('dueDateTime');
    const addTodoButton = document.getElementById('addTodoButton');
    const todoList = document.getElementById('todoList');

    // Load todos from localStorage
    loadTodos();

    addTodoButton.addEventListener('click', addTodo);
    todoList.addEventListener('click', handleListClick);

    function loadTodos() {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => {
            addTodoToDOM(todo.text, todo.id, todo.dueDateTime);
            scheduleNotification(todo.dueDateTime, todo.id);
        });
    }

    function saveTodos() {
        const todos = Array.from(todoList.children).map(li => ({
            text: li.querySelector('.todo-text').textContent,
            id: li.dataset.id,
            dueDateTime: li.querySelector('.due-date').textContent
        }));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function addTodo() {
        const text = todoInput.value.trim();
        const dateTime = dueDateTime.value;

        if (text === '' || dateTime === '') return;

        const id = Date.now().toString();
        addTodoToDOM(text, id, dateTime);
        scheduleNotification(dateTime, id);
        saveTodos();

        todoInput.value = '';
        dueDateTime.value = '';
    }

    function addTodoToDOM(text, id, dueDateTime) {
        const li = document.createElement('li');
        li.dataset.id = id;

        const span = document.createElement('span');
        span.classList.add('todo-text');
        span.textContent = text;

        const dateSpan = document.createElement('span');
        dateSpan.classList.add('due-date');
        dateSpan.textContent = `Due: ${new Date(dueDateTime).toLocaleString()}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        li.appendChild(span);
        li.appendChild(dateSpan);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        todoList.appendChild(li);
    }

    function handleListClick(event) {
        const target = event.target;

        if (target.classList.contains('edit-btn')) {
            const li = target.parentElement;
            const newText = prompt('Edit to-do:', li.querySelector('.todo-text').textContent);
            const newDateTime = prompt('Edit due date and time:', li.querySelector('.due-date').textContent.replace('Due: ', ''));
            if (newText !== null && newDateTime !== null) {
                li.querySelector('.todo-text').textContent = newText;
                li.querySelector('.due-date').textContent = `Due: ${new Date(newDateTime).toLocaleString()}`;
                saveTodos();
                scheduleNotification(newDateTime, li.dataset.id);
            }
        } else if (target.classList.contains('delete-btn')) {
            const li = target.parentElement;
            li.remove();
            saveTodos();
        }
    }

    function scheduleNotification(dueDateTime, id) {
        const dueTime = new Date(dueDateTime).getTime();
        const now = new Date().getTime();
        const timeToNotify = dueTime - now;

        if (timeToNotify > 0) {
            setTimeout(() => {
                alert(`To-Do "${document.querySelector(`[data-id="${id}"] .todo-text`).textContent}" is due now!`);
            }, timeToNotify);
        }
    }
});
