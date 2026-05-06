import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Pipeline" },
    { href: "/government", label: "Government Review" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e5ded3]" style={{ background: "rgba(247,244,239,0.92)", backdropFilter: "blur(16px)" }}>
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Zafora Holding" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#173f35] ${
                  location === link.href ? "text-[#173f35] font-semibold" : "text-[#65736f]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e] transition-all shadow-md"
          >
            Request Consultation
          </Link>
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
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#f7f4ef] border-b border-[#e5ded3] p-4 flex flex-col gap-3 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium p-3 rounded-xl ${
                location === link.href
                  ? "text-[#173f35] bg-[#efe3cf] font-semibold"
                  : "text-[#65736f] hover:text-[#173f35] hover:bg-[#efe3cf]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/submit"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-center px-5 py-3 mt-1 rounded-full bg-[#173f35] text-white text-base font-semibold"
          >
            Request Consultation
          </Link>
        </div>
      )}
    </nav>
  );
}
