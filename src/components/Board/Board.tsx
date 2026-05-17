"use client";
import {
  Grid,
  Container,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import Column from "../Column/Column";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState, useEffect } from "react";
import TaskCard from "../TaskCard/TaskCard";
import toast, { Toaster } from "react-hot-toast";
import { useThemeMode } from "../ThemeProvider/ThemeProvider";
import { TaskType } from "@/types/boardTypes";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningIcon from "@mui/icons-material/Warning";
import { useTasks } from "@/hooks/useTasks";
import { useboardStore } from "@/store/boardStore";
import { moveTaskApi, reorderTaskApi } from "@/lib/api";

export default function Board() {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  const { data: serverTasks = [], isLoading, isError } = useTasks();
  const { tasks, setTasks, moveTask, reorderTask } = useboardStore();

  useEffect(() => {
    if (serverTasks.length > 0) {
      setTasks(serverTasks);
    }
  }, [serverTasks, setTasks]);

  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: any) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overTask = tasks.find((t) => t.id === over.id);
    const targetColumnId = overTask ? overTask.columnId : over.id;

    if (draggedTask.columnId === targetColumnId) {
      const columnTasks = tasks.filter((t) => t.columnId === targetColumnId);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      if (oldIndex !== newIndex && newIndex !== -1) {
        reorderTask(targetColumnId, oldIndex, newIndex);
        reorderTaskApi(active.id, targetColumnId, newIndex).catch((err) => {
          console.error("Reorder failed:", err);
          toast.error("Failed to save order");
        });
      }
    } else {
      moveTask(active.id, targetColumnId);

      moveTaskApi(active.id, targetColumnId).catch((err) => {
        console.error("Move failed:", err);
        toast.error("Failed to save move");
      });
    }
  };
  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading board...
        </Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "100vh", p: 3 }}
      >
        <Alert severity="error">
          Failed to load tasks. Please refresh the page.
        </Alert>
      </Stack>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Toaster position="top-right" />
      <Container
        maxWidth="lg"
        sx={{
          marginTop: { xs: 2, sm: 4 },
          padding: { xs: 1.5, sm: 3 },
          backgroundColor:
            theme.palette.mode === "dark" ? "#0d1117" : "#f0f2f5",
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <DashboardIcon sx={{ color: "#378ADD" }} />
            <Typography variant="h5" fontWeight={500}>
              Kanban Board
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Chip
              icon={<AssignmentIcon />}
              label={`${totalTasks} tasks`}
              size="small"
              variant="outlined"
            />
            {overdueTasks > 0 && (
              <Chip
                icon={<WarningIcon />}
                label={`${overdueTasks} overdue`}
                size="small"
                color="error"
                variant="outlined"
              />
            )}
            <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
              <IconButton onClick={toggleTheme}>
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Column title="Todo" columnId="todo" tasks={tasks} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Column title="In Progress" columnId="inprogress" tasks={tasks} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 4 }}>
            <Column title="Done" columnId="done" tasks={tasks} />
          </Grid>
        </Grid>
      </Container>

      <DragOverlay>
        {activeTask ? (
          <TaskCard
            id={activeTask.id}
            title={activeTask.title}
            priority={activeTask.priority}
            description={activeTask.description}
            dueDate={activeTask.dueDate}
            createdAt={activeTask.createdAt}
            columnId={activeTask.columnId}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
