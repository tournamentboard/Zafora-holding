"use client";
import { useState, useEffect } from "react";

import { useMutation } from "@tanstack/react-query";
import { apiAxios } from "@/src/lib/api-helpers";
import { API } from "@/src/lib/url-helpers";
import { useSiteSetting } from "@/src/modules/public/home/services/home.service";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { motion } from "framer-motion";
import { usePageTitle } from "@/src/hooks/use-page-title";
import { parseSeoSettings } from "@/src/hooks/use-seo-meta";
import {
  ShieldCheck, Clock, Users, Globe, CheckCircle2, ArrowRight,
  Lock, Star, TrendingUp, Briefcase, Landmark,
} from "lucide-react";
import { useRouter } from "next/navigation";


const DEFAULT_SETTINGS = {
  hero: {
    headline: "Submit Your Request",
    subheadline: "Initiate a dialogue with Zafora Holding. Whether you are a government entity, investor, or project developer, share your details below.",
    badge: "Start a Conversation",
  },
  sidebar: {
    whyTitle: "Why submit to Zafora?",
    whyBullets: [
      "Senior advisor review within 48 hours",
      "No-obligation preliminary assessment",
      "Direct DFI and investor connections",
      "Full confidentiality guaranteed",
      "Active in 12+ African countries",
    ],
    responseTime: "48-hour response",
    responseDesc: "A senior advisor will review your submission and respond within two business days.",
  },
};

