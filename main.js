let addBut = document.querySelector("#submit");
let input = document.querySelector("#input-text");
let p = document.querySelector("#note");
let list = document.querySelector("#list");
let para_1 = document.querySelector(".para_1");
let para_2 = document.querySelector(".para_2");
let arrayOfTasks = [];

// Change theme
let standardTheme = document.querySelector(".standard-theme");
let lightTheme = document.querySelector(".light-theme");
let savedTheme = localStorage.getItem("savedTheme");

savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// get items from local storage for array
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}
getDataFormLocalStorage();
standardTheme.addEventListener("click", () => changeTheme("standard"));
lightTheme.addEventListener("click", () => changeTheme("light"));
addBut.onclick = function () {
  if (input.value === "") {
    para_1.classList.remove("color");
    para_2.classList.add("color");
  }
  if (input.value.length > "40") {
    para_2.classList.remove("color");
    para_1.classList.add("color");
  }
  if (input.value !== "" && input.value.length <= "40") {
    addTaskToArray(input.value);
    input.value = "";
    para_2.classList.remove("color");
    para_1.classList.remove("color");
  }
};

// bottom delete and done
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("but-del")) {
    deleteTaskFromLocalStorage(
      e.target.parentElement.parentElement.getAttribute("data-id")
    );
    e.target.parentElement.parentElement.remove();
    check();
  }
  if (e.target.classList.contains("done")) {
    // console.log(`${e.target.classList.contains("task")}`);
    toggleStatusTask(
      e.target.parentElement.parentElement.getAttribute("data-id")
    );
    e.target.parentElement.parentElement.classList.toggle("Done");
  }
});

// function to create new items
function addTaskToArray(content) {
  // task data
  const task = {
    id: Date.now(),
    title: content,
    completed: false,
  };
  // push task to array of tasks
  arrayOfTasks.push(task);
  // add tasks to page
  addElementsToPage(arrayOfTasks);
  //add tasks to local storage
  addDataLocalStorageFrom(arrayOfTasks);
}

function addElementsToPage(arrayOfTasks) {
  // empty tasks ul
  list.innerHTML = "";
  // looping on array tasks
  arrayOfTasks.forEach((task) => {
    let listItem = document.createElement("li");
    listItem.className = "task";
    if (task.completed) {
      listItem.className = "task Done";
    }
    listItem.setAttribute("data-id", task.id);
    let div_para = document.createElement("div");
    div_para.classList.add("div_para");
    listItem.appendChild(div_para);
    let p = document.createElement("p");
    p.className = "para-task";
    p.innerText = task.title;
    div_para.appendChild(p);
    let div_buts = document.createElement("div");
    div_buts.className = "div_buts";
    let button_done = document.createElement("button");
    button_done.innerText = "Done";
    button_done.className = "done";
    button_done.style.width = "max-content";
    button_done.style.padding = "4px";
    div_buts.appendChild(button_done);
    let button_del = document.createElement("button");
    button_del.innerText = "X";
    button_del.className = "but-del";
    div_buts.appendChild(button_del);
    listItem.appendChild(div_buts);
    list.appendChild(listItem);
  });
  p.style.display = "none";
  check();
}

// add tasks to local storage
function addDataLocalStorageFrom(arrayOfTasks) {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// get items from local storage
function getDataFormLocalStorage() {
  let data = localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPage(tasks);
  }
}

// delete tasks from local storage
function deleteTaskFromLocalStorage(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id != taskId);
  addDataLocalStorageFrom(arrayOfTasks);
}

// check if is the task completed or not
function toggleStatusTask(taskId) {
  for (let i = 0; i < arrayOfTasks.length; i++) {
    console.log(`${arrayOfTasks[i].id}`);
    if (arrayOfTasks[i].id == taskId) {
      arrayOfTasks[i].completed == false
        ? (arrayOfTasks[i].completed = true)
        : (arrayOfTasks[i].completed = false);
    }
  }
  addDataLocalStorageFrom(arrayOfTasks);
}

// function to cheek if are there tasks or not
function check() {
  if (list.children.length == 0) {
    p.style.display = "inline-block";
  } else {
    p.style.display = "none";
  }
}

// function to change Theme
function changeTheme(color) {
  localStorage.setItem("savedTheme", color);
  savedTheme = localStorage.getItem("savedTheme");
  document.body.className = color;
  // Change blinking cursor for darker theme:
  color === "darker"
    ? document.getElementById("title").classList.add("darker-title")
    : document.getElementById("title").classList.remove("darker-title");

  document.querySelector("input").classList.add(`${color}-input`);
  // Change todo color without changing their status (completed or not):
  document.querySelectorAll(".list").forEach((list) => {
    Array.from(list.classList).some((item) => item === "completed")
      ? list.classList.add(`list ${color}-list completed`)
      : list.classList.add(`list ${color}-list`);
  });
  // Change buttons color according to their type (todo, check or delete):
  document.querySelectorAll(".but-del").forEach((button) => {
    Array.from(button.classList).some((item) => {
      if (item === "check-btn") {
        button.classList.add(`check-btn ${color}-button`);
      } else if (item === "delete-btn") {
        button.classList.add(`delete-btn ${color}-button`);
      } else if (item === "todo-btn") {
        button.classList.add(`todo-btn ${color}-button`);
      }
    });
  });
}
