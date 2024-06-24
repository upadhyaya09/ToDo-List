const input = document.querySelector("input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter"); // changed to querySelectorAll
let filter = '';

showTodos();

function getTodoHtml(todo, index) {
  if (filter && filter !== todo.status) {
    return '';
  }
  let checked = todo.status === "completed" ? "checked" : "";
  return `
    <li class="todo">
      <label for="${index}">
        <input id="${index}" type="checkbox" ${checked} />
        <span class="${checked}">${todo.name}</span>
      </label>
      <button class="delete-btn" data-index="${index}"><i class="ri-delete-bin-line"></i></button>
    </li>
  `;
}

function showTodos() {
  if (todosJson.length === 0) {
    todosHtml.innerHTML = '';
    emptyImage.style.display = 'block';
  } else {
    todosHtml.innerHTML = todosJson.map(getTodoHtml).join('');
    emptyImage.style.display = 'none';
  }
}

function addTodo(todo) {
  input.value = "";
  todosJson.unshift({ name: todo, status: "pending" });
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

function updateStatus(element) {
  const index = element.id;
  todosJson[index].status = todosJson[index].status === "pending" ? "completed" : "pending";
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}

input.addEventListener("keyup", (e) => {
  let todo = input.value.trim();
  if (!todo || e.key !== "Enter") {
    return;
  }
  addTodo(todo);
});

addButton.addEventListener("click", () => {
  let todo = input.value.trim();
  if (!todo) {
    return;
  }
  addTodo(todo);
});

todosHtml.addEventListener("click", (e) => {
  if (e.target.tagName === "INPUT") {
    updateStatus(e.target);
  } else if (e.target.tagName === "BUTTON") {
    remove(e.target);
  }
});

filters.forEach((el) => {
  el.addEventListener("click", (e) => {
    if (el.classList.contains("active")) {
      el.classList.remove("active");
      filter = "";
    } else {
      filters.forEach((tag) => tag.classList.remove("active"));
      el.classList.add("active");
      filter = e.target.dataset.filter;
    }
    showTodos();
  });
});

deleteAllButton.addEventListener("click", () => {
  todosJson = [];
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
});

function remove(element) {
  const index = element.dataset.index;
  todosJson.splice(index, 1);
  localStorage.setItem("todos", JSON.stringify(todosJson));
  showTodos();
}