"use client";
import {
  Modal,
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Divider,
  Button,
  InputBase,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Priority, TaskType } from "@/types/boardTypes";
import { useAddTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useState } from "react";

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 520 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
  maxHeight: "90vh",
  overflowY: "auto",
};

const dots: { value: Priority; color: string }[] = [
  { value: "high", color: "#E24B4A" },
  { value: "medium", color: "#EF9F27" },
  { value: "low", color: "#639922" },
];

// Preset label options with colors
const PRESET_LABELS: { text: string; bg: string; color: string }[] = [
  { text: "Story", bg: "#E6F1FB", color: "#185FA5" },
  { text: "Bug", bg: "#FCEBEB", color: "#A32D2D" },
  { text: "Task", bg: "#E1F5EE", color: "#0F6E56" },
  { text: "Epic", bg: "#EEEDFE", color: "#534AB7" },
  { text: "Spike", bg: "#FEF3E2", color: "#7A4A0A" },
];

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .max(100, "Title must be under 100 characters"),
  description: yup
    .string()
    .max(500, "Description must be under 500 characters")
    .required("Description is required")
    .default(""),
  dueDate: yup.string().optional().default(""),
  priority: yup.mixed<Priority>().oneOf(["low", "medium", "high"]).required(),
  label: yup.string().optional().default(""),
});

type FormValues = yup.InferType<typeof schema>;

type AddMode = { mode: "add"; columnId: string };
type EditMode = { mode: "edit"; task: TaskType };
type Props = (AddMode | EditMode) & {
  open: boolean;
  onClose: () => void;
};

export default function TaskModal(props: Props) {
  const { open, onClose } = props;

  const { mutate: addTask, isPending: isAdding } = useAddTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const initial = props.mode === "edit" ? props.task : null;

  // Custom label input visibility
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLabelInput, setCustomLabelInput] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      dueDate: initial?.dueDate ?? "",
      priority: initial?.priority ?? "medium",
      label: initial?.label ?? "",
    },
  });

  const priority = watch("priority");
  const selectedLabel = watch("label");

  const handleSelectLabel = (text: string) => {
    // Toggle off if already selected
    setValue("label", selectedLabel === text ? "" : text);
  };

  const handleAddCustomLabel = () => {
    const trimmed = customLabelInput.trim();
    if (!trimmed) return;
    setValue("label", trimmed);
    setCustomLabelInput("");
    setShowCustomInput(false);
  };

  const onSubmit = (data: FormValues) => {
    if (props.mode === "add") {
      addTask(
        {
          columnId: props.columnId,
          title: data.title,
          priority: data.priority as Priority,
          description: data.description,
          dueDate: data.dueDate,
          label: data.label,
        },
        { onSuccess: onClose },
      );
    } else {
      updateTask(
        {
          id: props.task.id,
          updates: {
            title: data.title,
            description: data.description,
            priority: data.priority as Priority,
            dueDate: data.dueDate,
            label: data.label,
          },
        },
        { onSuccess: onClose },
      );
    }
  };

  const handleDelete = () => {
    if (props.mode === "edit") {
      deleteTask(props.task.id, { onSuccess: onClose });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            {props.mode === "add" ? "Add Task" : "Edit Task"}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Task title"
              fullWidth
              size="small"
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              fullWidth
              multiline
              minRows={3}
              size="small"
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
            />
          )}
        />

        {/* Due Date */}
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Due Date
          </Typography>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
            )}
          />
        </Stack>

        {/* Priority */}
        <Stack spacing={0.75} sx={{ mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary">
            Priority
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {dots.map((d) => (
              <Stack
                key={d.value}
                direction="row"
                alignItems="center"
                gap={0.75}
                onClick={() => setValue("priority", d.value)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: d.color,
                    outline:
                      priority === d.value ? `2px solid ${d.color}` : "none",
                    outlineOffset: 2,
                    transition: "outline 0.1s",
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: priority === d.value ? d.color : "text.secondary",
                    fontWeight: priority === d.value ? 500 : 400,
                    textTransform: "capitalize",
                    transition: "color 0.1s",
                  }}
                >
                  {d.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>

        {/* Label */}
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="caption" color="text.secondary">
              Label
            </Typography>
            {selectedLabel && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  cursor: "pointer",
                  "&:hover": { color: "text.secondary" },
                }}
                onClick={() => setValue("label", "")}
              >
                Clear
              </Typography>
            )}
          </Stack>

          {/* Preset chips */}
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {PRESET_LABELS.map((l) => {
              const isSelected = selectedLabel === l.text;
              return (
                <Box
                  key={l.text}
                  onClick={() => handleSelectLabel(l.text)}
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    px: "10px",
                    py: "4px",
                    borderRadius: "20px",
                    border: "0.5px solid",
                    borderColor: isSelected ? l.color : "divider",
                    bgcolor: isSelected ? l.bg : "transparent",
                    color: isSelected ? l.color : "text.secondary",
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: l.color, color: l.color },
                  }}
                >
                  {l.text}
                </Box>
              );
            })}

            {/* + Custom button */}
            <Box
              onClick={() => setShowCustomInput((v) => !v)}
              sx={{
                fontSize: "0.7rem",
                px: "10px",
                py: "4px",
                borderRadius: "20px",
                border: "0.5px dashed",
                borderColor: showCustomInput ? "text.secondary" : "divider",
                color: "text.disabled",
                cursor: "pointer",
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "text.secondary",
                  color: "text.secondary",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 11 }} />
              Custom
            </Box>
          </Stack>

          {/* Show selected custom label if it's not a preset */}
          {selectedLabel &&
            !PRESET_LABELS.find((l) => l.text === selectedLabel) && (
              <Stack
                direction="row"
                alignItems="center"
                gap={0.75}
                sx={{ mt: 0.25 }}
              >
                <Typography variant="caption" color="text.secondary">
                  Selected:
                </Typography>
                <Box
                  sx={{
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    px: "10px",
                    py: "3px",
                    borderRadius: "20px",
                    bgcolor: "#F1EFF8",
                    color: "#4A3D8A",
                    border: "0.5px solid #4A3D8A",
                  }}
                >
                  {selectedLabel}
                </Box>
              </Stack>
            )}

          {/* Custom label input */}
          {showCustomInput && (
            <Stack direction="row" alignItems="center" gap={1} sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  px: 1.25,
                  height: 32,
                  borderRadius: "7px",
                  border: "0.5px solid",
                  borderColor: "divider",
                  "&:focus-within": { borderColor: "primary.main" },
                  transition: "border-color 0.15s",
                }}
              >
                <InputBase
                  value={customLabelInput}
                  onChange={(e) => setCustomLabelInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomLabel();
                    }
                  }}
                  placeholder="e.g. QA, Analytics…"
                  sx={{ flex: 1, fontSize: "0.8125rem" }}
                  autoFocus
                />
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={handleAddCustomLabel}
                disabled={!customLabelInput.trim()}
                sx={{ height: 32, fontSize: "0.75rem", textTransform: "none" }}
              >
                Add
              </Button>
            </Stack>
          )}
        </Stack>

        {/* Footer actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {props.mode === "edit" ? (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          ) : (
            <Box />
          )}

          <Stack direction="row" spacing={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isAdding || isUpdating}
            >
              {isAdding || isUpdating
                ? "Saving..."
                : props.mode === "add"
                  ? "Add Task"
                  : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
