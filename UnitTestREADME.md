# Running the KanbanBoard Unit Tests

**Branch:** `feature/Ismael-KanBanBoard`  
**Repo:** https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026

---

## Prerequisites

Make sure you have the following installed before you begin:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

To check, run:
```bash
node -v
npm -v
```

---

## Step 1 — Clone the Branch

```bash
git clone -b feature/Ismael-KanBanBoard https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026.git
cd GroupI_CS3203_Spring2026
```

---

## Step 2 — Install Dependencies

```bash
npm install
npm install --save-dev @testing-library/react @testing-library/user-event jest babel-jest @babel/core @babel/preset-env @babel/preset-react
```

---

## Step 3 — Configure Babel

Jest needs Babel to understand JSX. Create a `babel.config.json` file in the project root:

```bash
echo '{"presets": ["@babel/preset-env", "@babel/preset-react"]}' > babel.config.json
```

---

## Step 4 — Run the Tests

```bash
npx jest KanbanBoard.test.jsx
```

---

## What to Expect

A passing run looks like this:

```
PASS KanbanBoard.test.jsx
  KanbanBoard – Task Management
    Correct Behavior
      ✓ adds a new task and displays it on the board
      ✓ removes a task completely when the delete button is clicked
    Incorrect Behavior Detection
      ✓ does NOT add a task when the title is empty (whitespace-only)
      ✓ stores the exact title entered, not a trimmed or altered version
      ✓ deletes only the targeted task, leaving all other tasks intact
    Boundary Conditions – Distinct Priorities
      ✓ renders all three distinct priority badges (high, medium, low)
      ✓ two tasks with different priorities are treated as distinct cards
    Edge Cases – Extreme Priorities
      ✓ correctly renders a task with the highest priority (high)
      ✓ correctly renders a task with the lowest priority (low)
      ✓ both a highest-priority and a lowest-priority task coexist on the board

Tests: 10 passed, 10 total
```

---

## What Each Test Covers

| Category | What is tested |
|---|---|
| ✅ **Correct** | Task is fully added and fully removed from the board |
| ❌ **Incorrect** | Empty titles are rejected; exact title is saved; only the right task is deleted |
| 📏 **Boundary** | All three priority levels exist as distinct badges; same-name tasks with different priorities are independent |
| 🔲 **Edge Case** | Highest (`high`) and lowest (`low`) priority tasks render correct badges and coexist without interfering |

---

## Troubleshooting

**`jest: command not found`**  
Use `npx jest` instead of `jest` directly.

**`Cannot find module './KanbanBoard'`**  
Make sure `KanbanBoard.test.jsx` and `KanbanBoard.jsx` are in the same folder.

**Tests fail with React errors**  
Ensure `@testing-library/react` was installed in Step 2 and `babel.config.json` was created in Step 3.
