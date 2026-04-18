// Focus mode timer logic

// Timer state
let timerInterval = null;
let remainingSeconds = 25 * 60;
let initialSessionSeconds = 25 * 60;
let isSessionActive = false;
let isPaused = false;

// localStorage key for saving session history
const STORAGE_KEY = "tasklu_focus_history";

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

// Reads the duration inputs and returns total seconds.
function getDurationInSeconds() {
    const hours = Number(hoursInput.value) || 0;
    const minutes = Number(minutesInput.value) || 0;
    return (hours * 3600) + (minutes * 60);
}

// Updates the timer text shown to the user
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}

// Enables/disables buttons and inputs based on session state.
function updateButtonStates() {
    startBtn.disabled = isSessionActive;
    pauseBtn.disabled = !isSessionActive || isPaused;
    resumeBtn.disabled = !isSessionActive || !isPaused;
    endBtn.disabled = !isSessionActive;

    hoursInput.disabled = isSessionActive;
    minutesInput.disabled = isSessionActive;
    taskNameInput.disabled = isSessionActive;
}

// While no session is active, changing hours/minutes updates the preview.
function refreshDurationPreview() {
    if (!isSessionActive) {
        remainingSeconds = getDurationInSeconds();
        initialSessionSeconds = remainingSeconds;
        updateTimerDisplay();
    }
}

// Gets stored session history from localStorage.
function getStoredSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Saves session history to localStorage.
function saveStoredSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// Logs a completed or ended focus session to localStorage.
function logSession(status) {
    const completedSeconds = Math.max(0, initialSessionSeconds - remainingSeconds);

    const session = {
        id: Date.now(),
        taskName: taskNameInput.value.trim() || "General Focus Session",
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

// Renders session history underneath the timer.
function renderSessionHistory() {
    const sessions = getStoredSessions();

    if (!sessions.length) {
        sessionHistory.innerHTML = `<p class="empty-history">No focus sessions logged yet.</p>`;
        return;
    }

    sessionHistory.innerHTML = sessions.map(session => `
        <div class="history-item">
            <div class="history-main">
                <div class="history-task">${session.taskName}</div>
                <div class="history-status">${session.status}</div>
                <div class="history-meta">${session.date}</div>
            </div>
            <div class="history-times">
                <div><strong>Planned:</strong> ${formatTime(session.plannedSeconds)}</div>
                <div><strong>Logged:</strong> ${formatTime(session.completedSeconds)}</div>
            </div>
        </div>
    `).join("");
}

// Clears all saved session history.
function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    renderSessionHistory();
}

// Starts a new focus session.
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

// Handles the timer countdown.
function runTimerTick() {
    if (!isSessionActive || isPaused) return;

    remainingSeconds--;
    updateTimerDisplay();

    if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isSessionActive = false;
        isPaused = false;
        remainingSeconds = 0;

        sessionStatus.textContent = "Focus session complete.";
        updateTimerDisplay();
        updateButtonStates();

        // Log the completed session
        logSession("Completed");

        // Clear optional task label for the next session
        taskNameInput.value = "";
    }
}

// Pauses the current focus session
function pauseFocusSession() {
    if (!isSessionActive || isPaused) return;

    isPaused = true;
    sessionStatus.textContent = "Session paused.";
    updateButtonStates();
}

// Resumes a paused session
function resumeFocusSession() {
    if (!isSessionActive || !isPaused) return;

    isPaused = false;
    sessionStatus.textContent = "Focus session resumed.";
    updateButtonStates();
}

// Ends the current session early and logs partial time.
function endFocusSession() {
    if (!isSessionActive) return;

    clearInterval(timerInterval);
    timerInterval = null;

    // Log the partial session before resetting state
    logSession("Ended Early");

    isSessionActive = false;
    isPaused = false;

    remainingSeconds = getDurationInSeconds();
    initialSessionSeconds = remainingSeconds;

    sessionStatus.textContent = "Session ended.";
    updateTimerDisplay();
    updateButtonStates();

    // Clear optional task label for the next session
    taskNameInput.value = "";
}

// Event Listeners
hoursInput.addEventListener("input", refreshDurationPreview);
minutesInput.addEventListener("input", refreshDurationPreview);

startBtn.addEventListener("click", startFocusSession);
pauseBtn.addEventListener("click", pauseFocusSession);
resumeBtn.addEventListener("click", resumeFocusSession);
endBtn.addEventListener("click", endFocusSession);
clearHistoryBtn.addEventListener("click", clearHistory);

// Initial render of session history on page load
updateTimerDisplay();
updateButtonStates();
renderSessionHistory();