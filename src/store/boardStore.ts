import { TaskType } from "@/types/boardTypes";
import { create } from "zustand";

type BoardStore = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  reorderTask: (columnId: string, oldIndex: number, newIndex: number) => void;

  // Search & filter
  searchQuery: string;
  activeColumn: "all" | "todo" | "inprogress" | "done";
  setSearchQuery: (query: string) => void;
  setActiveColumn: (columnId: "all" | "todo" | "inprogress" | "done") => void;
  clearSearch: () => void;
  getFilteredTasks: () => TaskType[];
};

export const useboardStore = create<BoardStore>((set, get) => ({
  tasks: [],

  setTasks: (tasks) => set({ tasks }),

  moveTask: (taskId, newColumnId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task,
      ),
    })),

  reorderTask: (columnId, oldIndex, newIndex) =>
    set((state) => {
      const columnTasks = state.tasks.filter((t) => t.columnId === columnId);
      const otherTasks = state.tasks.filter((t) => t.columnId !== columnId);
      const reordered = [...columnTasks];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);
      return { tasks: [...otherTasks, ...reordered] };
    }),


  searchQuery: "",
  activeColumn: "all",

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveColumn: (columnId) => set({ activeColumn: columnId }),

  clearSearch: () => set({ searchQuery: "", activeColumn: "all" }),

  getFilteredTasks: () => {
    const { tasks, searchQuery, activeColumn } = get();
    const q = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesColumn =
        activeColumn === "all" || task.columnId === activeColumn;

      const matchesQuery =
        q === "" ||
        task.title.toLowerCase().includes(q) ||
        (task.description ?? "").toLowerCase().includes(q);

      return matchesColumn && matchesQuery;
    });
  },
}));
