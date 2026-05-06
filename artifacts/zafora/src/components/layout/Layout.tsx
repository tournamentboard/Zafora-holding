import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-border bg-secondary/50 py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-serif font-bold text-white">
            ZAFORA<span className="text-primary">.</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zafora Holding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
