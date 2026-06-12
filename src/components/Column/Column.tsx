"use client";
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import TaskCard from "../TaskCard/TaskCard";
import AddTask from "../AddTask/AddTask";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskType } from "@/types/boardTypes";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

type Props = {
  title: string;
  columnId: string;
  tasks: TaskType[];
};

const columnTheme: Record<
  string,
  {
    headerBg: string;
    headerBgDark: string;
    titleColor: string;
    titleColorDark: string;
    countBg: string;
    countBgDark: string;
    countColor: string;
    countColorDark: string;
    dotsColor: string;
  }
> = {
  todo: {
    headerBg: "#E6F1FB",
    headerBgDark: "#0c1e30",
    titleColor: "#0C447C",
    titleColorDark: "#85B7EB",
    countBg: "#B5D4F4",
    countBgDark: "#12325a",
    countColor: "#0C447C",
    countColorDark: "#85B7EB",
    dotsColor: "#185FA5",
  },
  inprogress: {
    headerBg: "#FAEEDA",
    headerBgDark: "#241908",
    titleColor: "#633806",
    titleColorDark: "#FAC775",
    countBg: "#FAC775",
    countBgDark: "#3a2505",
    countColor: "#633806",
    countColorDark: "#FAC775",
    dotsColor: "#854F0B",
  },
  done: {
    headerBg: "#EAF3DE",
    headerBgDark: "#0d1f07",
    titleColor: "#27500A",
    titleColorDark: "#97C459",
    countBg: "#C0DD97",
    countBgDark: "#162e06",
    countColor: "#27500A",
    countColorDark: "#97C459",
    dotsColor: "#3B6D11",
  },
};

export default function Column({ title, columnId, tasks }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const columnTasks = tasks.filter((task) => task.columnId === columnId);
  const col = columnTheme[columnId] ?? columnTheme.todo;

  const { setNodeRef } = useDroppable({ id: columnId });
  const taskIds = columnTasks.map((t) => t.id);

  return (
    <Card
      ref={setNodeRef}
      sx={{
        minHeight: { xs: 150, sm: 300 },
        backgroundColor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
        boxShadow: "none",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {/* Color-block header */}
      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: isDark ? col.headerBgDark : col.headerBg,
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.875}>
          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: isDark ? col.titleColorDark : col.titleColor,
              userSelect: "none",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              px: "7px",
              py: "1px",
              borderRadius: "20px",
              background: isDark ? col.countBgDark : col.countBg,
              color: isDark ? col.countColorDark : col.countColor,
              lineHeight: 1.6,
            }}
          >
            {columnTasks.length}
          </Box>
        </Stack>
        <MoreHorizIcon
          sx={{
            fontSize: 18,
            color: isDark ? col.titleColorDark : col.dotsColor,
            cursor: "pointer",
            opacity: 0.7,
            "&:hover": { opacity: 1 },
          }}
        />
      </Box>

      <CardContent sx={{ px: 1.25, pt: 1.25, pb: "12px !important" }}>
        {columnTasks.length === 0 && (
          <Typography
            variant="body2"
            color="text.disabled"
            sx={{ textAlign: "center", py: 4, fontSize: "0.75rem" }}
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
              label={task.label}
            />
          ))}
        </SortableContext>

        {/* Add task row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mt: 1,
            px: 1,
            py: 0.875,
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.15s",
            "&:hover": {
              background: "action.hover",
              bgcolor: "action.hover",
            },
          }}
        >
          <AddTask columnId={columnId} />
        </Box>
      </CardContent>
    </Card>
  );
}
