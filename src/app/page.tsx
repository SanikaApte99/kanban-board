import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Board from "@/components/Board/Board";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <Board />;
}
