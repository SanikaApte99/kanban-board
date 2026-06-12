import { TaskType, Priority } from "@/types/boardTypes";

const BASE = "/api/tasks";

export const fetchTasks = async (): Promise<TaskType[]> => {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  const data = await res.json();
  return data.tasks;
};

export const createTask = async (payload: {
  title: string;
  columnId: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  label?: string;
}): Promise<TaskType> => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create task");
  const data = await res.json();
  return data.task;
};

export const updateTask = async (
  id: string,
  updates: Partial<TaskType>,
): Promise<TaskType> => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  const data = await res.json();
  return data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};
export const moveTaskApi = async (
  id: string,
  columnId: string,
): Promise<void> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId }),
  });
  if (!res.ok) throw new Error("Failed to move task");
};

export const reorderTaskApi = async (
  id: string,
  columnId: string,
  newIndex: number,
): Promise<void> => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ columnId, newIndex }),
  });
  if (!res.ok) throw new Error("Failed to reorder task");
};
