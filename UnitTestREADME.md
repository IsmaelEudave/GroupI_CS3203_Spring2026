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

## Step 3 — Clone the Repo & Switch Branches

Copy and paste this command into the terminal, then press **Enter**. This will download the project to your computer.

```bash
git clone [https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026.git](https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026.git)
```

When it finishes, paste this command and press **Enter**. This moves you inside the newly downloaded project folder.

```bash
cd GroupI_CS3203_Spring2026
```

Finally, switch to the specific branch that contains the code for this review by running:

```bash
git checkout feature/Ismael-KanBanBoard
```

---

## Step 4 — Install Dependencies

Now that you are inside the correct branch, you need to install the required tools and testing libraries. Paste this command and press **Enter**:

```bash
npm install
```

This may take a minute or two. It automatically looks at the `package.json` file and downloads everything you need!

---

## Step 5 — Run the Tests

Once the installation is complete, paste this command and press **Enter**:

```bash
npm test
```

After a few seconds, you should see results like this, showing all tests passed:

```text
Tests: 17 passed, 17 total
```

> **To stop the tests** at any time, press **Ctrl + C** in the terminal.

---

## Something Went Wrong?

**"npm is not recognized" or "npm is not found"**
Node.js didn't install correctly. Go back to Step 1, re-run the installer, then close and reopen the terminal and try again.

**The terminal says "fatal: destination path 'GroupI_CS3203_Spring2026' already exists"**
You already downloaded the folder from a previous attempt. You can delete the `GroupI_CS3203_Spring2026` folder from your computer and start Step 3 again.
