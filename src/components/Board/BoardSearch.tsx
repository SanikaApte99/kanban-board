"use client";
import { Box, Stack, InputBase, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useboardStore } from "@/store/boardStore";

const COLUMNS = [
  { id: "all", label: "All" },
  { id: "todo", label: "To do" },
  { id: "inprogress", label: "In progress" },
  { id: "done", label: "Done" },
] as const;

const columnAccent: Record<string, { active: string; activeBg: string }> = {
  all: { active: "#378ADD", activeBg: "#E6F1FB" },
  todo: { active: "#185FA5", activeBg: "#E6F1FB" },
  inprogress: { active: "#854F0B", activeBg: "#FAEEDA" },
  done: { active: "#27500A", activeBg: "#EAF3DE" },
};

const columnAccentDark: Record<string, { active: string; activeBg: string }> = {
  all: { active: "#85B7EB", activeBg: "#0c1e30" },
  todo: { active: "#85B7EB", activeBg: "#0c1e30" },
  inprogress: { active: "#FAC775", activeBg: "#241908" },
  done: { active: "#97C459", activeBg: "#0d1f07" },
};

export default function BoardSearch() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    searchQuery,
    activeColumn,
    setSearchQuery,
    setActiveColumn,
    clearSearch,
  } = useboardStore();

  const hasFilter = searchQuery !== "" || activeColumn !== "all";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "stretch", sm: "center" }}
      gap={1.5}
    >
      {/* Search input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.25,
          height: 32,
          borderRadius: "7px",
          border: "0.5px solid",
          borderColor: searchQuery ? (isDark ? "#444" : "#B4B2A9") : "divider",
          bgcolor: isDark ? "#161b22" : "#fff",
          transition: "border-color 0.15s",
          minWidth: 200,
          "&:focus-within": {
            borderColor: isDark ? "#85B7EB" : "#378ADD",
          },
        }}
      >
        <SearchIcon
          sx={{ fontSize: 15, color: "text.disabled", flexShrink: 0 }}
        />
        <InputBase
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks…"
          inputProps={{ "aria-label": "search tasks" }}
          sx={{
            flex: 1,
            fontSize: "0.8125rem",
            "& input": {
              p: 0,
              color: "text.primary",
              "&::placeholder": { color: "text.disabled", opacity: 1 },
            },
          }}
        />
        {searchQuery && (
          <CloseIcon
            onClick={() => setSearchQuery("")}
            sx={{
              fontSize: 14,
              color: "text.disabled",
              cursor: "pointer",
              flexShrink: 0,
              "&:hover": { color: "text.secondary" },
            }}
          />
        )}
      </Box>

      {/* Column filter chips */}
      <Stack direction="row" gap={0.625} flexWrap="wrap">
        {COLUMNS.map((col) => {
          const isActive = activeColumn === col.id;
          const accent = isDark
            ? columnAccentDark[col.id]
            : columnAccent[col.id];

          return (
            <Box
              key={col.id}
              onClick={() => setActiveColumn(col.id)}
              sx={{
                fontSize: "0.75rem",
                fontWeight: isActive ? 500 : 400,
                px: "10px",
                py: "4px",
                borderRadius: "20px",
                border: "0.5px solid",
                borderColor: isActive ? accent.active : "divider",
                bgcolor: isActive ? accent.activeBg : "transparent",
                color: isActive ? accent.active : "text.secondary",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: accent.active,
                  color: accent.active,
                },
              }}
            >
              {col.label}
            </Box>
          );
        })}

        {/* Clear all — only shown when something is active */}
        {hasFilter && (
          <Box
            onClick={clearSearch}
            sx={{
              fontSize: "0.75rem",
              px: "10px",
              py: "4px",
              borderRadius: "20px",
              border: "0.5px dashed",
              borderColor: "divider",
              color: "text.disabled",
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.15s",
              "&:hover": {
                color: "text.secondary",
                borderColor: "text.disabled",
              },
            }}
          >
            Clear
          </Box>
        )}
      </Stack>
    </Stack>
  );
}
