import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Pipeline" },
    { href: "/government", label: "Government Review" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e5ded3] bg-[rgba(247,244,239,0.86)] backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-[#173f35] to-[#c59b4a] flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-tight">ZH</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#10231f]">
            Zafora Holding
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#173f35] ${
                  location === link.href ? "text-[#173f35]" : "text-[#65736f]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Button asChild className="rounded-full bg-[#173f35] hover:bg-[#173f35]/90 text-white font-semibold px-6">
            <Link href="/submit">Request Consultation</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-[#10231f]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-[#e5ded3] p-4 flex flex-col gap-4 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg font-medium p-2 rounded-md ${
                location === link.href ? "text-[#173f35] bg-[#f7f4ef]" : "text-[#65736f] hover:text-[#173f35]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="w-full mt-2 font-semibold rounded-full bg-[#173f35] hover:bg-[#173f35]/90 text-white">
            <Link href="/submit" onClick={() => setIsMobileMenuOpen(false)}>Request Consultation</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
