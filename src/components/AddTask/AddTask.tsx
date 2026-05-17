"use client";

import { Stack, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TaskModal from "../TaskDetailModal/TaskModal";

type Props = {
  columnId: string;
};

export default function AddTask({ columnId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mt: 1, cursor: "pointer" }}
        onClick={() => setOpen(true)}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            border: "1.5px dashed",
            borderColor: "text.disabled",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            "&:hover": {
              borderColor: "text.primary",
              backgroundColor: "action.hover",
            },
            transition: "all 0.15s ease",
          }}
        >
          <AddIcon fontSize="small" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Add a task
        </Typography>
      </Stack>

      <TaskModal
        key={open ? "open" : "closed"}
        mode="add"
        columnId={columnId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
