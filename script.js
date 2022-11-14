"use strict";

const formTask = document.querySelector(".form-task");
const inbox = document.querySelector(".inbox");
const today = document.querySelector(".today");
const week = document.querySelector(".week");
const sideNav = document.querySelector(".side-nav");
const formProject = document.querySelector(".form-project");
const newTaskBtn = document.querySelector(".add-task");
const newProjectBtn = document.querySelector(".add-project");
const addTaskBtn = document.querySelector(".task-submit");
const cancelTaskBtn = document.querySelector(".cancel-submit");
const projectList = document.querySelector(".projects-list");
const taskList = document.querySelector(".task-list");
const projectNameHeader = document.querySelector(".project-name-header");
// const menuBtn = document.querySelector(".menu-btn");

class Todo {
  #date = new Date();
  #id = Date.now();

  constructor(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  getId() {
    return this.#id;
  }
}

class Project {
  #id = Date.now();
  #todos = [];

  constructor(name) {
    this.name = name;
  }

  getId() {
    return this.#id;
  }

  getTodos() {
    return this.#todos;
  }

  addTodo(todo) {
    this.#todos.push(todo);
  }

  removeTodo(todo) {
    const removeTodoIndex = this.#todos.indexOf(todo);
    this.#todos.splice(removeTodoIndex, 1);
  }
}

class DOMStuff {
  constructor() {}

  showProject(project) {
    const html = `<li><a class="nav-btn" data-id=${project.getId()} href="#">${
      project.name
    }</a></li>`;
    formProject.closest("li").insertAdjacentHTML("beforebegin", html);
  }

  showTasks(todos) {
    this._removeTasks();
    if (!todos) return;
    todos.forEach((todo) => {
      const html = `<li class="task-container task-container-${
        todo.priority
      }" data-id=${todo.getId()}>
      <button type="button" class="btn complete">
      <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"
      />
      </svg>
      </button>
      <div class="task ${todo.priority}">
        <div class="task-title">${todo.title}</div>
        <div class="task-desc">
          ${todo.description}
        </div>
        <div class="task-due-date">${todo.dueDate}</div>
        <div class="task-priority">${this._returnPriority(todo.priority)}</div>
      </div>
    </li>`;
      formTask.closest("li").insertAdjacentHTML("beforebegin", html);
    });
  }

  showTodayTasks(projects) {
    this.resetMain();
    newTaskBtn.classList.add("hidden");
    projectNameHeader.textContent = "Today";
    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const todayTodos = [];
    if (!projects) return;
    projects.forEach((project) => {
      if (!project.getTodos()) return;
      todayTodos.push(
        ...project.getTodos().filter((todo) => todo.dueDate === today)
      );
    });
    this.showTasks(todayTodos);
  }

  showThisWeekTasks(projects) {
    this.resetMain();
    newTaskBtn.classList.add("hidden");
    projectNameHeader.textContent = "This Week";
    const date = new Date();
    const today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const thisWeekTodos = [];
    if (!projects) return;
    projects.forEach((project) => {
      if (!project.getTodos()) return;
      thisWeekTodos.push(
        ...project
          .getTodos()
          .filter(
            (todo) =>
              Date.parse(todo.dueDate) - Date.parse(today) <=
              7 * 24 * 60 * 60 * 1000
          )
      );
    });
    this.showTasks(thisWeekTodos);
  }

  showProjectName(project, projectId) {
    projectNameHeader.textContent = project.name;
    projectNameHeader.dataset.id = projectId;
  }

  resetMain() {
    formTask.reset();
    formTask.classList.add("hidden");
    newTaskBtn.classList.remove("hidden");
  }

  _removeTasks() {
    const tasks = document.querySelectorAll(".task-container");
    if (!tasks) return;
    tasks.forEach((task) => task.remove());
  }

  _returnPriority(priority) {
    if (priority === "p-1") return "High Priprity";
    if (priority === "p-2") return "Mudium Priprity";
    if (priority === "p-3") return "Low Priprity";
    if (priority === "p-4") return "No Priprity";
  }

  //Hide/show and reset project form input
  toggleProjectForm() {
    formProject.classList.toggle("hidden");
    // focus on project name input field
    formProject.querySelector("input").focus();
    formProject.reset();
  }
  //Hide/show and reset task form input
  toggleTaskForm() {
    formTask.classList.toggle("hidden");
    newTaskBtn.classList.toggle("hidden");
    // Set minimum due date to today
    const today = new Date();
    formTask.querySelector("#due-date").min = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    formTask.reset();
  }

