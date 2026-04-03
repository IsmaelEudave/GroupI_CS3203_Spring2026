# Focus Mode Timer – Unit Test Instructions

## Developer
Ava Batson-Perez

## Feature
Focus Mode Timer

---

## Repository
https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026

## Branch
feature/Ava-FocusMode

---

## IMPORTANT
After cloning the repository, you MUST switch to the correct branch:

git checkout feature/Ava-FocusMode

---

## Setup Instructions

1. Clone the repository:
git clone https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026.git

2. Navigate into the project folder:
cd GroupI_CS3203_Spring2026

3. Switch to the feature branch:
git checkout feature/Ava-FocusMode

4. Install dependencies:
npm install

---

## Running Unit Tests

Run the following command:

npm test

This command is configured to run only the Focus Mode unit tests.

---

## Unit Test File

tests/focus-mode.test.js

---

## Tested Module

docs/js/focus-mode-logic.js

---

## Expected Output

The test suite should execute and display:

PASS tests/focus-mode.test.js

All tests should pass successfully.

---

## Test Coverage

The unit tests verify:
- Duration conversion (hours and minutes to seconds)
- Timer formatting
- Initial state creation
- Valid session start behavior
- Invalid zero-duration handling
- Pause functionality
- Resume functionality
- Timer countdown behavior
- Session completion at zero
- Session reset/end behavior

---

## Notes for Reviewer

- Ensure Node.js is installed before running the tests
- No additional setup beyond npm install is required
- The logic is separated from the UI to allow independent testing

---

## Feature Summary

The Focus Mode Timer allows users to:
- Set a custom session duration
- Start, pause, resume, and end a session
- Track remaining time through a countdown

This unit test suite validates the core logic of the feature independent of the user interface.