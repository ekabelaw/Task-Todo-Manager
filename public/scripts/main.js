// Event listener for fold button
const sideBar = document.querySelector('.sidebar');
const foldBar = document.querySelector('.foldicon');

foldBar.addEventListener('click', () => {
  sideBar.classList.toggle('fold');
});

// Event listeners for side menu
const sideMenu = document.querySelectorAll('.sidebar .side-menu li a')

sideMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', () => {
    sideMenu.forEach(i => {
      i.parentElement.classList.remove('active')
    })
    li.classList.add('active');
  })
});

// Event listeners for nav menu
const navMenu = document.querySelectorAll('.nav-btn .nav-btn-wrap');

navMenu.forEach(item => {
  const li = item.parentElement;
  item.addEventListener('click', () => {
    navMenu.forEach(i => {
      i.parentElement.classList.remove('active');
    })
    li.classList.add('active');
  })
});

// Helper function to get todos from localStorage
async function getTodos() {
  return await new Promise(resolve => {
    resolve(JSON.parse(localStorage.getItem('todos')) || []);
  });
}

// Helper function to reset the form
function resetForm() {
  newTodoForm.reset();
}

// Helper function to update the count of tasks
async function updateTaskCount() {
  const todos = await getTodos();

  const countTodo = document.querySelector('.todo .counter-card');
  const countInProgress = document.querySelector('.in-progress .counter-card');
  const countDone = document.querySelector('.completed .counter-card');

  const resultTodo = todos.filter(todo => todo.assign === 'todo');
  const resultInProgress = todos.filter(todo => todo.assign === 'inprogress');
  const resultDone = todos.filter(todo => todo.assign === 'done');

  countTodo.textContent = `${resultTodo.length}`;
  countInProgress.textContent = `${resultInProgress.length}`;
  countDone.textContent = `${resultDone.length}`;
}

// Event listener for adding a new task
const addTaskForm = document.querySelector('.addtask');

addTaskForm.addEventListener('click', () => {
  const formContainer = document.getElementById('formContainer');
  formContainer.classList.add('active');
  formContainer.style.zIndex = 20;
  document.querySelector('.save').style.display = 'block';
  document.querySelector('.update').style.display = 'none';
  resetForm();

  const blankArea = document.querySelector('.blankArea');
  blankArea.addEventListener('click', () => {
    formContainer.classList.remove('active');
    setTimeout(() => {
      formContainer.style.zIndex = -10;
    }, 500);
    resetForm();
  });
});

// Event listeners for closing the form
const closeForm = document.querySelector('.closeButton')

closeForm.addEventListener('click', () => {
  const formContainer = document.getElementById('formContainer');
  formContainer.classList.remove('active');
  setTimeout(() => {
    formContainer.style.zIndex = -20;
  }, 500);
  resetForm();
});

// Event listeners for closing the form
const cancelForm = document.querySelector('.cancel');

cancelForm.addEventListener('click', () => {
  const formContainer = document.getElementById('formContainer');
  formContainer.classList.remove('active');
  setTimeout(() => {
    formContainer.style.zIndex = -20;
  }, 500);
  resetForm();
});

// Show all tasks on page load
document.onload = showTodos();
/* document.addEventListener('DOMContentLoaded', showTodos); */

// Event listener for submitting the form
const newTodoForm = document.querySelector('#form-input');

newTodoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (document.querySelector('.save').style.display === 'block') {
    await submitTodos();
  } else {
    await updateData();
  }
});

// Main function to show all tasks
async function showTodos() {
  const todos = await getTodos();
  const todoList = document.querySelector('#todoList');
  const inProgressList = document.querySelector('#inProgressList');
  const completedList = document.querySelector('#completedList');

  todoList.innerHTML = '';
  inProgressList.innerHTML = '';
  completedList.innerHTML = '';

  todos.forEach(todo => {
    const todoItem = createTodoItem(todo);
    if (todo.assign === 'todo') {
      todoList.appendChild(todoItem);
    } else if (todo.assign === 'inprogress') {
      inProgressList.appendChild(todoItem);
    } else {
      completedList.appendChild(todoItem);
    }
  });

  popMenu();
  deleteData();
  updateData();
  moveAssign();
  await updateTaskCount();
}

