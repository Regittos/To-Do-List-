// SELECT ELEMENTS
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById('todos-list'); //ID
const notificationEl = document.querySelector('.notification'); //Class

//vars
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

renderTodos();
//FORM SUBMIT
form.addEventListener('submit', function (event) {
    event.preventDefault();
    saveTodo();
    renderTodos();
    localStorage.setItem('todos',JSON.stringify(todos))//pesquisar sobre
});

//SAVE TODO
function saveTodo() {
    const todoValue = todoInput.value;

    // Check  if the todo is empty
    const isEmpty = todoValue === '';

    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

    if (isEmpty) {
        showNotification("Todo's input is empty");
    }
    else if (isDuplicate) {
        showNotification("Todo already exists!");
    }
    else {
        if (EditTodoId >= 0) {
            //update the edit todo
            todos = todos.map((todo, index) =>
            ({
                ...todo,
                value: index === EditTodoId ? todoValue : todo.value,
            }))
            EditTodoId = -1;
        }
        else {
            const todo = {
                value: todoValue,
                checked: false,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            }
            todos.push(todo); //Adiciona na lista
            todoInput.value = ''; //Limpa a caixa de texto no Todo Text
            console.log(todos);// Imprime no console
        }
    }
}
function renderTodos() {
    if(todos.length === 0)
    {
        todosListEl.innerHTML = '<center> Nothing to do!</center>';
        return;
    }
    // CLEAR ELEMNTE BEFOR RE-RENDER
    todosListEl.innerHTML = '';
    //RENDER TODOS
    todos.forEach((todo, index) => {
        todosListEl.innerHTML += `   
        <div class="todo" id = ${index}> 
            <i 
            class = "bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
            style = "color:${todo.color}"
            data-action = "check"
            ></i>
            <p class = "${todo.checked ? 'checked' : ''}"data-action = "check">${todo.value}</p>
            <i class = "bi bi-pencil-square"data-action = "edit"></i>
            <i class = "bi bi-trash"data-action = "delete"></i>
        </div>`;
    });
}

todosListEl.addEventListener('click', (event) => {
    const target = event.target; //Saber qual elemento da tela foi clicado
    const parentElement = target.parentNode; //Saber qual é o elemnto pai do elemento clicado
    if (parentElement.className !== 'todo') return;

    // todo id
    const todo = parentElement;
    const todoId = Number(todo.id); //Saber qual é a tarefa selecionada
    // target action
    const action = target.dataset.action


    action === "check" && checkTodo(todoId);
    action === "edit" && editTodo(todoId);
    action === "delete" && deleteTodo(todoId);
    console.log(todoId, action);
});



function checkTodo(todoId) {
    //todos.splice  //pesquisar sobre
    todos = todos.map((todo, index) => ({//todo é um objeto, logo a função map enumera-os
        ...todo, // = value: todo.value,color: todo.color,
        checked: index === todoId ? !todo.checked : todo.checked, // mudar o estado de checked
    }
    ))
    renderTodos();
    localStorage.setItem('todos',JSON.stringify(todos))
}
//OBS
/*
let arr = [1, 2, 3]
let newArr = arr.map((num)=>{
    return num*2
})
newArr = [2, 4, 6] // Este é um exemplo de como map funciona

*/
//Editar um todo
function editTodo(todoId) {
    todoInput.value = todos[todoId].value;
    EditTodoId = todoId;
}

//Dizimar um TODO
function deleteTodo(todoId) {
    todos = todos.filter((todo, index) => index !== todoId);
    EditTodoId = -1;

    //re-render
    renderTodos();
    localStorage.setItem('todos',JSON.stringify(todos))
}

function showNotification(msg) {
    notificationEl.innerHTML = msg
    notificationEl.classList.add('notif-enter');
    setTimeout(()=>{
        notificationEl.classList.remove('notif-enter');
    },2000)
}
