// Focus mode timer logic

// Timer state
let timerInterval = null;
let remainingSeconds = 25 * 60;
let initialSessionSeconds = 25 * 60;
let isSessionActive = false;
let isPaused = false;

// localStorage key for saving session history
const STORAGE_KEY = "tasklu_focus_history";

// DOM elements
const taskNameInput = document.getElementById("taskNameInput");
const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const timerDisplay = document.getElementById("timerDisplay");
const sessionStatus = document.getElementById("sessionStatus");
const sessionHistory = document.getElementById("sessionHistory");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const endBtn = document.getElementById("endBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");


// Converts a number of seconds into MM:SS or HH:MM:SS format
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


// Reads the duration inputs and returns total seconds
function getDurationInSeconds() {
    const hours = Number(hoursInput.value) || 0;
    const minutes = Number(minutesInput.value) || 0;
    return (hours * 3600) + (minutes * 60);
}


// Cleans user input to keep it simple and safe
function cleanTaskName(input) {
    const cleaned = input.trim().slice(0, 80);
    return cleaned || "General Focus Session";
}


// Updates the timer text shown to the user
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}


// Enables/disables buttons and inputs based on session state
function updateButtonStates() {
    startBtn.disabled = isSessionActive;
    pauseBtn.disabled = !isSessionActive || isPaused;
    resumeBtn.disabled = !isSessionActive || !isPaused;
    endBtn.disabled = !isSessionActive;

    hoursInput.disabled = isSessionActive;
    minutesInput.disabled = isSessionActive;
    taskNameInput.disabled = isSessionActive;
}


// Updates timer preview when inputs change
function refreshDurationPreview() {
    if (!isSessionActive) {
        remainingSeconds = getDurationInSeconds();
        initialSessionSeconds = remainingSeconds;
        updateTimerDisplay();
    }
}


// Gets stored session history from localStorage
function getStoredSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}


// Saves session history to localStorage
function saveStoredSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}


// Logs a focus session to storage
function logSession(status) {
    const completedSeconds = Math.max(0, initialSessionSeconds - remainingSeconds);

    const session = {
        id: Date.now(),
        taskName: cleanTaskName(taskNameInput.value),
        date: new Date().toLocaleString(),
        plannedSeconds: initialSessionSeconds,
        completedSeconds,
        status
    };

    const sessions = getStoredSessions();
    sessions.unshift(session);
    saveStoredSessions(sessions);
    renderSessionHistory();
}


// Renders session history safely (prevents XSS)
function renderSessionHistory() {
    const sessions = getStoredSessions();

    // Clear safely
    sessionHistory.textContent = "";

    if (!sessions.length) {
        const empty = document.createElement("p");
        empty.className = "empty-history";
        empty.textContent = "No focus sessions logged yet.";
        sessionHistory.appendChild(empty);
        return;
    }

    sessions.forEach(session => {
        const item = document.createElement("div");
        item.className = "history-item";

        const main = document.createElement("div");
        main.className = "history-main";

        const task = document.createElement("div");
        task.className = "history-task";
        task.textContent = session.taskName;

        const status = document.createElement("div");
        status.className = "history-status";
        status.textContent = session.status;

        const date = document.createElement("div");
        date.className = "history-meta";
        date.textContent = session.date;

        const times = document.createElement("div");
        times.className = "history-times";

        const planned = document.createElement("div");
        planned.textContent = `Planned: ${formatTime(session.plannedSeconds)}`;

        const logged = document.createElement("div");
        logged.textContent = `Logged: ${formatTime(session.completedSeconds)}`;

        main.appendChild(task);
        main.appendChild(status);
        main.appendChild(date);

        times.appendChild(planned);
        times.appendChild(logged);

        item.appendChild(main);
        item.appendChild(times);

        sessionHistory.appendChild(item);
    });
}


// Clears all saved session history
function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    renderSessionHistory();
}


// Resets session state after completion or stop
function resetSessionState(message) {
    isSessionActive = false;
    isPaused = false;

    remainingSeconds = getDurationInSeconds();
    initialSessionSeconds = remainingSeconds;

    sessionStatus.textContent = message;

    updateTimerDisplay();
    updateButtonStates();

    taskNameInput.value = "";
}


// Starts a new focus session
function startFocusSession() {
    if (isSessionActive) return;

    const totalSeconds = getDurationInSeconds();

    if (totalSeconds <= 0) {
        sessionStatus.textContent = "Please enter a duration greater than 0.";
        return;
    }

    remainingSeconds = totalSeconds;
    initialSessionSeconds = totalSeconds;
    isSessionActive = true;
    isPaused = false;

    sessionStatus.textContent = "Focus session in progress...";
    updateTimerDisplay();
    updateButtonStates();

    timerInterval = setInterval(runTimerTick, 1000);
}


// Handles timer countdown
function runTimerTick() {
    if (!isSessionActive || isPaused) return;

    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;

        remainingSeconds = 0;

        logSession("Completed");
        resetSessionState("Focus session complete.");
    }
}


// Pauses the session
function pauseFocusSession() {
    if (!isSessionActive || isPaused) return;

    isPaused = true;
    sessionStatus.textContent = "Session paused.";
    updateButtonStates();
}


// Resumes the session
function resumeFocusSession() {
    if (!isSessionActive || !isPaused) return;

    isPaused = false;
    sessionStatus.textContent = "Focus session resumed.";
    updateButtonStates();
}


// Ends the session early
function endFocusSession() {
    if (!isSessionActive) return;

    clearInterval(timerInterval);
    timerInterval = null;

    logSession("Ended Early");
    resetSessionState("Session ended.");
}


// Event listeners
hoursInput.addEventListener("input", refreshDurationPreview);
minutesInput.addEventListener("input", refreshDurationPreview);

startBtn.addEventListener("click", startFocusSession);
pauseBtn.addEventListener("click", pauseFocusSession);
resumeBtn.addEventListener("click", resumeFocusSession);
endBtn.addEventListener("click", endFocusSession);
clearHistoryBtn.addEventListener("click", clearHistory);


// Initial page setup
updateTimerDisplay();
updateButtonStates();
renderSessionHistory();