// Helper function to create HTML for a todo item
function createTodoItem(todo) {
  const priority = todo.priority;
  const capitalPriority = priority.charAt(0).toUpperCase() + priority.slice(1);

  const todoItem = document.createElement('div');
  todoItem.classList.add('cards-container');

  const cardsContent = `
    <div class="taskcard-main">
      <div class="head">
        <div class="project-name">${todo.project}</div>
        <section class="card-menu">
          <i class="bi bi-three-dots"></i>
        </section>
      </div>
      <div class="body">
        <h3 class="card-title">${todo.taskname}</h3>
        <p>${todo.taskdesc}</p>
      </div>
      <div class="foot">
        <p class="priority ${todo.priority} active">${capitalPriority}</p>
      </div>
    </div>
    <div class="taskcard-menu">
      <input type="button" class="menu edit" id="edit" value="Edit">
      <input type="button" class="menu delete" id="delete" value="Delete">
      <input type="button" class="menu move1" value="Move to To Do">
      <input type="button" class="menu move2" value="Move to In Progress">
      <input type="button" class="menu move3" value="Move to Done">
    </div>
    `;

  todoItem.innerHTML = cardsContent;
  return todoItem;
}

// Helper function to submit a new task
async function submitTodos() {
  const project = document.querySelector('#project').value;
  const taskname = document.querySelector('#tasknameinput').value;
  const taskdesc = document.querySelector('#description').value;
  const assign = document.querySelector('#assign').value;
  const priority = document.querySelector('#priority').value;

  const todos = await getTodos();
  todos.push({ project, taskname, taskdesc, assign, priority });
  localStorage.setItem('todos', JSON.stringify(todos));

  const formContainer = document.getElementById('formContainer');
  formContainer.classList.remove('active');
  setTimeout(() => {
    formContainer.style.zIndex = -20;
  }, 500);

  resetForm();
  await showTodos();
}

// Helper function to update an existing task
async function updateData() {
  const todos = await getTodos();
  const editBtn = document.querySelectorAll('#edit');

  editBtn.forEach((item, index) => {
    item.addEventListener('click', () => {
      document.querySelector('.save').style.display = 'none';
      document.querySelector('.update').style.display = 'block';

      const formContainer = document.getElementById('formContainer');
      formContainer.classList.add('active');
      formContainer.style.zIndex = 20;

      document.querySelector('#project').value = todos[index].project;
      document.querySelector('#tasknameinput').value = todos[index].taskname;
      document.querySelector('#description').value = todos[index].taskdesc;
      document.querySelector('#assign').value = todos[index].assign;
      document.querySelector('#priority').value = todos[index].priority;

      const updateBtn = document.querySelector('.update');
      updateBtn.addEventListener('click', async () => {
        todos[index].project = document.querySelector('#project').value;
        todos[index].taskname = document.querySelector('#tasknameinput').value;
        todos[index].taskdesc = document.querySelector('#description').value;
        todos[index].assign = document.querySelector('#assign').value;
        todos[index].priority = document.querySelector('#priority').value;

        localStorage.setItem('todos', JSON.stringify(todos));
        formContainer.classList.remove('active');
        setTimeout(() => {
          formContainer.style.zIndex = -20;
        }, 500);
        await showTodos();
      });
    });
  });
}

// Helper function to move tasks to different categories
async function moveAssign() {
  const todos = await getTodos();
  const moveToToDo = document.querySelectorAll('.menu.move1');
  const moveToInProgress = document.querySelectorAll('.menu.move2');
  const moveToDone = document.querySelectorAll('.menu.move3');

  moveToToDo.forEach((item, index) => {
    if (todos[index].assign === 'todo') {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }

    item.addEventListener('click', async (event) => {
      event.stopPropagation();
      todos[index].assign = 'todo';
      localStorage.setItem('todos', JSON.stringify(todos));
      await showTodos();
    });
  });

  moveToInProgress.forEach((item, index) => {
    if (todos[index].assign === 'inprogress') {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }

    item.addEventListener('click', async (event) => {
      event.stopPropagation();
      todos[index].assign = 'inprogress';
      localStorage.setItem('todos', JSON.stringify(todos));
      await showTodos();
    });
  });

  moveToDone.forEach((item, index) => {
    if (todos[index].assign === 'done') {
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }

    item.addEventListener('click', async (event) => {
      event.stopPropagation();
      todos[index].assign = 'done';
      localStorage.setItem('todos', JSON.stringify(todos));
      await showTodos();
    });
  });
}

// Event listener for pop-up menu
function popMenu() {
  const menuBtn = document.querySelectorAll('.card-menu');
  const menu = document.querySelectorAll('.taskcard-menu');

  menuBtn.forEach((item, index) => {
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.forEach((menus, i) => {
        if (i === index) {
          menus.classList.toggle('pop');
        } else {
          menus.classList.remove('pop');
        }
      });
    });
  });

  document.addEventListener('click', () => {
    menu.forEach(menus => {
      menus.classList.remove('pop');
    });
  });
}

// Helper function to delete a task
function deleteData() {
  const delBtn = document.querySelectorAll('#delete');
  delBtn.forEach((item, index) => {
    item.addEventListener('click', async () => {
      const todos = await getTodos();
      todos.splice(index, 1);
      localStorage.setItem('todos', JSON.stringify(todos));
      await showTodos();
    });
  });
}
