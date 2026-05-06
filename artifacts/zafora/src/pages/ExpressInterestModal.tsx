import { useState } from "react";
import { useExpressInterest } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ExpressInterestModal({ projectId, onClose }: { projectId: number, onClose: () => void }) {
  const { toast } = useToast();
  const expressInterest = useExpressInterest();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      projectId,
      fullName: formData.get("fullName") as string,
      organization: formData.get("organization") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      roleType: formData.get("roleType") as string,
      message: (formData.get("message") as string) || undefined,
    };

    try {
      // @ts-ignore
      await expressInterest.mutateAsync({ data });
      toast({
        title: "Interest Registered",
        description: "Your interest has been noted. Our team will contact you shortly.",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-[#e5ded3] rounded-[24px] p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-[#10231f] tracking-tight">Express Interest</DialogTitle>
          <DialogDescription className="text-[#65736f] text-base mt-2">
            Provide your details below to request more information or express investment intent for this project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="fullName" className="text-[#10231f] font-semibold text-sm">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Jane Doe" className="bg-[#f7f4ef] border-[#e5ded3] h-11 rounded-xl focus-visible:ring-[#173f35]" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="organization" className="text-[#10231f] font-semibold text-sm">Organization</Label>
              <Input id="organization" name="organization" required placeholder="Acme Capital" className="bg-[#f7f4ef] border-[#e5ded3] h-11 rounded-xl focus-visible:ring-[#173f35]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[#10231f] font-semibold text-sm">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" className="bg-[#f7f4ef] border-[#e5ded3] h-11 rounded-xl focus-visible:ring-[#173f35]" />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="phone" className="text-[#10231f] font-semibold text-sm">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="+1 234 567 890" className="bg-[#f7f4ef] border-[#e5ded3] h-11 rounded-xl focus-visible:ring-[#173f35]" />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="roleType" className="text-[#10231f] font-semibold text-sm">Your Role</Label>
            <select 
              id="roleType" 
              name="roleType" 
              required 
              className="flex h-11 w-full rounded-xl border border-[#e5ded3] bg-[#f7f4ef] px-3 py-2 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"
            >
              <option value="investor">Investor / Financier</option>
              <option value="contractor">EPC Contractor</option>
              <option value="operator">Operator / O&M</option>
              <option value="government">Government Representative</option>
              <option value="consultant">Consultant / Advisor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="message" className="text-[#10231f] font-semibold text-sm">Message (optional)</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Any specific questions or areas of interest?" 
              className="bg-[#f7f4ef] border-[#e5ded3] min-h-[100px] rounded-xl p-3 focus-visible:ring-[#173f35]"
            />
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="rounded-full border-[#e5ded3] text-[#10231f] font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full bg-[#173f35] text-white hover:bg-[#173f35]/90 font-semibold px-6">
              {loading ? "Submitting..." : "Submit Interest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
