"use client";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
  useTheme,
  Box,
} from "@mui/material";
import TaskCard from "../TaskCard/TaskCard";
import AddTask from "../AddTask/AddTask";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskType } from "@/types/boardTypes";

type Props = {
  title: string;
  columnId: string;
  tasks: TaskType[];
};

const columnColors: Record<string, string> = {
  todo: "#378ADD",
  inprogress: "#EF9F27",
  done: "#639922",
};

export default function Column({ title, columnId, tasks }: Props) {
  const theme = useTheme();
  const columnTasks = tasks.filter((task) => task.columnId === columnId);

  const { setNodeRef } = useDroppable({ id: columnId });
  const taskIds = columnTasks.map((t) => t.id);

  return (
    <Card
      ref={setNodeRef}
      sx={{
        minHeight: { xs: 150, sm: 300 },
        backgroundColor: theme.palette.mode === "dark" ? "#161b22" : "#ffffff",
        border: `0.5px solid ${theme.palette.mode === "dark" ? "#30363d" : "#d0d7de"}`,
        boxShadow: "none",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            mb: 1.5,
            pb: 1.5,
            borderBottom: `0.5px solid ${theme.palette.mode === "dark" ? "#30363d" : "#e1e4e8"}`,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: columnColors[columnId],
                flexShrink: 0,
              }}
            />
            <Typography variant="subtitle1" fontWeight={500}>
              {title}
            </Typography>
          </Stack>

          <Chip
            label={columnTasks.length}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.7rem",
              backgroundColor:
                theme.palette.mode === "dark" ? "#21262d" : "#f0f2f5",
            }}
          />
        </Stack>

        {columnTasks.length === 0 && (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ textAlign: "center", py: 4 }}
          >
            No tasks yet
          </Typography>
        )}

        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {columnTasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              priority={task.priority}
              description={task.description}
              dueDate={task.dueDate}
              createdAt={task.createdAt}
              columnId={task.columnId}
            />
          ))}
        </SortableContext>

        <AddTask columnId={columnId} />
      </CardContent>
    </Card>
  );
}
