# Running the KanbanBoard Unit Tests

This guide walks you through everything you need to run the unit tests for `KanbanBoard.jsx`.

---

## Prerequisites

Make sure you have the following installed before you begin:

- **Node.js** (v16 or higher) — [Download here](https://nodejs.org)
- **npm** (comes bundled with Node.js)

To check if you have them, run these commands in your terminal:

```bash
node -v
npm -v
```

Both should print a version number. If they don't, install Node.js from the link above.

---

## Step 1 — Set Up Your Project

If you don't already have a React project set up, the quickest way is with Create React App:

```bash
npx create-react-app my-app
cd my-app
```

If you already have an existing project, just `cd` into it:

```bash
cd your-project-folder
```

---

## Step 2 — Add the Files

Place both files into the `src/` folder of your project:

```
your-project/
└── src/
    ├── KanbanBoard.jsx
    └── KanbanBoard.test.jsx
```

---

## Step 3 — Install the Testing Dependencies

Run the following command from your project's root folder to install the required testing libraries:

```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

> **What these do:**
> - `@testing-library/react` — renders React components in tests
> - `@testing-library/user-event` — simulates real user interactions (typing, clicking, etc.)
> - `@testing-library/jest-dom` — adds helpful matchers like `toBeInTheDocument()`

---

## Step 4 — Run the Tests

From your project's root folder, run:

```bash
npm test
```

Jest will start in **watch mode** and run the tests automatically. You should see output like this:

```
 PASS  src/KanbanBoard.test.jsx
  KanbanBoard
    initial render
      ✓ renders the board title
      ✓ renders all four column headers
      ✓ renders the initial 6 tasks
      ✓ renders a known initial task card
    modal
      ✓ is hidden on initial render
      ✓ opens when '+ New Task' header button is clicked
      ...

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

To run the tests **once** without watch mode (useful for CI or scripts), use:

```bash
npm test -- --watchAll=false
```

---

## What the Tests Cover

| Group | What's being tested |
|---|---|
| **Initial render** | Title, column headers, task count, and a known card |
| **Modal** | Opens, closes, and pre-selects the right column |
| **Adding tasks** | Validates input, adds cards, closes modal on success |
| **Deleting tasks** | Removes the card and updates the count |
| **Column card counts** | Count badges and the "empty" placeholder |

---

## Troubleshooting

**Tests fail with "Cannot find module './KanbanBoard'"**
Make sure `KanbanBoard.jsx` and `KanbanBoard.test.jsx` are in the **same folder**.

**"toBeInTheDocument is not a function"**
Add this import to the top of `KanbanBoard.test.jsx`:
```js
import "@testing-library/jest-dom";
```
Or add it globally in `src/setupTests.js` (Create React App does this automatically).

**"userEvent is not a function" or similar**
Make sure you installed the dependencies in Step 3, and that `@testing-library/user-event` is version **14 or higher**:
```bash
npm list @testing-library/user-event
```

**Unexpected token / JSX syntax error**
Ensure your project supports JSX (Create React App does by default). If you're using a custom setup, confirm Babel is configured to handle `.jsx` files.
