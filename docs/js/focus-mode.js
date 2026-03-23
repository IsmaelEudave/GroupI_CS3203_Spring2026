let timerInterval = null;
let remainingSeconds = 25 * 60;
let isSessionActive = false;
let isPaused = false;

const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const timerDisplay = document.getElementById("timerDisplay");
const sessionStatus = document.getElementById("sessionStatus");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const endBtn = document.getElementById("endBtn");

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getDurationInSeconds() {
    const hours = Number(hoursInput.value) || 0;
    const minutes = Number(minutesInput.value) || 0;
    return (hours * 3600) + (minutes * 60);
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
}

function updateButtonStates() {
    startBtn.disabled = isSessionActive;
    pauseBtn.disabled = !isSessionActive || isPaused;
    resumeBtn.disabled = !isSessionActive || !isPaused;
    endBtn.disabled = !isSessionActive;

    hoursInput.disabled = isSessionActive;
    minutesInput.disabled = isSessionActive;
}

function refreshDurationPreview() {
    if (!isSessionActive) {
        remainingSeconds = getDurationInSeconds();
        updateTimerDisplay();
    }
}

function startFocusSession() {
    if (isSessionActive) {
        return;
    }

    const totalSeconds = getDurationInSeconds();

    if (totalSeconds <= 0) {
        sessionStatus.textContent = "Please enter a duration greater than 0.";
        return;
    }

    remainingSeconds = totalSeconds;
    isSessionActive = true;
    isPaused = false;

    sessionStatus.textContent = "Focus session in progress...";
    updateTimerDisplay();
    updateButtonStates();

    timerInterval = setInterval(runTimerTick, 1000);
}

function runTimerTick() {
    if (!isSessionActive || isPaused) {
        return;
    }

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
    }
}

function pauseFocusSession() {
    if (!isSessionActive || isPaused) {
        return;
    }

    isPaused = true;
    sessionStatus.textContent = "Session paused.";
    updateButtonStates();
}

function resumeFocusSession() {
    if (!isSessionActive || !isPaused) {
        return;
    }

    isPaused = false;
    sessionStatus.textContent = "Focus session resumed.";
    updateButtonStates();
}

function endFocusSession() {
    if (!isSessionActive) {
        return;
    }

    clearInterval(timerInterval);
    timerInterval = null;
    isSessionActive = false;
    isPaused = false;

    remainingSeconds = getDurationInSeconds();
    sessionStatus.textContent = "Session ended.";
    updateTimerDisplay();
    updateButtonStates();
}

hoursInput.addEventListener("input", refreshDurationPreview);
minutesInput.addEventListener("input", refreshDurationPreview);

updateTimerDisplay();
updateButtonStates();

startBtn.addEventListener("click", startFocusSession);
pauseBtn.addEventListener("click", pauseFocusSession);
resumeBtn.addEventListener("click", resumeFocusSession);
endBtn.addEventListener("click", endFocusSession);