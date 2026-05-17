import { useboardStore } from "@/store/boardStore";
import { TaskType } from "@/types/boardTypes";

const sampleTasks: TaskType[] = [
  {
    id: "1",
    title: "Task 1",
    columnId: "todo",
    priority: "medium",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    title: "Task 2",
    columnId: "todo",
    priority: "high",
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    title: "Task 3",
    columnId: "inprogress",
    priority: "low",
    createdAt: "2024-01-01",
  },
];

const resetStore = () => {
  useboardStore.setState({ tasks: [...sampleTasks] });
};

describe("useboardStore", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("setTasks", () => {
    it("sets tasks correctly", () => {
      const newTasks: TaskType[] = [
        {
          id: "99",
          title: "New",
          columnId: "done",
          priority: "low",
          createdAt: "",
        },
      ];
      useboardStore.getState().setTasks(newTasks);
      expect(useboardStore.getState().tasks).toHaveLength(1);
      expect(useboardStore.getState().tasks[0].id).toBe("99");
    });

    it("replaces existing tasks completely", () => {
      useboardStore.getState().setTasks([]);
      expect(useboardStore.getState().tasks).toHaveLength(0);
    });
  });

  describe("moveTask", () => {
    it("moves task to a different column", () => {
      useboardStore.getState().moveTask("1", "done");
      const task = useboardStore.getState().tasks.find((t) => t.id === "1");
      expect(task?.columnId).toBe("done");
    });

    it("does not affect other tasks", () => {
      useboardStore.getState().moveTask("1", "done");
      const task2 = useboardStore.getState().tasks.find((t) => t.id === "2");
      expect(task2?.columnId).toBe("todo");
    });

    it("preserves all task fields when moving", () => {
      useboardStore.getState().moveTask("1", "done");
      const task = useboardStore.getState().tasks.find((t) => t.id === "1");
      expect(task?.title).toBe("Task 1");
      expect(task?.priority).toBe("medium");
    });

    it("total task count stays the same after move", () => {
      useboardStore.getState().moveTask("1", "done");
      expect(useboardStore.getState().tasks).toHaveLength(3);
    });
  });

  describe("reorderTask", () => {
    beforeEach(() => {
      useboardStore.setState({
        tasks: [
          {
            id: "1",
            title: "First",
            columnId: "todo",
            priority: "low",
            createdAt: "",
          },
          {
            id: "2",
            title: "Second",
            columnId: "todo",
            priority: "medium",
            createdAt: "",
          },
          {
            id: "3",
            title: "Third",
            columnId: "todo",
            priority: "high",
            createdAt: "",
          },
          {
            id: "4",
            title: "Done 1",
            columnId: "done",
            priority: "low",
            createdAt: "",
          },
        ],
      });
    });

    it("moves task forward in the list", () => {
      useboardStore.getState().reorderTask("todo", 0, 2);
      const tasks = useboardStore
        .getState()
        .tasks.filter((t) => t.columnId === "todo");
      expect(tasks[0].title).toBe("Second");
      expect(tasks[1].title).toBe("Third");
      expect(tasks[2].title).toBe("First");
    });

    it("moves task backward in the list", () => {
      useboardStore.getState().reorderTask("todo", 2, 0);
      const tasks = useboardStore
        .getState()
        .tasks.filter((t) => t.columnId === "todo");
      expect(tasks[0].title).toBe("Third");
      expect(tasks[1].title).toBe("First");
      expect(tasks[2].title).toBe("Second");
    });

    it("does not affect tasks in other columns", () => {
      useboardStore.getState().reorderTask("todo", 0, 1);
      const doneTasks = useboardStore
        .getState()
        .tasks.filter((t) => t.columnId === "done");
      expect(doneTasks[0].title).toBe("Done 1");
    });

    it("total task count stays the same after reorder", () => {
      useboardStore.getState().reorderTask("todo", 0, 2);
      expect(useboardStore.getState().tasks).toHaveLength(4);
    });

    it("swapping adjacent tasks works correctly", () => {
      useboardStore.getState().reorderTask("todo", 0, 1);
      const tasks = useboardStore
        .getState()
        .tasks.filter((t) => t.columnId === "todo");
      expect(tasks[0].title).toBe("Second");
      expect(tasks[1].title).toBe("First");
    });
  });
});
