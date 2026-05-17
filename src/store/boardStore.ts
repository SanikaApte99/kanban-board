import { TaskType } from "@/types/boardTypes";
import { create } from "zustand";

type BoardStore = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  reorderTask: (columnId: string, oldIndex: number, newIndex: number) => void;
};

export const useboardStore = create<BoardStore>((set) => ({
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
}));
