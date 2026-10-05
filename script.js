span; /* ---------- Data (replace with your real results) ---------- */
const STEPS = [
  "Dataset",
  "Cleaning",
  "EDA",
  "Features",
  "Model",
  "Evaluation",
  "Prediction",
  "Visualization",
];
const CURRENT_STEP = 5; // zero-based index of the highlighted step
const VARS = [
  "Temperature",
  "Precipitation",
  "Humidity",
  "Wind Speed",
  "Other",
];
const HEAT_LABELS = ["Temp", "Precip", "Humid", "Wind", "Other"];
const CORR = [
  [1, 0.2, -0.4, 0.1, 0.5],
  [0.2, 1, 0.6, 0.3, 0.1],
  [-0.4, 0.6, 1, -0.2, 0.2],
  [0.1, 0.3, -0.2, 1, -0.1],
  [0.5, 0.1, 0.2, -0.1, 1],
];
const MODELS = [
  ["ARIMA", "Time series"],
  ["Exponential Smoothing", "Time series"],
  ["Scikit-learn model", "Machine learning"],
  ["LSTM (optional)", "Deep learning"],
];
const QUALITY = [
  ["Completeness", 80],
  ["Outliers handled", 65],
  ["Scaled features", 90],
];

/* Illustrative chart paths per variable: [observed, fit, prediction] */
const PATHS = {
  Temperature: [
    "M40 170 C80 150 110 175 150 140 C190 110 220 150 260 120 C300 90 330 125 370 100 L400 95",
    "M200 143 C240 132 280 126 320 116 C360 108 380 104 400 99",
    "M400 95 C450 80 500 66 590 48",
  ],
  Precipitation: [
    "M40 120 C80 160 110 100 150 150 C190 90 220 160 260 110 C300 150 330 100 370 130 L400 120",
    "M200 130 C240 125 280 128 320 122 C360 120 380 122 400 122",
    "M400 120 C450 118 500 125 590 120",
  ],
  Humidity: [
    "M40 140 C90 120 130 150 170 130 C210 115 250 140 290 125 C330 110 360 130 400 118",
    "M200 128 C240 126 280 124 320 122 C360 120 380 119 400 118",
    "M400 118 C450 112 500 108 590 100",
  ],
  "Wind Speed": [
    "M40 100 C80 130 120 90 160 125 C200 150 240 100 280 130 C320 150 360 110 400 120",
    "M200 120 C240 126 280 122 320 124 C360 122 380 121 400 121",
    "M400 121 C450 123 500 122 590 124",
  ],
  Other: [
    "M40 160 C100 150 150 130 200 140 C250 150 300 110 350 105 L400 100",
    "M200 138 C240 136 280 118 320 110 C360 106 380 103 400 102",
    "M400 100 C450 92 500 85 590 75",
  ],
};

/* ---------- Render ---------- */
const $ = (id) => document.getElementById(id);

// Pipeline
$("steps").innerHTML = STEPS.map((s, i) => {
  const cls = i < CURRENT_STEP ? "done" : i === CURRENT_STEP ? "current" : "";
  return `<div class="step ${cls}"><div class="dot">${i + 1}</div>${s}</div>`;
}).join("");

// Heatmap
const color = (v) =>
  v >= 0
    ? `rgba(63,193,176,${(0.15 + 0.85 * v).toFixed(2)})`
    : `rgba(245,158,66,${(0.15 + 0.85 * -v).toFixed(2)})`;
$("heat").innerHTML = CORR.flatMap((row, i) =>
  row.map(
    (v, j) =>
      `<div style="background:${color(v)}" title="${HEAT_LABELS[i]} vs ${HEAT_LABELS[j]}"></div>`,
  ),
).join("");
$("heat-labels").innerHTML = HEAT_LABELS.map((l) => `<span>${l}</span>`).join(
  "",
);

// Model table
$("models").innerHTML = MODELS.map(
  ([n, t]) =>
    `<tr><td>${n}</td><td>${t}</td><td>[ ]</td><td>[ ]</td><td>[ ]</td></tr>`,
).join("");

// Quality bars
$("bars").innerHTML = QUALITY.map(
  ([n, w]) => `
  <div>
    <div class="bar-head"><span>${n}</span><span class="note">[value]</span></div>
    <div class="track"><div class="fill" style="width:${w}%"></div></div>
  </div>`,
).join("");

// Chart + tabs
function drawChart(name) {
  const [obs, fit, pred] = PATHS[name];
  $("chart").innerHTML = `
    <g stroke="#2F4A4F"><line x1="40" y1="30" x2="590" y2="30"/><line x1="40" y1="90" x2="590" y2="90"/>
      <line x1="40" y1="150" x2="590" y2="150"/><line x1="40" y1="210" x2="590" y2="210"/></g>
    <rect x="400" y="20" width="190" height="190" fill="#F59E42" opacity="0.1"/>
    <path d="${obs}" fill="none" stroke="#E8F0EE" stroke-width="2.5"/>
    <path d="${fit}" fill="none" stroke="#3FC1B0" stroke-width="3"/>
    <path d="${pred}" fill="none" stroke="#F59E42" stroke-width="3" stroke-dasharray="6 5"/>
    <g fill="#A9BFBB" font-size="11"><text x="40" y="230">Start of record</text>
      <text x="400" y="230">Forecast begins</text><text x="540" y="230">Future</text></g>`;
}
$("tabs").innerHTML = VARS.map(
  (v, i) =>
    `<button class="tab ${i === 0 ? "active" : ""}" role="tab" data-v="${v}">${v}</button>`,
).join("");
$("tabs").addEventListener("click", (e) => {
  const b = e.target.closest(".tab");
  if (!b) return;
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.toggle("active", t === b));
  drawChart(b.dataset.v);
});
drawChart(VARS[0]);

// Sidebar nav highlight
document.querySelectorAll(".nav-btn").forEach((b) =>
  b.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-btn")
      .forEach((x) => x.classList.toggle("active", x === b));
  }),
);

// Upload: show the record count of a CSV file
$("file").addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  f.text().then((t) => {
    $("s-records").textContent = Math.max(
      t.trim().split("\n").length - 1,
      0,
    ).toLocaleString();
  });
});

// Run prediction: hook your Python/ML backend here (e.g. fetch('/predict'))
$("run").addEventListener("click", () => {
  $("s-model").textContent = "LSTM";
});
