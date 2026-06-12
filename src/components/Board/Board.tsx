"use client";
import {
  Grid,
  Container,
  Typography,
  Tooltip,
  IconButton,
  useTheme,
  Stack,
  Box,
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
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useTasks } from "@/hooks/useTasks";
import { useboardStore } from "@/store/boardStore";
import { moveTaskApi, reorderTaskApi } from "@/lib/api";
import BoardSearch from "./BoardSearch";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Board() {
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { mode, toggleTheme } = useThemeMode();

  const { data: serverTasks = [], isLoading, isError } = useTasks();
  const { tasks, setTasks, moveTask, reorderTask, getFilteredTasks } =
    useboardStore();
  // const { user } = useUser();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const currentTasks = useboardStore.getState().tasks;

    const sameTasks =
      JSON.stringify(currentTasks) === JSON.stringify(serverTasks);

    if (!sameTasks) {
      setTasks(serverTasks);
    }
  }, [serverTasks, isLoaded]);
  const filteredTasks = getFilteredTasks();
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === "done").length;
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < new Date(),
  ).length;
  const completionPct =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

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
        <CircularProgress size={24} thickness={3} sx={{ color: "#378ADD" }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontSize: "0.8rem" }}
        >
          Loading your board…
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "0.8125rem",
            borderRadius: "8px",
            border: "0.5px solid",
            borderColor: isDark ? "#30363d" : "#e1e4e8",
            background: isDark ? "#161b22" : "#fff",
            color: isDark ? "#c9d1d9" : "#24292f",
            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,0.4)"
              : "0 4px 12px rgba(0,0,0,0.08)",
          },
        }}
      />

      {/* ── Page background ───────────────────────────────────────────── */}
      <Box
        sx={{
          minHeight: "100vh",
          background: isDark
            ? "linear-gradient(160deg, #0d1117 0%, #0d1117 70%, #0f1923 100%)"
            : "linear-gradient(160deg, #f0f2f5 0%, #e8edf2 100%)",
          px: { xs: 1.5, sm: 3 },
          py: { xs: 2, sm: 4 },
        }}
      >
        <Container maxWidth="lg" disableGutters>
          {/* ── Header card ───────────────────────────────────────────── */}
          <Box
            sx={{
              bgcolor: isDark ? "#161b22" : "#ffffff",
              border: "0.5px solid",
              borderColor: isDark ? "#21262d" : "#d0d7de",
              borderRadius: "12px",
              px: { xs: 2, sm: 3 },
              py: 2,
              mb: 2,
            }}
          >
            {/* Row 1 — title left, controls right */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              gap={1.5}
              sx={{ mb: 2 }}
            >
              {/* LEFT */}
              <Stack direction="column" gap={0.25}>
                <Typography
                  sx={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "text.primary",
                    lineHeight: 1.3,
                  }}
                >
                  Sprint Board
                </Typography>
                {/* Greeting */}

                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", fontSize: "0.7rem" }}
                >
                  Good{" "}
                  {new Date().getHours() < 12
                    ? "morning"
                    : new Date().getHours() < 17
                      ? "afternoon"
                      : "evening"}
                  {isLoaded && user?.firstName ? `, ${user.firstName}` : ""}
                </Typography>
              </Stack>

              {/* RIGHT */}
              <Stack direction="row" alignItems="center" gap={1.25}>
                {/* Overdue pill — only when > 0 */}
                {overdueTasks > 0 && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap={0.5}
                    sx={{
                      px: "8px",
                      py: "3px",
                      borderRadius: "20px",
                      background: isDark ? "#1f0d0d" : "#FCEBEB",
                      border: "0.5px solid",
                      borderColor: isDark ? "#500000" : "#f5c6c6",
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 12, color: "#A32D2D" }} />
                    <Typography
                      sx={{
                        fontSize: "0.7rem",
                        color: "#A32D2D",
                        fontWeight: 500,
                      }}
                    >
                      {overdueTasks} overdue
                    </Typography>
                  </Stack>
                )}

                <Box sx={{ width: "1px", height: 14, bgcolor: "divider" }} />

                {/* User name + avatar */}
                <Stack direction="row" alignItems="center" gap={0.75}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                  >
                    {user?.firstName}
                  </Typography>
                  <UserButton />
                </Stack>

                <Box sx={{ width: "1px", height: 14, bgcolor: "divider" }} />

                {/* Theme toggle */}
                <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
                  <IconButton
                    onClick={toggleTheme}
                    size="small"
                    sx={{
                      width: 28,
                      height: 28,
                      border: "0.5px solid",
                      borderColor: "divider",
                      borderRadius: "6px",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    {mode === "dark" ? (
                      <LightModeIcon sx={{ fontSize: 15 }} />
                    ) : (
                      <DarkModeIcon sx={{ fontSize: 15 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Row 2 — stat pills + progress bar */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              gap={1.5}
            >
              {/* Stat pills */}
              <Stack direction="row" gap={1} flexWrap="wrap">
                {/* Total */}
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    px: "10px",
                    py: "4px",
                    borderRadius: "20px",
                    bgcolor: isDark ? "#21262d" : "#f0f2f5",
                    color: "text.secondary",
                    border: "0.5px solid",
                    borderColor: "divider",
                  }}
                >
                  {totalTasks} tasks
                </Box>

                {/* Done */}
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    px: "10px",
                    py: "4px",
                    borderRadius: "20px",
                    bgcolor: isDark ? "#0d1f07" : "#EAF3DE",
                    color: isDark ? "#97C459" : "#27500A",
                    border: "0.5px solid",
                    borderColor: isDark ? "#173404" : "#c0dd97",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ fontSize: 11 }} />
                  {doneTasks} done
                </Box>

                {/* In progress */}
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    px: "10px",
                    py: "4px",
                    borderRadius: "20px",
                    bgcolor: isDark ? "#241908" : "#FAEEDA",
                    color: isDark ? "#FAC775" : "#633806",
                    border: "0.5px solid",
                    borderColor: isDark ? "#3a2505" : "#FAC775",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <RadioButtonUncheckedIcon sx={{ fontSize: 11 }} />
                  {tasks.filter((t) => t.columnId === "inprogress").length} in
                  progress
                </Box>
              </Stack>

              {/* Progress bar */}
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                sx={{ minWidth: 160 }}
              >
                <Box
                  sx={{
                    flex: 1,
                    height: 5,
                    borderRadius: "10px",
                    bgcolor: isDark ? "#21262d" : "#e1e4e8",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${completionPct}%`,
                      borderRadius: "10px",
                      background:
                        completionPct === 100
                          ? "linear-gradient(90deg, #639922, #97C459)"
                          : "linear-gradient(90deg, #378ADD, #85B7EB)",
                      transition: "width 0.4s ease",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "text.disabled",
                    flexShrink: 0,
                  }}
                >
                  {completionPct}%
                </Typography>
              </Stack>
            </Stack>
          </Box>

          {/* ── Search + filter row ─────────────────────────────────── */}
          <Box sx={{ mb: 2 }}>
            <BoardSearch />
          </Box>

          {/* ── Columns ─────────────────────────────────────────────── */}
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Column title="To do" columnId="todo" tasks={filteredTasks} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Column
                title="In progress"
                columnId="inprogress"
                tasks={filteredTasks}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
              <Column title="Done" columnId="done" tasks={filteredTasks} />
            </Grid>
          </Grid>
        </Container>
      </Box>

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
