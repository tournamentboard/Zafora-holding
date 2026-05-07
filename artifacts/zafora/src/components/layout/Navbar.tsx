import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useGetSiteSettings } from "@workspace/api-client-react";
import logo from "@/assets/logo.png";

const DEFAULT_LINKS = [
  { id: "about", label: "About", href: "/about", visible: true, openNewTab: false, order: 0 },
  { id: "services", label: "Services", href: "/services", visible: true, openNewTab: false, order: 1 },
  { id: "pipeline", label: "Pipeline", href: "/projects", visible: true, openNewTab: false, order: 2 },
  { id: "gov", label: "Government Review", href: "/government", visible: true, openNewTab: false, order: 3 },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: navData } = useGetSiteSettings("navigation");

  const links = (() => {
    try {
      const parsed = navData?.value ? JSON.parse(navData.value) : null;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...parsed]
          .filter((l: any) => l.visible !== false)
          .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
      }
    } catch {}
    return DEFAULT_LINKS;
  })();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e5ded3]" style={{ background: "rgba(247,244,239,0.92)", backdropFilter: "blur(16px)" }}>
      <div className="container mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src={logo} alt="Zafora Holding" className="h-16 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {links.map((link: any) => (
              <Link
                key={link.id ?? link.href}
                href={link.href}
                target={link.openNewTab ? "_blank" : undefined}
                rel={link.openNewTab ? "noopener noreferrer" : undefined}
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
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-[#f7f4ef] border-b border-[#e5ded3] p-4 flex flex-col gap-3 shadow-lg">
          {links.map((link: any) => (
            <Link
              key={link.id ?? link.href}
              href={link.href}
              target={link.openNewTab ? "_blank" : undefined}
              rel={link.openNewTab ? "noopener noreferrer" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium p-3 rounded-xl transition-colors ${
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
