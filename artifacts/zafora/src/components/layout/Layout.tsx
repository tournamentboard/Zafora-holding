import { ReactNode } from "react";
import { Link } from "wouter";
import Navbar from "./Navbar";
import logo from "@/assets/logo.png";
import { Mail, MapPin, ArrowUpRight, Linkedin, Twitter } from "lucide-react";

const NAV_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Project Pipeline" },
  { href: "/government", label: "Government Review" },
  { href: "/submit", label: "Submit a Request" },
];

const SERVICE_LINKS = [
  "Government Advisory",
  "Project Finance",
  "PPP Structuring",
  "Capital Raising",
  "ESG Compliance",
  "Procurement",
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "inherit" }}>
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Full-width footer */}
      <footer className="bg-[#10231f] text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 md:px-8">

          {/* Top grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-14 border-b border-white/10">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <img
                src={logo}
                alt="Zafora Holding"
                className="h-14 w-auto object-contain mb-5"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <p className="text-white/55 text-sm leading-relaxed mb-6">
                U.S.-based strategic infrastructure, investment, and consulting company bridging global opportunities across Africa, the Americas, the Caribbean, and emerging markets worldwide.
              </p>
              <div className="flex flex-col gap-2.5 text-sm text-white/55">
                <a href="mailto:Office@zaforaholding.com" className="flex items-center gap-2 hover:text-[#c59b4a] transition-colors">
                  <Mail className="h-4 w-4 shrink-0" /> Office@zaforaholding.com
                </a>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" /> Tampa, FL, USA · Global Markets
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Navigation</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 hover:text-[#c59b4a] transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Services</h4>
              <ul className="space-y-3">
                {SERVICE_LINKS.map(s => (
                  <li key={s}>
                    <Link
                      href="/services"
                      className="text-sm text-white/65 hover:text-[#c59b4a] transition-colors font-medium"
                    >
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engage CTA */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">Engage</h4>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  Ready to advance your infrastructure project? Our advisory team is available for confidential consultations.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c59b4a] text-[#10231f] font-bold text-sm hover:bg-[#b5893a] transition-all"
                >
                  Start a Conversation <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Sectors</h4>
                <div className="flex flex-wrap gap-2">
                  {["Energy", "Water", "Transport", "Healthcare", "Digital"].map(s => (
                    <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/15 text-white/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/35">
              © {new Date().getFullYear()} Zafora Holding. All rights reserved. Tampa, FL, USA.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/35">
              <span>Government Consulting · Project Development · Global Partnerships</span>
              <Link href="/admin" className="hover:text-white/60 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
