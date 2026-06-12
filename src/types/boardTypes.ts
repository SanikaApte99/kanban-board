export type ColumnType = {
  id: string;
  title: string;
};
export type TaskType = {
  id: string;
  title: string;
  columnId: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  createdAt: string;
  label?: string;
  userId?: string;
};
export type Priority = "low" | "medium" | "high";

export type ColumnId = "todo" | "inprogress" | "done";