const fadeInView = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function Submit() {
  const { data: seoData } = useSiteSetting("seo_submit");
  usePageTitle("Submit a Request", parseSeoSettings(seoData));
const router = useRouter();
  const createLead = useMutation({
    mutationFn: (data: Record<string, unknown>) => apiAxios.post(API.LEADS.LIST, data),
  });
  const [loading, setLoading] = useState(false);
  const [defaultType, setDefaultType] = useState("consultation");
  const { data: settingsData } = useSiteSetting("submit_page");

  const settings = (() => {
    try {
      const parsed = settingsData?.value ? JSON.parse(settingsData.value) : null;
      if (parsed && typeof parsed === "object") {
        return {
          hero: { ...DEFAULT_SETTINGS.hero, ...(parsed.hero ?? {}) },
          sidebar: {
            ...DEFAULT_SETTINGS.sidebar,
            ...(parsed.sidebar ?? {}),
            whyBullets: Array.isArray(parsed.sidebar?.whyBullets) && parsed.sidebar.whyBullets.length > 0
              ? parsed.sidebar.whyBullets
              : DEFAULT_SETTINGS.sidebar.whyBullets,
          },
        };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  })();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "government") setDefaultType("government_advisory");
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createLead.mutateAsync({
        fullName: formData.get("fullName") as string,
        organization: formData.get("organization") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        country: formData.get("country") as string,
        requestType: formData.get("requestType") as string,
        projectSector: (formData.get("projectSector") as string) || undefined,
        message: formData.get("message") as string,
        budgetFundingNeed: (formData.get("budgetFundingNeed") as string) || undefined,
        projectTimeline: (formData.get("projectTimeline") as string) || undefined,
        roleType: (formData.get("roleType") as string) || undefined,
      });
      toast.success("Request Submitted", { description: "Your inquiry has been submitted. Our advisory team will contact you within 48 hours." });
      router.push("/");
    } catch {
      toast.error("Submission Failed", { description: "Please try again or contact us directly." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#f7f4ef]">

      {/* Hero header */}
      <section className="relative bg-[#173f35] pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c59b4a]/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 text-[#c59b4a] px-3 py-1.5 rounded-full text-xs font-bold mb-7">
            <Briefcase className="h-3.5 w-3.5" /> {settings.hero.badge}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-5 leading-[1.06]">
            {settings.hero.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/70 leading-relaxed">
            {settings.hero.subheadline}
          </motion.p>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-start max-w-6xl mx-auto">

            {/* Left sidebar — trust signals */}
            <div className="space-y-5 lg:sticky lg:top-32">
              {/* Why Zafora */}
              <motion.div {...fadeInView()} className="bg-[#173f35] rounded-[28px] p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c59b4a]/15 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="relative z-10">
                  <div className="text-[#c59b4a] mb-4"><Star className="h-6 w-6" /></div>
                  <h3 className="font-bold text-white text-lg mb-3">{settings.sidebar.whyTitle}</h3>
                  <ul className="space-y-3">
                    {settings.sidebar.whyBullets.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle2 className="h-4 w-4 text-[#c59b4a] shrink-0 mt-0.5" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div {...fadeInView(0.05)} className="bg-white border border-[#e5ded3] rounded-[28px] p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a958f] mb-4">Our Track Record</h4>
                <div className="space-y-4">
                  {[
                    { icon: <TrendingUp className="h-4 w-4" />, value: "$2.4B+", label: "Value Advised" },
                    { icon: <Globe className="h-4 w-4" />, value: "12+", label: "Countries" },
                    { icon: <Users className="h-4 w-4" />, value: "95%", label: "Client Retention" },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#f7f4ef] text-[#173f35] flex items-center justify-center shrink-0">{s.icon}</div>
                      <div>
                        <div className="font-bold text-[#10231f] text-base">{s.value}</div>
                        <div className="text-xs text-[#8a958f]">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Who should submit */}
              <motion.div {...fadeInView(0.1)} className="bg-[#f7f4ef] border border-[#e5ded3] rounded-[28px] p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8a958f] mb-4">Who This Is For</h4>
                <div className="space-y-3">
                  {[
                    { icon: <Landmark className="h-4 w-4" />, label: "Government ministries & agencies", bg: "bg-[#173f35]", text: "text-[#c59b4a]" },
                    { icon: <TrendingUp className="h-4 w-4" />, label: "Investors & development finance", bg: "bg-[#c59b4a]", text: "text-[#10231f]" },
                    { icon: <Briefcase className="h-4 w-4" />, label: "Project developers & sponsors", bg: "bg-[#385c7a]", text: "text-white" },
                    { icon: <Users className="h-4 w-4" />, label: "EPC contractors & operators", bg: "bg-[#245d4e]", text: "text-white" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-[#65736f]">
                      <div className={`w-8 h-8 rounded-xl ${item.bg} ${item.text} flex items-center justify-center shrink-0 shadow-sm`}>{item.icon}</div>
                      {item.label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Response time */}
              <motion.div {...fadeInView(0.15)} className="bg-white border border-[#e5ded3] rounded-[28px] p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-[#efe3cf] text-[#c59b4a] flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-[#10231f] text-sm">{settings.sidebar.responseTime}</div>
                  <div className="text-xs text-[#65736f]">{settings.sidebar.responseDesc}</div>
                </div>
              </motion.div>
            </div>

            {/* Right — form */}
            <motion.div {...fadeInView(0.05)} className="bg-white border border-[#e5ded3] p-6 md:p-10 rounded-[36px] shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-7">

                {/* Contact Details */}
                <div>
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5ded3]">
                    <div className="w-8 h-8 rounded-full bg-[#173f35] text-white flex items-center justify-center text-sm font-bold">1</div>
                    <h2 className="text-xl font-bold text-[#10231f]">Contact Details</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { id: "fullName", label: "Full Name", placeholder: "Your full name", required: true, type: "text" },
                      { id: "organization", label: "Organization / Ministry", placeholder: "Company or entity name", required: true, type: "text" },
                      { id: "email", label: "Work Email", placeholder: "name@organization.com", required: true, type: "email" },
                      { id: "phone", label: "Phone Number", placeholder: "+1 234 567 8900", required: false, type: "tel" },
                    ].map(field => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-[#10231f] font-semibold text-sm">
                          {field.label} {field.required && <span className="text-[#b85c4b]">*</span>}
                        </Label>
                        <Input
                          id={field.id} name={field.id} type={field.type}
                          required={field.required} placeholder={field.placeholder}
                          className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl"
                        />
                      </div>
                    ))}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="country" className="text-[#10231f] font-semibold text-sm">Country <span className="text-[#b85c4b]">*</span></Label>
                      <Input id="country" name="country" required placeholder="e.g. Nigeria, Kenya, Egypt" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div>
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5ded3]">
                    <div className="w-8 h-8 rounded-full bg-[#173f35] text-white flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-xl font-bold text-[#10231f]">Request Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="requestType" className="text-[#10231f] font-semibold text-sm">Nature of Request <span className="text-[#b85c4b]">*</span></Label>
                      <select id="requestType" name="requestType" defaultValue={defaultType} required
                        className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
                        <option value="consultation">General Consultation</option>
                        <option value="project_submission">Submit a Project</option>
                        <option value="funding">Funding Inquiry</option>
                        <option value="government_advisory">Government Advisory</option>
                        <option value="partnership">Partnership Proposal</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleType" className="text-[#10231f] font-semibold text-sm">Your Role</Label>
                      <select id="roleType" name="roleType"
                        className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
                        <option value="">Select Role...</option>
                        <option value="government">Government Official</option>
                        <option value="investor">Investor / Fund</option>
                        <option value="developer">Project Developer</option>
                        <option value="contractor">EPC Contractor</option>
                        <option value="consultant">Consultant</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="projectSector" className="text-[#10231f] font-semibold text-sm">Target Sector</Label>
                      <select id="projectSector" name="projectSector"
                        className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]">
                        <option value="">Select Sector...</option>
                        <option value="Energy">Energy & Power</option>
                        <option value="Water">Water & Sanitation</option>
                        <option value="Transport">Transport & Logistics</option>
                        <option value="Healthcare">Healthcare Infrastructure</option>
                        <option value="Digital">Digital Infrastructure</option>
                        <option value="Multiple">Multiple Sectors</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetFundingNeed" className="text-[#10231f] font-semibold text-sm">Estimated Value / Funding Need</Label>
                      <Input id="budgetFundingNeed" name="budgetFundingNeed" placeholder="e.g. $50M – $100M" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="projectTimeline" className="text-[#10231f] font-semibold text-sm">Expected Timeline</Label>
                      <Input id="projectTimeline" name="projectTimeline" placeholder="e.g. Q3 2025, Immediate, 18 months" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5ded3]">
                    <div className="w-8 h-8 rounded-full bg-[#173f35] text-white flex items-center justify-center text-sm font-bold">3</div>
                    <h2 className="text-xl font-bold text-[#10231f]">Your Message</h2>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#10231f] font-semibold text-sm">Message / Project Details <span className="text-[#b85c4b]">*</span></Label>
                    <Textarea
                      id="message" name="message" required
                      placeholder="Provide a high-level overview of your project, advisory need, or proposal. The more detail you share, the better we can prepare for our first conversation."
                      className="min-h-[160px] bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl p-4 resize-y text-sm"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button type="submit" size="lg" disabled={loading}
                    className="w-full font-bold text-base h-14 rounded-full bg-[#173f35] text-white hover:bg-[#245d4e] shadow-lg hover:shadow-xl transition-all">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Submitting securely...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Request <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-[#8a958f] mt-4">
                    <Lock className="h-3.5 w-3.5 text-[#173f35]" />
                    All submitted information is treated with strict confidentiality by Zafora Holding.
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
