import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTaskApi,
  reorderTaskApi,
} from "@/lib/api";
import { TaskType } from "@/types/boardTypes";

global.fetch = jest.fn();

const mockFetch = (data: unknown, ok = true) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok,
    json: async () => data,
  });
};

const sampleTask: TaskType = {
  id: "1",
  title: "Task 1",
  columnId: "todo",
  priority: "medium",
  createdAt: "2024-01-01",
};

describe("api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchTasks", () => {
    it("returns tasks array on success", async () => {
      mockFetch({ tasks: [sampleTask] });
      const tasks = await fetchTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Task 1");
    });

    it("calls correct endpoint", async () => {
      mockFetch({ tasks: [] });
      await fetchTasks();
      expect(global.fetch).toHaveBeenCalledWith("/api/tasks");
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(fetchTasks()).rejects.toThrow("Failed to fetch tasks");
    });
  });

  describe("createTask", () => {
    it("returns created task on success", async () => {
      mockFetch({ task: sampleTask });
      const result = await createTask({
        title: "Task 1",
        columnId: "todo",
        priority: "medium",
      });
      expect(result.title).toBe("Task 1");
      expect(result.columnId).toBe("todo");
    });

    it("calls POST /api/tasks with correct body", async () => {
      mockFetch({ task: sampleTask });
      await createTask({
        title: "Task 1",
        columnId: "todo",
        priority: "medium",
      });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "Task 1",
            columnId: "todo",
            priority: "medium",
          }),
        }),
      );
    });

    it("includes optional fields when provided", async () => {
      mockFetch({ task: sampleTask });
      await createTask({
        title: "Task 1",
        columnId: "todo",
        priority: "medium",
        description: "Some description",
        dueDate: "2025-12-01",
      });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks",
        expect.objectContaining({
          body: JSON.stringify({
            title: "Task 1",
            columnId: "todo",
            priority: "medium",
            description: "Some description",
            dueDate: "2025-12-01",
          }),
        }),
      );
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(
        createTask({ title: "Task 1", columnId: "todo", priority: "low" }),
      ).rejects.toThrow("Failed to create task");
    });
  });

  describe("updateTask", () => {
    it("returns updated task on success", async () => {
      const updated = { ...sampleTask, title: "Updated" };
      mockFetch({ task: updated });
      const result = await updateTask("1", { title: "Updated" });
      expect(result.title).toBe("Updated");
    });

    it("calls PUT /api/tasks/:id with correct body", async () => {
      mockFetch({ task: sampleTask });
      await updateTask("1", { title: "Updated" });
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/1",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "Updated" }),
        }),
      );
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(updateTask("1", { title: "x" })).rejects.toThrow(
        "Failed to update task",
      );
    });
  });

  describe("deleteTask", () => {
    it("resolves successfully on ok response", async () => {
      mockFetch({ success: true });
      await expect(deleteTask("1")).resolves.not.toThrow();
    });

    it("calls DELETE /api/tasks/:id", async () => {
      mockFetch({ success: true });
      await deleteTask("1");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(deleteTask("1")).rejects.toThrow("Failed to delete task");
    });
  });

  describe("moveTaskApi", () => {
    it("resolves successfully on ok response", async () => {
      mockFetch({ success: true });
      await expect(moveTaskApi("1", "done")).resolves.not.toThrow();
    });

    it("calls PUT /api/tasks/:id with columnId", async () => {
      mockFetch({ success: true });
      await moveTaskApi("1", "done");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ columnId: "done" }),
        }),
      );
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(moveTaskApi("1", "done")).rejects.toThrow(
        "Failed to move task",
      );
    });
  });

  describe("reorderTaskApi", () => {
    it("resolves successfully on ok response", async () => {
      mockFetch({ success: true });
      await expect(reorderTaskApi("1", "todo", 2)).resolves.not.toThrow();
    });

    it("calls PUT /api/tasks/:id with columnId and newIndex", async () => {
      mockFetch({ success: true });
      await reorderTaskApi("1", "todo", 2);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/tasks/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ columnId: "todo", newIndex: 2 }),
        }),
      );
    });

    it("throws error when response is not ok", async () => {
      mockFetch({}, false);
      await expect(reorderTaskApi("1", "todo", 2)).rejects.toThrow(
        "Failed to reorder task",
      );
    });
  });
});
