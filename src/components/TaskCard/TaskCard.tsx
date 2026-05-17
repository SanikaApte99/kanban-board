"use client";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TaskType, Priority } from "@/types/boardTypes";
import EditIcon from "@mui/icons-material/Edit";
import TaskModal from "../TaskDetailModal/TaskModal";

type Props = {
  id: string;
  title: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  createdAt: string;
  columnId: string;
};

const priorityConfig: Record<
  Priority,
  { label: string; color: "success" | "warning" | "error" }
> = {
  low: { label: "Low", color: "success" },
  medium: { label: "Medium", color: "warning" },
  high: { label: "High", color: "error" },
};

const dotColor: Record<Priority, string> = {
  high: "#E24B4A",
  medium: "#EF9F27",
  low: "#639922",
};

export default function TaskCard({
  id,
  title,
  priority,
  description,
  dueDate,
  createdAt,
  columnId,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const task: TaskType = {
    id,
    title,
    priority,
    description,
    dueDate,
    createdAt,
    columnId,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          my: 1,
          cursor: isDragging ? "grabbing" : "grab",
          position: "relative",
        }}
      >
        <CardContent
          {...listeners}
          {...attributes}
          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
        >
          <IconButton
            size="small"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setModalOpen(true)}
            sx={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 24,
              height: 24,
              backgroundColor: "action.hover",
              "&:hover": { backgroundColor: "action.selected" },
            }}
          >
            <EditIcon sx={{ fontSize: 13 }} />
          </IconButton>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              userSelect: "none",
              pr: 3,
              mb: description ? 0.5 : 1,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                userSelect: "none",
                mb: 1,
              }}
            >
              {description}
            </Typography>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Chip
              label={priorityConfig[priority].label}
              color={priorityConfig[priority].color}
              size="small"
              sx={{ fontSize: "0.65rem", height: 20 }}
            />
            {dueDate && (
              <Typography
                variant="caption"
                sx={{ color: isOverdue ? "error.main" : "text.disabled" }}
              >
                {new Date(dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      {modalOpen && (
        <TaskModal
          mode="edit"
          task={task}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
