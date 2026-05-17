"use client";
import ThemeProvider from "./ThemeProvider";
import StoreHydration from "@/components/StoreHydration/StoreHydration";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StoreHydration>{children}</StoreHydration>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
