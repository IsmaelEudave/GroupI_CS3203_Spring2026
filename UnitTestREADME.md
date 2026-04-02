# Running the KanbanBoard Unit Tests

Follow each step in order.

---

## Step 1 — Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Click the big **"LTS"** download button (LTS = recommended, stable version)
3. Open the downloaded file and follow the installer — just keep clicking **Next/Continue** until it finishes
4. Once it's done, if you already have a terminal window open, close it and reopen it before continuing

---

## Step 2 — Open the Terminal

**On Mac:**
1. Press **Command (⌘) + Space** to open Spotlight Search
2. Type `Terminal` and press **Enter**

**On Windows:**
1. Press the **Windows key**
2. Type `cmd` and press **Enter**

A black or white window will open. You'll just be copying and pasting the commands below into it.

---

## Step 3 — Create the Project

Copy and paste this command into the terminal, then press **Enter**. This sets up a fresh project with everything pre-installed.

```
npx create-react-app my-app
```

When it finishes, paste this command and press **Enter**. This moves you inside the project folder that was just created.

```
cd my-app
```

---

## Step 4 — Add the Test Files

This is the step where you place the two files into the right folder on your computer.

1. Open your **file explorer** (called **Finder** on Mac, **File Explorer** on Windows)
2. Navigate to your home folder and look for a new folder called **`my-app`** — this was created in Step 3
3. Open `my-app`, then open the folder inside it called **`src`**
4. Copy **`KanbanBoard.jsx`** and **`KanbanBoard.test.jsx`** into this `src` folder

When done, the `src` folder should contain (among other files already there):
- `KanbanBoard.jsx`
- `KanbanBoard.test.jsx`

---

## Step 5 — Run the Tests

Go back to your terminal window and paste this command, then press **Enter**:

```
npm test
```

After a few seconds you should see results like this, showing all tests passed:

```
Tests: 15 passed, 15 total
```

> **To stop the tests** at any time, press **Ctrl + C** in the terminal.

---

## Something Went Wrong?

**"npx is not recognized" or "npm is not found"**
Node.js didn't install correctly. Go back to Step 1, re-run the installer, restart your computer, and try again.

**The terminal says "my-app already exists"**
The folder was already created from a previous attempt. Run this instead to delete it and start fresh:

- Mac: `rm -rf my-app && npx create-react-app my-app`
- Windows: `rmdir /s /q my-app && npx create-react-app my-app`

**Tests fail or show red errors**
Double-check that both files are inside the `src` folder (not inside any other folder within `src`, just directly inside it).
npm list @testing-library/user-event
```

**Unexpected token / JSX syntax error**
Ensure your project supports JSX (Create React App does by default). If you're using a custom setup, confirm Babel is configured to handle `.jsx` files.
