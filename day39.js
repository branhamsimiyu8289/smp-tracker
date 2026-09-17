const API_HOST = typeof window !== "undefined" && window.location.hostname
  ? window.location.hostname
  : "127.0.0.1";
const API_BASE = `http://${API_HOST}:8000`;

const submitCheckIn = async (payload) => {
  const response = await fetch(`${API_BASE}/api/checkins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const form = typeof document === "undefined" ? null : document.querySelector("#d4form");
const resultEl = typeof document === "undefined" ? null : document.querySelector("#d4result");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const sleepValue = document.querySelector("#d4sleep").value;
  const waterValue = document.querySelector("#d4water").value;
  const stepsValue = document.querySelector("#d4steps").value;
  const payload = {
    name: document.querySelector("#d4name").value.trim(),
    sleep: Number(sleepValue),
    water: Number(waterValue),
    steps: Number(stepsValue)
  };

  if (!payload.name || !sleepValue || !waterValue || !stepsValue ||
      !Number.isFinite(payload.sleep) ||
      !Number.isInteger(payload.water) || !Number.isInteger(payload.steps)) {
    resultEl.textContent = "All fields are required.";
    resultEl.style.color = "#ff7b72";
    return;
  }

  resultEl.textContent = "Saving...";
  resultEl.style.color = "#a5d6ff";

  try {
    const response = await submitCheckIn(payload);
    const stored = response.stored;
    resultEl.textContent = `Saved ${stored.name}. Goal: ${stored.hit_goal ? "HIT" : "MISS"}.`;
    resultEl.style.color = stored.hit_goal ? "#4ecca3" : "#f5a623";
    form.reset();
  } catch (error) {
    resultEl.textContent = "Could not connect to the API. Is Uvicorn running?";
    resultEl.style.color = "#ff7b72";
    console.error(error);
  }
});
