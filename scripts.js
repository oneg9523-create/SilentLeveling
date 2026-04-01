// =======================
// AUTH SYSTEM
// =======================
function register() {
  const u = regUser.value;
  const p = regPass.value;

  if (localStorage.getItem("user_" + u)) {
    alert("Username already exists");
    return;
  }

  localStorage.setItem("user_" + u, p);
  alert("Account created!");
  location.href = "signin.html";
}

function login() {
  const u = loginUser.value;
  const p = loginPass.value;

  if (localStorage.getItem("user_" + u) === p) {
    localStorage.setItem("session", u);
    location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
    loginPass.value = "";
  }
}

function logout() {
  localStorage.removeItem("session");
  location.href = "index.html";
}

// =======================
// USER
// =======================
function getUser() {
  return localStorage.getItem("session");
}

// =======================
// XP SYSTEM
// =======================
function getXP() {
  return parseInt(localStorage.getItem("xp_" + getUser()) || "0");
}

function setXP(xp) {
  localStorage.setItem("xp_" + getUser(), xp);
}

function addXP(amount) {
  let xp = getXP();
  xp += amount;
  setXP(xp);
}

function getLevel() {
  return Math.floor(getXP() / 100) + 1;
}

function clearXP() {
  const user = getUser();
  if (!user) return;

  localStorage.setItem("xp_" + user, 0);
  
  render();
  alert("XP has been reset to 0!");
}

// =======================
// TASK SYSTEM
// =======================
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks_" + getUser()) || "[]");
}

const defaultTasks = [
  { name: "Wake up at 5am ⏰", done: false, difficulty: 3 },
  { name: "Gym/Stretch 💪", done: false, difficulty: 3 },
  { name: "Meditate 🧘", done: false, difficulty: 1 },
  { name: "Cold Shower 🚿", done: false, difficulty: 2 },
  { name: "Reading / Learning 📖", done: false, difficulty: 2 },
  { name: "Budget Tracking 💰", done: false, difficulty: 1 },
  { name: "Project Work 🎯", done: false, difficulty: 3 },
  { name: "No Sugar 🍬", done: false, difficulty: 2 },
  { name: "No Alcohol", done: false, difficulty: 2 },
  { name: "Social Media Detox 🌿", done: false, difficulty: 3 },
  { name: "Drink 3L of Water 💧", done: false, difficulty: 3 },
  { name: "Goal Journaling 📜", done: false, difficulty: 1 }
];

// Initialize default tasks for new users
function initDefaultTasks() {
  const user = getUser();
  if (!user) return;

  let tasks = getTasks();
  // Only add defaults if user has no tasks
  if (tasks.length === 0) {
    saveTasks(defaultTasks);
    render();
  }
}

// Call this on dashboard load
initDefaultTasks();

function saveTasks(tasks) {
  localStorage.setItem("tasks_" + getUser(), JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const diffEl = document.getElementById("difficulty");

  if (!input.value.trim()) return;

  const difficulty = diffEl ? parseInt(diffEl.value) : 1;

  const tasks = getTasks();

  tasks.push({
    name: input.value,
    done: false,
    difficulty: difficulty
  });

  saveTasks(tasks);
  input.value = "";
  render();
}

function toggleTask(i) {
  const tasks = getTasks();
  const task = tasks[i];
  const difficulty = task.difficulty || 1;
  const xpGain = difficulty * 5;

  // Add XP when checking, subtract when unchecking
  if (!task.done) {
    addXP(xpGain);
  } else {
    let currentXP = getXP();
    currentXP -= xpGain;
    if (currentXP < 0) currentXP = 0;
    setXP(currentXP);
  }

  task.done = !task.done;
  saveTasks(tasks);
  render();
}

function deleteTask(i) {
  const tasks = getTasks();
  tasks.splice(i, 1);
  saveTasks(tasks);
  render();
}

// =======================
// TRACKER SYSTEM
// =======================
function getTracker() {
  return JSON.parse(localStorage.getItem("tracker_" + getUser()) || "[]");
}

function saveTracker(data) {
  localStorage.setItem("tracker_" + getUser(), JSON.stringify(data));
}

function renderTracker() {
  const container = document.getElementById("tracker");
  if (!container) return;

  const data = getTracker();
  container.innerHTML = "";

  for (let i = 0; i < 365; i++) {
    const div = document.createElement("div");
    div.className = "day" + (data[i] ? " active" : "");
    div.onclick = () => {
      data[i] = !data[i];
      saveTracker(data);
      render();
    };
    container.appendChild(div);
  }
}

// =======================
// STREAK SYSTEM
// =======================
function calculateStreaks() {
  const data = getTracker();
  let current = 0, best = 0, temp = 0;

  for (let i = 0; i < 365; i++) {
    if (data[i]) {
      temp++;
      if (temp > best) best = temp;
    } else temp = 0;
  }

  for (let i = 364; i >= 0; i--) {
    if (data[i]) current++;
    else break;
  }

  const currentEl = document.getElementById("currentStreak");
  const bestEl = document.getElementById("bestStreak");
  if (currentEl) currentEl.innerText = current;
  if (bestEl) bestEl.innerText = best;
}

// =======================
// MAIN RENDER
// =======================
function render() {
  const list = document.getElementById("taskList");
  const tasks = getTasks();

  if (list) {
    list.innerHTML = "";
    let done = 0;

    tasks.forEach((t, i) => {
      if (t.done) done++;
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <span>${t.name}</span>
        <div>
          <input type="checkbox" ${t.done ? "checked" : ""} onclick="toggleTask(${i})">
          <button onclick="deleteTask(${i})">❌</button>
        </div>
      `;
      list.appendChild(div);
    });

    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

    const fill = document.getElementById("progressFill");
    const percentText = document.getElementById("progressPercent");
    const totalEl = document.getElementById("totalHabits");
    const completedEl = document.getElementById("completedHabits");

    if (fill) fill.style.width = percent + "%";
    if (percentText) percentText.innerText = percent + "%";
    if (totalEl) totalEl.innerText = tasks.length;
    if (completedEl) completedEl.innerText = done;
  }

  renderTracker();
  calculateStreaks();

  const xpEl = document.getElementById("xp");
  const levelEl = document.getElementById("level");
  if (xpEl) xpEl.innerText = getXP();
  if (levelEl) levelEl.innerText = getLevel();
}

// =======================
// INIT
// =======================
render();


function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  if (window.innerWidth <= 768) {
    // Mobile: slide overlay
    sidebar.classList.toggle("visible");
  } else {
    // Desktop: shift main content
    sidebar.classList.toggle("hidden");
    main.classList.toggle("full");
  }
}

if (window.innerWidth <= 768) {
  document.body.classList.toggle("sidebar-active");
}