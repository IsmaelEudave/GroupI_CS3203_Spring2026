# Running the KanbanBoard Unit Tests

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

Copy and paste this command into the terminal, then press **Enter**. This sets up a fresh project with everything pre-installed. It may take 1–2 minutes.

```
npx create-react-app my-app
```

When it finishes, paste this command and press **Enter**. This moves you inside the project folder that was just created.

```
cd my-app
```

---

## Step 4 — Update a Testing Library

Create React App comes with an older version of one testing tool that needs to be updated. Paste this command and press **Enter**:

```
npm install --save-dev @testing-library/user-event@latest
```

This only takes a few seconds.

---

## Step 5 — Download the Files
 
Download both of these files from the repository (on the left of your screen by default). Your browser will save them to your **Downloads** folder by default.
 
- `KanbanBoard.jsx`
- `KanbanBoard.test.jsx`

---

## Step 6 — Add the Test Files

First, open the `src` folder on your computer using the terminal. Paste the command for your system and press **Enter**:

**Mac:**
```
open src
```

**Windows:**
```
explorer src
```

This will pop open the `src` folder directly in your file explorer. Now drag and drop (or copy and paste) **`KanbanBoard.jsx`** and **`KanbanBoard.test.jsx`** into that window.

When done, the `src` folder should contain (among other files already there):
- `KanbanBoard.jsx`
- `KanbanBoard.test.jsx`

---

## Step 7 — Run the Tests

Go back to your terminal window and paste this command, then press **Enter**:

```
npm test
```

After a few seconds you should see results like this, showing all tests passed:

```
Tests: 17 passed, 17 total
```

> **To stop the tests** at any time, press **Ctrl + C** in the terminal.

---

## Something Went Wrong?

**"npx is not recognized" or "npm is not found"**
Node.js didn't install correctly. Go back to Step 1, re-run the installer, then close and reopen the terminal and try again.

**The terminal says "my-app already exists"**
The folder was already created from a previous attempt. Run this instead to delete it and start fresh:

- Mac: `rm -rf my-app && npx create-react-app my-app`
- Windows: `rmdir /s /q my-app && npx create-react-app my-app`

**Tests fail or show red errors**
Double-check that both files are inside the `src` folder (not inside any other folder within `src`, just directly inside it).
