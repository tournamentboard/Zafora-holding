import { ReactNode } from "react";
import { Link } from "wouter";
import Navbar from "./Navbar";
import logo from "@/assets/logo.png";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "inherit" }}>
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t border-[#e5ded3] bg-white py-10 mt-auto">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Zafora Holding" className="h-10 w-auto object-contain" />
          <p className="text-sm text-[#65736f] text-center">
            Government consulting, project development, funding advisory, and global partnerships.
          </p>
          <p className="text-sm text-[#8a958f]">
            © {new Date().getFullYear()} Zafora Holding. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
