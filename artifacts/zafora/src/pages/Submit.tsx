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
    <div className="flex flex-col pb-24">
      {/* Header */}
      <section className="bg-secondary py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Submit Request</h1>
          <p className="text-lg text-muted-foreground">
            Initiate a dialogue with Zafora Holding. Whether you are a government entity, investor, or project developer, provide details below to engage our team.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-card border border-border p-6 md:p-10 rounded-2xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white border-b border-border pb-2">Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="fullName" name="fullName" required placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization / Ministry <span className="text-destructive">*</span></Label>
                  <Input id="organization" name="organization" required placeholder="Company or Entity Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email <span className="text-destructive">*</span></Label>
                  <Input id="email" name="email" type="email" required placeholder="name@organization.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="country">Country of Origin <span className="text-destructive">*</span></Label>
                  <Input id="country" name="country" required placeholder="e.g. Nigeria, UK, USA" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <h2 className="text-2xl font-bold text-white border-b border-border pb-2">Request Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="requestType">Nature of Request <span className="text-destructive">*</span></Label>
                  <select 
                    id="requestType" 
                    name="requestType" 
                    defaultValue={defaultType}
                    required 
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="consultation">General Consultation</option>
                    <option value="project_submission">Submit a Project</option>
                    <option value="funding">Funding Inquiry</option>
                    <option value="government_advisory">Government Advisory</option>
                    <option value="partnership">Partnership Proposal</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="roleType">Your Role</Label>
                  <select 
                    id="roleType" 
                    name="roleType" 
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Role...</option>
                    <option value="government">Government Official</option>
                    <option value="investor">Investor / Fund</option>
                    <option value="developer">Project Developer</option>
                    <option value="contractor">EPC Contractor</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectSector">Target Sector (if applicable)</Label>
                  <select 
                    id="projectSector" 
                    name="projectSector" 
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Sector...</option>
                    <option value="Energy">Energy & Power</option>
                    <option value="Water">Water & Sanitation</option>
                    <option value="Transport">Transport & Logistics</option>
                    <option value="Healthcare">Healthcare Infrastructure</option>
                    <option value="Multiple">Multiple Sectors</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetFundingNeed">Estimated Value / Funding Need</Label>
                  <Input id="budgetFundingNeed" name="budgetFundingNeed" placeholder="e.g. $50M - $100M" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTimeline">Expected Timeline</Label>
                <Input id="projectTimeline" name="projectTimeline" placeholder="e.g. Q3 2024, Immediate" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message / Details <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required
                  placeholder="Provide a high-level overview of your project, advisory need, or proposal." 
                  className="min-h-[150px]"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full font-bold text-lg h-14" disabled={loading}>
                {loading ? "Submitting securely..." : "Submit Request"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                All submitted information is treated with strict confidentiality.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}