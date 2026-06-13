// import { PrismaNeon } from "@prisma/adapter-neon";
// import { neonConfig, Pool } from "@neondatabase/serverless";
// import ws from "ws";

// neonConfig.webSocketConstructor = ws;

// const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
// const adapter = new PrismaNeon(pool as any);

// let prismaInstance: any;

// function getPrisma() {
//   if (!prismaInstance) {
//     // eslint-disable-next-line @typescript-eslint/no-require-imports
//     const { PrismaClient } = require("@prisma/client");
//     prismaInstance = new PrismaClient({ adapter });
//   }
//   return prismaInstance;
// }

// export const prisma = getPrisma();
import { neonConfig, neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

if (process.env.NEXT_RUNTIME === "nodejs") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  neonConfig.webSocketConstructor = require("ws");
}

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const { Pool } = require("@neondatabase/serverless");
  const { PrismaClient } = require("@prisma/client");
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: any };
export const prisma = globalForPrisma.prisma ?? getPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;