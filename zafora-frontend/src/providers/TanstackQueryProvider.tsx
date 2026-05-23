"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import ScrollToTop from "../components/ScrollToTop";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { Toaster } from "@/src/components/ui/toaster";

const queryClient = new QueryClient();

function TanstackQueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default TanstackQueryProvider;
