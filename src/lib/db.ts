import fs from "fs";
import path from "path";
import { TaskType } from "@/types/boardTypes";

const DB_PATH = path.join(process.cwd(), "src/lib/data.json");

const defaultData: { tasks: TaskType[] } = {
  tasks: [
    {
      id: "1",
      title: "Task 1",
      columnId: "todo",
      priority: "medium",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Task 2",
      columnId: "inprogress",
      priority: "high",
      createdAt: new Date().toISOString(),
    },
  ],
};

export function readDb(): { tasks: TaskType[] } {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDb(defaultData);
      return defaultData;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw) as { tasks: TaskType[] };
  } catch {
    return defaultData;
  }
}

export function writeDb(data: { tasks: TaskType[] }): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write db:", e);
  }
}
