"use client";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { TaskType, Priority } from "@/types/boardTypes";
import EditIcon from "@mui/icons-material/Edit";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TaskModal from "../TaskDetailModal/TaskModal";

type Props = {
  id: string;
  title: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  createdAt: string;
  columnId: string;
  label?: string;
};

// Lookup for preset label colors — custom labels fall back to neutral purple
const LABEL_STYLES: Record<string, { bg: string; color: string }> = {
  Story: { bg: "#E6F1FB", color: "#185FA5" },
  Bug: { bg: "#FCEBEB", color: "#A32D2D" },
  Task: { bg: "#E1F5EE", color: "#0F6E56" },
  Epic: { bg: "#EEEDFE", color: "#534AB7" },
  Spike: { bg: "#FEF3E2", color: "#7A4A0A" },
};

const FALLBACK_LABEL_STYLE = { bg: "#F1EFF8", color: "#4A3D8A" };

const priorityFlagColor: Record<Priority, string> = {
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
  label,
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
  const labelStyle = label
    ? (LABEL_STYLES[label] ?? FALLBACK_LABEL_STYLE)
    : null;

  const task: TaskType = {
    id,
    title,
    priority,
    description,
    dueDate,
    createdAt,
    columnId,
    label,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        sx={{
          my: 0.75,
          cursor: isDragging ? "grabbing" : "grab",
          position: "relative",
          borderRadius: "7px",
          border: "0.5px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "visible",
          transition: "border-color 0.15s",
          "&:hover": { borderColor: "text.disabled" },
          "&:hover .edit-reveal": { opacity: 1 },
        }}
      >
        {/* Priority left-edge flag */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 3,
            height: "56%",
            borderRadius: "0 2px 2px 0",
            background: priorityFlagColor[priority],
            pointerEvents: "none",
          }}
        />

        <CardContent
          {...listeners}
          {...attributes}
          sx={{ pl: 2, pr: 1.5, pt: 1.25, pb: "10px !important" }}
        >
          {/* Hover-reveal edit button */}
          <Box
            className="edit-reveal"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setModalOpen(true)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 22,
              height: 22,
              borderRadius: "5px",
              border: "0.5px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: 0,
              transition: "opacity 0.15s",
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <EditIcon sx={{ fontSize: 12, color: "text.secondary" }} />
          </Box>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: "0.8125rem",
              lineHeight: 1.4,
              userSelect: "none",
              pr: 3,
              mb: description ? 0.5 : 1,
              color: "text.primary",
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
                fontSize: "0.6875rem",
              }}
            >
              {description}
            </Typography>
          )}

          <Stack direction="row" alignItems="center" gap={0.75}>
            {/* Dynamic label — hidden if no label set */}
            {labelStyle && label && (
              <Box
                sx={{
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  px: "7px",
                  py: "2px",
                  borderRadius: "4px",
                  background: labelStyle.bg,
                  color: labelStyle.color,
                  userSelect: "none",
                  maxWidth: 80,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Box>
            )}

            {/* Due date */}
            {dueDate && (
              <Box
                sx={{
                  ml: labelStyle ? "auto" : undefined,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  px: "7px",
                  py: "2px",
                  borderRadius: "4px",
                  background: isOverdue ? "#FCEBEB" : "rgba(0,0,0,0.04)",
                  color: isOverdue ? "#A32D2D" : "text.secondary",
                  userSelect: "none",
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 10 }} />
                {new Date(dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Box>
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
