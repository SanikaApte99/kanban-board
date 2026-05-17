"use client";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
} from "@mui/material";
import { createContext, useContext, useState, useMemo, useEffect } from "react";

type ColorMode = "light" | "dark";

type ThemeContextType = {
  mode: ColorMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("kanban-theme") as ColorMode | null;
    if (saved) setMode(saved);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("kanban-theme", next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" && {
            background: {
              default: "#f0f2f5",
              paper: "#ffffff",
            },
          }),
          ...(mode === "dark" && {
            background: {
              default: "#0d1117",
              paper: "#161b22",
            },
          }),
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
