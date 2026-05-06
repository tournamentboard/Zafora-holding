import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Submit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createLead = useCreateLead();
  const [loading, setLoading] = useState(false);

  // Read URL params for defaults
  const [defaultType, setDefaultType] = useState("consultation");
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "government") {
      setDefaultType("government_advisory");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await createLead.mutateAsync({
        // @ts-ignore
        data: {
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
        }
      });
      
      toast({
        title: "Request Submitted",
        description: "Your inquiry has been successfully submitted. Our advisory team will review and contact you shortly.",
      });
      
      setLocation("/");
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-24 bg-[#f7f4ef]">
      {/* Header */}
      <section className="pt-24 pb-16 text-center">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#10231f] tracking-tight mb-6">Submit Request</h1>
          <p className="text-xl text-[#65736f] leading-relaxed">
            Initiate a dialogue with Zafora Holding. Whether you are a government entity, investor, or project developer, provide details below to engage our team.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-4 md:px-8 pb-12">
        <div className="max-w-3xl mx-auto bg-white border border-[#e5ded3] p-8 md:p-12 rounded-[36px] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#10231f] tracking-tight border-b border-[#e5ded3] pb-4">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="fullName" className="text-[#10231f] font-semibold text-sm">Full Name <span className="text-[#b85c4b]">*</span></Label>
                  <Input id="fullName" name="fullName" required placeholder="Enter your name" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="organization" className="text-[#10231f] font-semibold text-sm">Organization / Ministry <span className="text-[#b85c4b]">*</span></Label>
                  <Input id="organization" name="organization" required placeholder="Company or Entity Name" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-[#10231f] font-semibold text-sm">Work Email <span className="text-[#b85c4b]">*</span></Label>
                  <Input id="email" name="email" type="email" required placeholder="name@organization.com" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="phone" className="text-[#10231f] font-semibold text-sm">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+1 234 567 8900" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="country" className="text-[#10231f] font-semibold text-sm">Country of Origin <span className="text-[#b85c4b]">*</span></Label>
                  <Input id="country" name="country" required placeholder="e.g. Nigeria, UK, USA" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              <h2 className="text-2xl font-bold text-[#10231f] tracking-tight border-b border-[#e5ded3] pb-4">Request Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="requestType" className="text-[#10231f] font-semibold text-sm">Nature of Request <span className="text-[#b85c4b]">*</span></Label>
                  <select 
                    id="requestType" 
                    name="requestType" 
                    defaultValue={defaultType}
                    required 
                    className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 py-2 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"
                  >
                    <option value="consultation">General Consultation</option>
                    <option value="project_submission">Submit a Project</option>
                    <option value="funding">Funding Inquiry</option>
                    <option value="government_advisory">Government Advisory</option>
                    <option value="partnership">Partnership Proposal</option>
                  </select>
                </div>
                
                <div className="space-y-2.5">
                  <Label htmlFor="roleType" className="text-[#10231f] font-semibold text-sm">Your Role</Label>
                  <select 
                    id="roleType" 
                    name="roleType" 
                    className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 py-2 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"
                  >
                    <option value="">Select Role...</option>
                    <option value="government">Government Official</option>
                    <option value="investor">Investor / Fund</option>
                    <option value="developer">Project Developer</option>
                    <option value="contractor">EPC Contractor</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="projectSector" className="text-[#10231f] font-semibold text-sm">Target Sector (if applicable)</Label>
                  <select 
                    id="projectSector" 
                    name="projectSector" 
                    className="flex h-12 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-4 py-2 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"
                  >
                    <option value="">Select Sector...</option>
                    <option value="Energy">Energy & Power</option>
                    <option value="Water">Water & Sanitation</option>
                    <option value="Transport">Transport & Logistics</option>
                    <option value="Healthcare">Healthcare Infrastructure</option>
                    <option value="Multiple">Multiple Sectors</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="budgetFundingNeed" className="text-[#10231f] font-semibold text-sm">Estimated Value / Funding Need</Label>
                  <Input id="budgetFundingNeed" name="budgetFundingNeed" placeholder="e.g. $50M - $100M" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="projectTimeline" className="text-[#10231f] font-semibold text-sm">Expected Timeline</Label>
                <Input id="projectTimeline" name="projectTimeline" placeholder="e.g. Q3 2024, Immediate" className="h-12 bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl" />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="message" className="text-[#10231f] font-semibold text-sm">Message / Details <span className="text-[#b85c4b]">*</span></Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required
                  placeholder="Provide a high-level overview of your project, advisory need, or proposal." 
                  className="min-h-[160px] bg-[#f7f4ef] border-[#e5ded3] focus-visible:ring-[#173f35] rounded-xl p-4 resize-y"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full font-bold text-base h-14 rounded-full bg-[#173f35] text-white hover:bg-[#173f35]/90 shadow-md" disabled={loading}>
                {loading ? "Submitting securely..." : "Submit Request"}
              </Button>
              <p className="text-xs font-medium text-center text-[#8a958f] mt-5">
                All submitted information is treated with strict confidentiality by Zafora Holding.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
