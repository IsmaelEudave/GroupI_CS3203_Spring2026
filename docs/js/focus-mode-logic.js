function getDurationInSeconds(hours, minutes) {
    const safeHours = Number(hours) || 0;
    const safeMinutes = Number(minutes) || 0;
    return (safeHours * 3600) + (safeMinutes * 60);
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createInitialState(hours = 0, minutes = 25) {
    const durationSeconds = getDurationInSeconds(hours, minutes);

    return {
        remainingSeconds: durationSeconds,
        isSessionActive: false,
        isPaused: false
    };
}

function startSession(state, hours, minutes) {
    const durationSeconds = getDurationInSeconds(hours, minutes);

    if (durationSeconds <= 0) {
        return {
            ...state,
            error: "Please enter a duration greater than 0."
        };
    }

    return {
        remainingSeconds: durationSeconds,
        isSessionActive: true,
        isPaused: false,
        error: null
    };
}

function pauseSession(state) {
    if (!state.isSessionActive || state.isPaused) {
        return state;
    }

    return {
        ...state,
        isPaused: true
    };
}

function resumeSession(state) {
    if (!state.isSessionActive || !state.isPaused) {
        return state;
    }

    return {
        ...state,
        isPaused: false
    };
}

function endSession(state, hours, minutes) {
    return {
        remainingSeconds: getDurationInSeconds(hours, minutes),
        isSessionActive: false,
        isPaused: false,
        error: null
    };
}

function tick(state) {
    if (!state.isSessionActive || state.isPaused) {
        return state;
    }

    if (state.remainingSeconds <= 1) {
        return {
            ...state,
            remainingSeconds: 0,
            isSessionActive: false,
            isPaused: false
        };
    }

    return {
        ...state,
        remainingSeconds: state.remainingSeconds - 1
    };
}

module.exports = {
    getDurationInSeconds,
    formatTime,
    createInitialState,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    tick
};