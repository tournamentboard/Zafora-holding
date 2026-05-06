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
          <div className="flex flex-col gap-3">
            <img src={logo} alt="Zafora Holding" className="h-10 w-auto object-contain" />
            <p className="text-xs text-[#8a958f]">© {new Date().getFullYear()} Zafora Holding. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { href: "/about", label: "About Us" },
              { href: "/services", label: "Services" },
              { href: "/projects", label: "Pipeline" },
              { href: "/government", label: "Government Review" },
              { href: "/submit", label: "Contact" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-[#65736f] hover:text-[#173f35] transition-colors font-medium">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#8a958f] text-center md:text-right max-w-xs">
            Government consulting, project development, funding advisory, and global partnerships.
          </p>
        </div>
      </footer>
    </div>
  );
}
