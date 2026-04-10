const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const chartCanvas = document.getElementById("taskChart");
const emptyMsg = document.getElementById("empty-msg");
 
let chart = null;
let taskHistory = [];
 
/* ── Add Task ── */
function addTask() {
  const val = inputBox.value.trim();
  if (!val) return;
 
  const li = document.createElement("li");
 
  const textSpan = document.createElement("span");
  textSpan.textContent = val;
  textSpan.style.flex = "1";
 
  const del = document.createElement("span");
  del.className = "del-btn";
  del.innerHTML = "&#215;";
  del.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    syncAll();
  };
 
  li.appendChild(textSpan);
  li.appendChild(del);
  li.addEventListener("click", () => {
    li.classList.toggle("checked");
    syncAll();
  });
 
  listContainer.appendChild(li);
  inputBox.value = "";
  syncAll();
}
 
/* ── Enter Key Support ── */
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});
 
/* ── Sync All ── */
function syncAll() {
  updateStats();
  trackHistory();
  updateChart();
  emptyMsg.style.display = listContainer.children.length ? "none" : "block";
}
 
/* ── Update Stat Cards ── */
function updateStats() {
  const total = listContainer.querySelectorAll("li").length;
  const done = listContainer.querySelectorAll("li.checked").length;
  const rate = total ? Math.round((done / total) * 100) : 0;
 
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-rate").textContent = rate + "%";
}
 
/* ── Track History for Chart ── */
function trackHistory() {
  const total = listContainer.querySelectorAll("li").length;
  const done = listContainer.querySelectorAll("li.checked").length;
  taskHistory.push({ created: total, completed: done });
  if (taskHistory.length > 14) taskHistory.shift();
}
 
/* ── Update Chart ── */
function updateChart() {
  const labels = taskHistory.map((_, i) => "Day " + (i + 1));
  const created = taskHistory.map((d) => d.created);
  const completed = taskHistory.map((d) => d.completed);
 
  if (chart) chart.destroy();
 
  chart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Tasks Created",
          data: created,
          borderColor: "#90caf9",
          backgroundColor: "rgba(144,202,249,0.18)",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: "#90caf9",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Tasks Completed",
          data: completed,
          borderColor: "#1a6fd4",
          backgroundColor: "rgba(26,111,212,0.06)",
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: "#1a6fd4",
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: "rgba(26,111,212,0.07)" },
          ticks: { color: "#7a9ab8", font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "rgba(26,111,212,0.07)" },
          ticks: { color: "#7a9ab8", font: { size: 11 }, stepSize: 1, precision: 0 },
        },
      },
    },
  });
}
 
/* ── Init ── */
syncAll();