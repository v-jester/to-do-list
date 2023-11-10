document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('div');
    app.id = 'app';
    app.style.width = '50%';
    app.style.margin = '0 auto';
    app.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(app);

    const inputContainer = document.createElement('div');
    inputContainer.id = 'input-container';
    inputContainer.style.marginBottom = '20px';
    app.appendChild(inputContainer);

    const h1 = document.createElement('h1');
    h1.textContent = 'To-do list';
    h1.style.textAlign = 'center';
    inputContainer.appendChild(h1);

    const newTaskInput = createStyledInput('For example, a new task');
    inputContainer.appendChild(newTaskInput);


    const addTaskButton = createStyledButton('Add');
    inputContainer.appendChild(addTaskButton);

    
    const listSelector = createStyledSelect();
    inputContainer.appendChild(listSelector);

    const newListInput = createStyledInput('Name of the new list');
    inputContainer.appendChild(newListInput);

    const addListButton = createStyledButton('Create a new list');
    inputContainer.appendChild(addListButton);

   
    const deleteListButton = createStyledButton('Delete current list');
    inputContainer.appendChild(deleteListButton);

    let lists = JSON.parse(localStorage.getItem('lists')) || [];
    let currentListIndex = 0;

  
    const taskLists = {};

   
    const saveLists = () => {
        localStorage.setItem('lists', JSON.stringify(lists));
    };

    const deleteList = (index) => {
        lists.splice(index, 1);
        if (lists.length === 0) {
            currentListIndex = 0;
        } else if (currentListIndex >= lists.length) {
            currentListIndex = lists.length - 1;
        }
        saveLists();
        renderLists();
    };

    const renderLists = () => {
        listSelector.innerHTML = '';
        lists.forEach((list, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = list.name;
            listSelector.appendChild(option);
        });
        listSelector.value = currentListIndex;

        deleteListButton.style.display = lists.length > 0 ? 'block' : 'none';
        renderTasks();
    };

    const saveTasks = () => {
        saveLists();
    };

    const deleteTask = (index) => {
        lists[currentListIndex].tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };

    const toggleTaskCompletion = (index) => {
        lists[currentListIndex].tasks[index].completed = !lists[currentListIndex].tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    const renderTasks = () => {
        Object.values(taskLists).forEach(taskList => taskList.style.display = 'none');
        const taskList = getTaskList(currentListIndex);
        taskList.innerHTML = '';
        taskList.style.display = 'block';

        const tasks = lists[currentListIndex]?.tasks || [];
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.style.backgroundColor = '#f8f8f8';
            taskElement.style.borderBottom = '1px solid #eaeaea';
            taskElement.style.padding = '10px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.onchange = () => toggleTaskCompletion(index);

            const text = document.createElement('span');
            text.textContent = task.name;
            if (task.completed) {
                text.style.textDecoration = 'line-through';
            }

            const deleteBtn = document.createElement('span');
            deleteBtn.innerHTML = '&#128465;';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.onclick = () => deleteTask(index);

            taskElement.appendChild(checkbox);
            taskElement.appendChild(text);
            taskElement.appendChild(deleteBtn);

            taskList.appendChild(taskElement);
        });
    };

    const getTaskList = (listIndex) => {
        if (!taskLists[listIndex]) {
            const taskList = document.createElement('div');
            taskList.classList.add('task-list');
            taskList.draggable = true;
            taskList.id = 'task-list-' + listIndex;
            taskList.style.border = '1px solid #ccc';
            taskList.style.backgroundColor = '#fff';
            taskList.style.margin = '10px 0';
            taskList.style.padding = '10px';
            app.appendChild(taskList);
            taskLists[listIndex] = taskList;
        }

        return taskLists[listIndex];
    };

    listSelector.onchange = () => {
        currentListIndex = listSelector.value;
        renderTasks();
    };

    addListButton.onclick = () => {
        const listName = newListInput.value.trim();
        if (listName) {
            lists.push({ name: listName, tasks: [] });
            newListInput.value = '';
            currentListIndex = lists.length - 1;
            saveLists();
            renderLists();
            listSelector.value = currentListIndex;
        }
    };

    addTaskButton.onclick = () => {
        const taskName = newTaskInput.value.trim();
        if (taskName) {
            lists[currentListIndex].tasks.push({ name: taskName, completed: false });
            newTaskInput.value = '';
            saveTasks();
            renderTasks();
        }
    };

    deleteListButton.onclick = () => deleteList(currentListIndex);

    renderLists();

  
});
function dragStart(e) {
    const style = window.getComputedStyle(e.target, null);
    e.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"), 10) - e.clientX) + ',' +
        (parseInt(style.getPropertyValue("top"), 10) - e.clientY) + ',' +
        e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    const offset = e.dataTransfer.getData("text/plain").split(',');
    const dm = document.getElementById(offset[2]);
    dm.style.left = (e.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (e.clientY + parseInt(offset[1], 10)) + 'px';
    e.preventDefault();
}


document.addEventListener('dragstart', dragStart, false);
document.body.addEventListener('dragover', dragOver, false);
document.body.addEventListener('drop', drop, false);


function createStyledInput(placeholder) {
    const input = document.createElement('input');
    input.type = 'text';
    styleInput(input, placeholder);
    return input;
}

function createStyledButton(text) {
    const button = document.createElement('button');
    styleButton(button);
    button.textContent = text;
    return button;
}

function createStyledSelect() {
    const select = document.createElement('select');
    styleInput(select);
    return select;
}

function styleInput(input, placeholder = '') {
    input.style.display = 'block';
    input.style.width = 'calc(100% - 20px)';
    input.style.margin = '10px auto';
    input.style.padding = '10px';
    input.style.boxSizing = 'border-box';
    input.placeholder = placeholder;
}

function styleButton(button) {
    button.style.display = 'block';
    button.style.width = 'calc(100% - 20px)';
    button.style.margin = '10px auto';
    button.style.padding = '10px';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
}