import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col text-[#10231f]">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-[#e5ded3] bg-white py-12 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#173f35] to-[#c59b4a] flex items-center justify-center">
              <span className="text-white font-bold text-lg tracking-tight">ZH</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#10231f]">
              Zafora Holding
            </span>
          </div>
          <p className="text-sm font-medium text-[#65736f]">
            Bridging vision and execution for African infrastructure.
          </p>
          <p className="text-sm text-[#8a958f]">
            © {new Date().getFullYear()} Zafora Holding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
