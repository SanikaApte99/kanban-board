import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import { Priority, TaskType } from "@/types/boardTypes";
import toast from "react-hot-toast";

export const TASKS_KEY = ["tasks"];

export const useTasks = () => {
  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: fetchTasks,
  });
};

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success("Task added");
    },
    onError: () => toast.error("Failed to add task"),
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<TaskType> }) =>
      updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.success("Task updated");
    },
    onError: () => toast.error("Failed to update task"),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
      toast.error("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });
};
