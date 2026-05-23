import { motion } from "framer-motion";
import { ArrowRight, Home, Compass } from "lucide-react";
// import logo from "@/assets/logo.png";
import logo from "../assets/logo.png";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ background: "#f7f4ef" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full"
      >
        <Link href="/" className="inline-block mb-10">
          <img src={logo} alt="Zafora Holding" className="h-14 w-auto mx-auto" />
        </Link>

        <div className="bg-white border border-[#e5ded3] rounded-[36px] p-12 shadow-xl">
          <div className="w-16 h-16 bg-[#173f35] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Compass className="h-8 w-8 text-[#c59b4a]" />
          </div>

          <div className="text-7xl font-bold text-[#173f35] tracking-tight mb-3">404</div>
          <h1 className="text-2xl font-bold text-[#10231f] mb-4">Page not found</h1>
          <p className="text-[#65736f] leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved. Let us guide you back to familiar ground.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#173f35] text-white font-bold hover:bg-[#245d4e] transition-all shadow-md"
            >
              <Home className="h-4 w-4" /> Back to Home
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-[#e5ded3] text-[#173f35] font-bold hover:border-[#173f35] hover:shadow-md transition-all"
            >
              View Pipeline <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="text-xs text-[#8a958f] mt-8">
          © {new Date().getFullYear()} Zafora Holding. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
