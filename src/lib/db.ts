import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaNeon(pool as any);

let prismaInstance: any;

function getPrisma() {
  if (!prismaInstance) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}

export const prisma = getPrisma();
