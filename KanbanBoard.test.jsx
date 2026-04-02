import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KanbanBoard from "./KanbanBoard";

// ─── Helpers ────────────────────────────────────────────────────────────────
const openModalViaHeader = () =>
  fireEvent.click(screen.getByRole("button", { name: /\+ new task/i }));

// ─── Tests ──────────────────────────────────────────────────────────────────
describe("KanbanBoard", () => {
  // ── Rendering ──────────────────────────────────────────────────────────
  describe("initial render", () => {
    it("renders the board title", () => {
      render(<KanbanBoard />);
      expect(screen.getByText(/TaskLU Board/i)).toBeInTheDocument();
    });

    it("renders all four column headers", () => {
      render(<KanbanBoard />);
      expect(screen.getByText("To Do")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Review")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("renders the initial 6 tasks", () => {
      render(<KanbanBoard />);
      expect(screen.getByText(/6 tasks/i)).toBeInTheDocument();
    });

    it("renders a known initial task card", () => {
      render(<KanbanBoard />);
      expect(screen.getByText("Set up project repo")).toBeInTheDocument();
    });
  });

  // ── Modal ───────────────────────────────────────────────────────────────
  describe("modal", () => {
    it("is hidden on initial render", () => {
      render(<KanbanBoard />);
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });

    it("opens when '+ New Task' header button is clicked", () => {
      render(<KanbanBoard />);
      openModalViaHeader();
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });

    it("closes when Cancel is clicked", () => {
      render(<KanbanBoard />);
      openModalViaHeader();
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });

    it("closes when the overlay backdrop is clicked", () => {
      render(<KanbanBoard />);
      openModalViaHeader();
      const overlay = document.querySelector(".kb-overlay");
      fireEvent.click(overlay);
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });

    it("opens pre-set to the column whose '+ add task' button was clicked", () => {
      render(<KanbanBoard />);
      // Click the "In Progress" column's quick-add button (second one)
      const addButtons = screen.getAllByRole("button", { name: /\+ add task/i });
      fireEvent.click(addButtons[1]); // index 1 = In Progress
      // The Column select is the first <select> in the modal
      const selects = screen.getAllByRole("combobox");
      expect(selects[0].value).toBe("inprogress");
    });
  });

  // ── Adding tasks ────────────────────────────────────────────────────────
  describe("adding a task", () => {
    it("does not add a task when the title is empty", () => {
      render(<KanbanBoard />);
      openModalViaHeader();
      fireEvent.click(screen.getByRole("button", { name: /create task/i }));
      // Modal should remain open (submission blocked)
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });

    it("adds a new task and increments the task count", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);
      openModalViaHeader();
      await user.type(
        screen.getByPlaceholderText(/what needs to be done/i),
        "Write unit tests"
      );
      fireEvent.click(screen.getByRole("button", { name: /create task/i }));

      expect(screen.getByText("Write unit tests")).toBeInTheDocument();
      expect(screen.getByText(/7 tasks/i)).toBeInTheDocument();
    });

    it("closes the modal after a successful submission", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);
      openModalViaHeader();
      await user.type(
        screen.getByPlaceholderText(/what needs to be done/i),
        "Another task"
      );
      fireEvent.click(screen.getByRole("button", { name: /create task/i }));
      expect(screen.queryByText("New Task")).not.toBeInTheDocument();
    });

    it("submits the form when Enter is pressed in the title field", async () => {
      const user = userEvent.setup();
      render(<KanbanBoard />);
      openModalViaHeader();
      const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
      await user.type(titleInput, "Enter key task");
      await user.keyboard("{Enter}");
      expect(screen.getByText("Enter key task")).toBeInTheDocument();
    });
  });

  // ── Deleting tasks ──────────────────────────────────────────────────────
  describe("deleting a task", () => {
    it("removes the task from the board", () => {
      render(<KanbanBoard />);
      const taskTitle = "Set up project repo";
      const card = screen.getByText(taskTitle).closest(".kb-card");
      const deleteBtn = within(card).getByTitle("Delete task");
      fireEvent.click(deleteBtn);
      expect(screen.queryByText(taskTitle)).not.toBeInTheDocument();
    });

    it("decrements the task count after deletion", () => {
      render(<KanbanBoard />);
      const card = screen.getByText("Set up project repo").closest(".kb-card");
      fireEvent.click(within(card).getByTitle("Delete task"));
      expect(screen.getByText(/5 tasks/i)).toBeInTheDocument();
    });
  });

  // ── Column card counts ──────────────────────────────────────────────────
  describe("column card counts", () => {
    it("shows the correct count for the 'Done' column (2 initial tasks)", () => {
      render(<KanbanBoard />);
      const doneHeader = screen.getByText("Done").closest(".kb-col-header");
      const count = within(doneHeader).getByText("2");
      expect(count).toBeInTheDocument();
    });

    it("shows 'empty' placeholder when a column has no tasks", () => {
      render(<KanbanBoard />);
      // The 'Review' column starts empty
      expect(screen.getByText("Review")).toBeInTheDocument();
      const reviewCol = screen.getByText("Review").closest(".kb-col");
      expect(within(reviewCol).getByText("empty")).toBeInTheDocument();
    });
  });
});
