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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Priority, TaskType } from "@/types/boardTypes";
import { useAddTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
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
    },
  });

  const priority = watch("priority");

  const onSubmit = (data: FormValues) => {
    if (props.mode === "add") {
      addTask(
        {
          columnId: props.columnId,
          title: data.title,
          priority: data.priority as Priority,
          description: data.description,
          dueDate: data.dueDate,
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

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          {dots.map((d) => (
            <Box
              key={d.value}
              onClick={() => setValue("priority", d.value)}
              sx={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: d.color,
                cursor: "pointer",
                outline: priority === d.value ? `2px solid ${d.color}` : "none",
                outlineOffset: 2,
              }}
            />
          ))}
        </Stack>

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
