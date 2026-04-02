const {
    getDurationInSeconds,
    formatTime,
    createInitialState,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    tick
} = require("../docs/js/focus-mode-logic");

test("getDurationInSeconds converts hours and minutes correctly", () => {
    expect(getDurationInSeconds(1, 30)).toBe(5400);
});

test("formatTime formats minutes and seconds correctly", () => {
    expect(formatTime(1500)).toBe("25:00");
});

test("formatTime formats hours, minutes, and seconds correctly", () => {
    expect(formatTime(5400)).toBe("01:30:00");
});

test("createInitialState creates inactive default state", () => {
    const state = createInitialState(0, 25);

    expect(state.remainingSeconds).toBe(1500);
    expect(state.isSessionActive).toBe(false);
    expect(state.isPaused).toBe(false);
});

test("startSession starts a valid session", () => {
    const state = createInitialState();
    const newState = startSession(state, 0, 25);

    expect(newState.remainingSeconds).toBe(1500);
    expect(newState.isSessionActive).toBe(true);
    expect(newState.isPaused).toBe(false);
    expect(newState.error).toBeNull();
});

test("startSession rejects zero duration", () => {
    const state = createInitialState();
    const newState = startSession(state, 0, 0);

    expect(newState.error).toBe("Please enter a duration greater than 0.");
});

test("pauseSession pauses an active session", () => {
    const state = startSession(createInitialState(), 0, 25);
    const pausedState = pauseSession(state);

    expect(pausedState.isPaused).toBe(true);
});

test("resumeSession resumes a paused session", () => {
    const state = pauseSession(startSession(createInitialState(), 0, 25));
    const resumedState = resumeSession(state);

    expect(resumedState.isPaused).toBe(false);
});

test("tick decrements remaining time when session is active", () => {
    const state = startSession(createInitialState(), 0, 25);
    const nextState = tick(state);

    expect(nextState.remainingSeconds).toBe(1499);
});

test("tick does not change time when session is paused", () => {
    const state = pauseSession(startSession(createInitialState(), 0, 25));
    const nextState = tick(state);

    expect(nextState.remainingSeconds).toBe(1500);
});

test("tick completes session at zero", () => {
    const state = {
        remainingSeconds: 1,
        isSessionActive: true,
        isPaused: false
    };

    const nextState = tick(state);

    expect(nextState.remainingSeconds).toBe(0);
    expect(nextState.isSessionActive).toBe(false);
    expect(nextState.isPaused).toBe(false);
});

test("endSession resets session and makes it inactive", () => {
    const state = startSession(createInitialState(), 1, 0);
    const endedState = endSession(state, 0, 25);

    expect(endedState.remainingSeconds).toBe(1500);
    expect(endedState.isSessionActive).toBe(false);
    expect(endedState.isPaused).toBe(false);
});