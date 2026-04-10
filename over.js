/* =========================
   GLOBAL DATE
========================= */
let currentDate = new Date();
let selectedDate = new Date();

/* =========================
   CALENDAR
========================= */
function renderCalendar() {
  const container = document.getElementById("calendarDays");
  container.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("monthYear").innerText =
    currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Empty spaces
  for (let i = 0; i < firstDay; i++) {
    container.innerHTML += "<div></div>";
  }

  // Days
  for (let i = 1; i <= lastDate; i++) {
    const day = document.createElement("div");
    day.className = "day";
    day.innerText = i;

    const thisDate = new Date(year, month, i);

    if (thisDate.toDateString() === selectedDate.toDateString()) {
      day.classList.add("selected");
    }

    day.onclick = () => {
      selectedDate = thisDate;
      renderCalendar();
      updateSelectedDate();
      loadTasks();
    };

    container.appendChild(day);
  }
}

function changeMonth(dir) {
  currentDate.setMonth(currentDate.getMonth() + dir);
  renderCalendar();
}

function updateSelectedDate() {
  document.getElementById("selectedDate").innerText =
    selectedDate.toDateString();
}

/* =========================
   TASK SYSTEM
========================= */
function addTask() {
  const input = document.getElementById("taskInput");
  const category = document.getElementById("category").value;
  const text = input.value.trim();

  if (!text) return;

  const key = selectedDate.toDateString();

  let data = JSON.parse(localStorage.getItem(key)) || {
    work: [],
    urgent: [],
    upcoming: []
  };

  data[category].push({ text, done: false });

  localStorage.setItem(key, JSON.stringify(data));

  input.value = "";
  loadTasks();
  updateStats();
}

function loadTasks() {
  const key = selectedDate.toDateString();

  let data = JSON.parse(localStorage.getItem(key)) || {
    work: [],
    urgent: [],
    upcoming: []
  };

  renderTaskList("taskList", data.work, "work");
  renderTaskList("urgentTasks", data.urgent, "urgent");
  renderTaskList("upcomingTasks", data.upcoming, "upcoming");
}

function renderTaskList(id, arr, type) {
  const el = document.getElementById(id);
  el.innerHTML = "";

  arr.forEach((task, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.innerText = task.text;
    if (task.done) text.classList.add("done");

    // ✔ COMPLETE
    const check = document.createElement("span");
    check.innerText = "✔";
    check.className = "icon";
    check.onclick = () => {
      toggleTask(type, index);
    };

    // ❌ DELETE
    const del = document.createElement("span");
    del.innerText = "✖";
    del.className = "icon";
    del.onclick = () => {
      deleteTask(type, index);
    };

    li.append(text, check, del);
    el.appendChild(li);
  });
}

function toggleTask(type, index) {
  const key = selectedDate.toDateString();
  let data = JSON.parse(localStorage.getItem(key));

  data[type][index].done = !data[type][index].done;

  localStorage.setItem(key, JSON.stringify(data));
  loadTasks();
  updateStats();
}

function deleteTask(type, index) {
  const key = selectedDate.toDateString();
  let data = JSON.parse(localStorage.getItem(key));

  data[type].splice(index, 1);

  localStorage.setItem(key, JSON.stringify(data));
  loadTasks();
  updateStats();
}

/* =========================
   GOALS
========================= */
function addGoal() {
  const input = document.getElementById("goalInput");
  const text = input.value.trim();

  if (!text) return;

  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.push({ text, done: false });

  localStorage.setItem("goals", JSON.stringify(goals));
  input.value = "";
  loadGoals();
}

function loadGoals() {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  const list = document.getElementById("goalList");
  list.innerHTML = "";

  goals.forEach((g, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.innerText = g.text;
    if (g.done) text.classList.add("done");

    const check = document.createElement("span");
    check.innerText = "✔";
    check.className = "icon";
    check.onclick = () => {
      goals[i].done = !goals[i].done;
      localStorage.setItem("goals", JSON.stringify(goals));
      loadGoals();
    };

    const del = document.createElement("span");
    del.innerText = "✖";
    del.className = "icon";
    del.onclick = () => {
      goals.splice(i, 1);
      localStorage.setItem("goals", JSON.stringify(goals));
      loadGoals();
    };

    li.append(text, check, del);
    list.appendChild(li);
  });
}

/* =========================
   SCHEDULE
========================= */
function addEvent() {
  const time = document.getElementById("timeInput").value;
  const text = document.getElementById("eventInput").value;

  if (!time || !text) return;

  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.push({ time, text });

  localStorage.setItem("events", JSON.stringify(events));

  document.getElementById("eventInput").value = "";
  loadEvents();
}

function loadEvents() {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  const list = document.getElementById("scheduleList");
  list.innerHTML = "";

  events.forEach((e, i) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.innerText = `${e.time} - ${e.text}`;

    const del = document.createElement("span");
    del.innerText = "✖";
    del.className = "icon";
    del.onclick = () => {
      events.splice(i, 1);
      localStorage.setItem("events", JSON.stringify(events));
      loadEvents();
    };

    li.append(text, del);
    list.appendChild(li);
  });
}

/* =========================
   QUOTE
========================= */
function saveQuote() {
  const text = document.getElementById("quoteInput").value;
  localStorage.setItem("quote", text);
  loadQuote();
}

function loadQuote() {
  const quote = localStorage.getItem("quote") || "";
  document.getElementById("quoteDisplay").innerText = quote;
  document.getElementById("quoteInput").value = quote;
}

/* =========================
   STATS
========================= */
function updateStats() {
  const key = selectedDate.toDateString();

  let data = JSON.parse(localStorage.getItem(key)) || {
    work: [],
    urgent: [],
    upcoming: []
  };

  let total =
    data.work.length +
    data.urgent.length +
    data.upcoming.length;

  let completed =
    data.work.filter(t => t.done).length +
    data.urgent.filter(t => t.done).length +
    data.upcoming.filter(t => t.done).length;

  document.getElementById("todayCount").innerText = total;
  document.getElementById("pendingCount").innerText = total - completed;
  document.getElementById("completedCount").innerText = completed;

  let percent = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById("productivity").innerText = percent + "%";
}

/* =========================
   INIT
========================= */
renderCalendar();
updateSelectedDate();
loadTasks();
loadGoals();
loadEvents();
loadQuote();
updateStats();