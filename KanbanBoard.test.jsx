import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KanbanBoard from "./KanbanBoard";

// ─── Helper: open modal and fill in the task form ───────────────────────────
const addTask = async (user, { title, priority = "medium", colId = "todo" }) => {
  const newTaskBtn = screen.getByRole("button", { name: /\+ New Task/i });
  await user.click(newTaskBtn);

  const titleInput = screen.getByPlaceholderText(/What needs to be done\?/i);
  await user.clear(titleInput);
  await user.type(titleInput, title);

  if (priority !== "medium") {
    const prioritySelect = screen.getByRole("combobox", {
      name: /priority/i,
    });
    await user.selectOptions(prioritySelect, priority);
  }

  if (colId !== "todo") {
    const colSelect = screen.getByRole("combobox", { name: /column/i });
    await user.selectOptions(colSelect, colId);
  }

  const createBtn = screen.getByRole("button", { name: /Create Task/i });
  await user.click(createBtn);
};

// ─── Test Suite ──────────────────────────────────────────────────────────────
describe("KanbanBoard – Task Management", () => {

  // ── ✅ CORRECT: Adds and removes task completely ──────────────────────────
  describe("Correct Behavior", () => {
    it("adds a new task and displays it on the board", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Write unit tests", priority: "high" });

      // Task title must appear on the board after creation
      expect(screen.getByText("Write unit tests")).toBeInTheDocument();
    });

    it("removes a task completely when the delete button is clicked", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Task to Delete", priority: "low" });
      expect(screen.getByText("Task to Delete")).toBeInTheDocument();

      // Find the card containing our task and click its delete (×) button
      const card = screen.getByText("Task to Delete").closest(".kb-card");
      const deleteBtn = within(card).getByRole("button", { name: /×/ });
      await user.click(deleteBtn);

      // Task must be completely absent from the DOM after deletion
      expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument();
    });
  });

  // ── ❌ INCORRECT: Title not saved correctly / deletion targets wrong card ──
  describe("Incorrect Behavior Detection", () => {
    it("does NOT add a task when the title is empty (whitespace-only)", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      const initialCount = document.querySelectorAll(".kb-card").length;

      const newTaskBtn = screen.getByRole("button", { name: /\+ New Task/i });
      await user.click(newTaskBtn);

      // Leave title blank and try to submit
      const createBtn = screen.getByRole("button", { name: /Create Task/i });
      await user.click(createBtn);

      // Card count must stay the same — blank titles are rejected
      expect(document.querySelectorAll(".kb-card").length).toBe(initialCount);
    });

    it("stores the exact title entered, not a trimmed or altered version", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "  Exact Title Test  " });

      // The component calls .trim() internally — verify the trimmed value appears
      expect(screen.getByText("Exact Title Test")).toBeInTheDocument();
      // And that the raw untrimmed version is NOT shown (would indicate no trim)
      expect(screen.queryByText("  Exact Title Test  ")).not.toBeInTheDocument();
    });

    it("deletes only the targeted task, leaving all other tasks intact", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Task Alpha" });
      await addTask(user, { title: "Task Beta" });

      const alphaCard = screen.getByText("Task Alpha").closest(".kb-card");
      const deleteAlpha = within(alphaCard).getByRole("button", { name: /×/ });
      await user.click(deleteAlpha);

      expect(screen.queryByText("Task Alpha")).not.toBeInTheDocument();
      // Task Beta must still be present — wrong-target deletion would remove it
      expect(screen.getByText("Task Beta")).toBeInTheDocument();
    });
  });

  // ── 📏 BOUNDARY CONDITION: Tasks must have different priorities ────────────
  describe("Boundary Conditions – Distinct Priorities", () => {
    it("renders all three distinct priority badges (high, medium, low)", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "High Prio Task",   priority: "high"   });
      await addTask(user, { title: "Medium Prio Task", priority: "medium" });
      await addTask(user, { title: "Low Prio Task",    priority: "low"    });

      // Each unique priority badge must be present at least once
      const highBadges   = document.querySelectorAll(".kb-priority-high");
      const mediumBadges = document.querySelectorAll(".kb-priority-medium");
      const lowBadges    = document.querySelectorAll(".kb-priority-low");

      expect(highBadges.length).toBeGreaterThan(0);
      expect(mediumBadges.length).toBeGreaterThan(0);
      expect(lowBadges.length).toBeGreaterThan(0);
    });

    it("two tasks with different priorities are treated as distinct cards", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Same Name Task", priority: "high"   });
      await addTask(user, { title: "Same Name Task", priority: "low"    });

      // Both cards must be present; they differ only in priority
      const allMatches = screen.getAllByText("Same Name Task");
      expect(allMatches.length).toBe(2);

      // Verify they carry different priority badges
      const cards = allMatches.map((el) => el.closest(".kb-card"));
      const priorities = cards.map((card) => {
        if (within(card).queryByText("high"))   return "high";
        if (within(card).queryByText("medium")) return "medium";
        if (within(card).queryByText("low"))    return "low";
      });
      expect(new Set(priorities).size).toBe(2); // two different priorities
    });
  });

  // ── 🔲 EDGE CASES: Highest & lowest priority tasks ────────────────────────
  describe("Edge Cases – Extreme Priorities", () => {
    it("correctly renders a task with the highest priority (high)", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Critical Blocker", priority: "high" });

      const card = screen.getByText("Critical Blocker").closest(".kb-card");
      // The high-priority badge must be present inside the card
      expect(card.querySelector(".kb-priority-high")).toBeInTheDocument();
      // And neither medium nor low badge should appear on this card
      expect(card.querySelector(".kb-priority-medium")).not.toBeInTheDocument();
      expect(card.querySelector(".kb-priority-low")).not.toBeInTheDocument();
    });

    it("correctly renders a task with the lowest priority (low)", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Nice to Have", priority: "low" });

      const card = screen.getByText("Nice to Have").closest(".kb-card");
      expect(card.querySelector(".kb-priority-low")).toBeInTheDocument();
      expect(card.querySelector(".kb-priority-high")).not.toBeInTheDocument();
      expect(card.querySelector(".kb-priority-medium")).not.toBeInTheDocument();
    });

    it("both a highest-priority and a lowest-priority task coexist on the board", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);

      await addTask(user, { title: "Top Priority",    priority: "high" });
      await addTask(user, { title: "Bottom Priority", priority: "low"  });

      const topCard    = screen.getByText("Top Priority").closest(".kb-card");
      const bottomCard = screen.getByText("Bottom Priority").closest(".kb-card");

      expect(topCard.querySelector(".kb-priority-high")).toBeInTheDocument();
      expect(bottomCard.querySelector(".kb-priority-low")).toBeInTheDocument();

      // Deleting the highest-priority task must not affect the lowest-priority one
      const deleteTop = within(topCard).getByRole("button", { name: /×/ });
      await user.click(deleteTop);

      expect(screen.queryByText("Top Priority")).not.toBeInTheDocument();
      expect(screen.getByText("Bottom Priority")).toBeInTheDocument();
    });
  });
});