  removeTask(task) {
    task.remove();
  }

  // showProjectTask(projects, projectId) {
  //   console.log(projects);
  //   console.log(projectId);
  //   const project = projects.find((project) => project.getId() === projectId);
  //   console.log(project);
  //   this.resetMain();
  //   this.showProjectName(project, projectId);
  //   if (project.dataset.id === "22") this.showTodayTasks();
  //   else if (project.dataset.id === "77") this.showThisWeekTasks();
  //   // else if (project.dataset.id === "00") this.showTasks;
  //   else this.showTasks(project);
  // }
}

const DOM = new DOMStuff();

class App {
  #projects = [];
  constructor() {
    // complete button functionality
    taskList.addEventListener("click", (e) => {
      if (e.target.closest("button").classList.contains("complete")) {
        this._removeTask(e);
      }
      // need to add edit form functionality
    });

    sideNav.addEventListener("click", (e) => {
      if (!e.target.closest("a")) return;
      console.log(e.target.closest("a"));
      if (e.target.closest("a").classList.contains("inbox")) {
        this._inboxHandler.call(this);
      } else if (e.target.closest("a").classList.contains("today")) {
        newTaskBtn.classList.add("hidden");
        DOM.showTodayTasks(this.#projects);
      } else if (e.target.closest("a").classList.contains("week")) {
        DOM.showThisWeekTasks(this.#projects);
      } else if (e.target.closest("a").classList.contains("nav-btn")) {
        this._projectListHandler.call(this, e);
      }
    });

    newTaskBtn.addEventListener("click", DOM.toggleTaskForm);

    cancelTaskBtn.addEventListener("click", DOM.toggleTaskForm);

    newProjectBtn.addEventListener("click", DOM.toggleProjectForm);

    formProject.addEventListener("submit", this._formProjectHandler.bind(this));

    formTask.addEventListener("submit", this._formTaskHandler.bind(this));

    // projectList.addEventListener("click", this._projectListHandler.bind(this));
  }

  _removeTask(e) {
    const task = e.target.closest("li");
    const taskId = +task.dataset.id;
    DOM.removeTask(task);
    this.#projects.forEach((project) => {
      const removeTask = project
        .getTodos()
        .find((todo) => todo.getId() === taskId);
      if (removeTask) {
        console.log(project);
        project.removeTodo(removeTask);

        console.log(project);
      }
    });
  }

  _inboxHandler() {
    // newTaskBtn.classList.remove("hidden");
    DOM.resetMain();
    const project = this.#projects.find((project) => project.isInbox === true);
    DOM.showProjectName(project, +project.getId());
    DOM.showTasks(project.getTodos());
  }

  showInbox() {
    const project = new Project("Inbox");
    this.#projects.push(project);
    project.isInbox = true;
    DOM.showProjectName(project, +project.getId());
    DOM.showTasks(project.getTodos());
  }

  _formProjectHandler(e) {
    e.preventDefault();
    this._newProject();
    DOM.toggleProjectForm();
  }

  _formTaskHandler(e) {
    e.preventDefault();
    // Breake DRY rule
    const project = this.#projects.find(
      (project) => project.getId() === +projectNameHeader.dataset.id
    );
    // console.log(project);
    this._newTodo(project);
    DOM.showTasks(project.getTodos());
    DOM.toggleTaskForm();
  }

  _projectListHandler(e) {
    DOM.resetMain();
    const projectId = +e.target.dataset.id;
    // Breake DRY rule
    const project = this.#projects.find(
      (project) => project.getId() === projectId
    );
    DOM.showProjectName(project, projectId);
    DOM.showTasks(project.getTodos());
  }

  _switchProject() {}

  _newTodo(project) {
    const title = document.querySelector("#title").value;
    const priority = document.querySelector("#priority").value;
    const dueDate = document.querySelector("#due-date").value;
    const desc = document.querySelector("#desc").value;
    const todo = new Todo(title, desc, dueDate, priority);
    project.addTodo(todo);
  }

  _newProject() {
    const projectName = document.querySelector("#project-name").value;
    const project = new Project(projectName);
    this.#projects.push(project);
    DOM.showProject(project);
  }
}

const app = new App();
app.showInbox();
