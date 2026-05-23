import { useState } from "react";
import { useExpressInterest } from "@/src/lib/api-client-react";
import { useToast } from "@/src/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

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
      <DialogContent className="sm:max-w-[420px] bg-white border-[#e5ded3] rounded-[20px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#10231f] tracking-tight">Express Interest</DialogTitle>
          <DialogDescription className="text-[#65736f] text-sm mt-1">
            Provide your details to request more information or express investment intent.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-[#10231f] font-semibold text-xs">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Jane Doe" className="bg-[#f7f4ef] border-[#e5ded3] h-9 text-sm rounded-lg focus-visible:ring-[#173f35]" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="organization" className="text-[#10231f] font-semibold text-xs">Organization</Label>
              <Input id="organization" name="organization" required placeholder="Acme Capital" className="bg-[#f7f4ef] border-[#e5ded3] h-9 text-sm rounded-lg focus-visible:ring-[#173f35]" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#10231f] font-semibold text-xs">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" className="bg-[#f7f4ef] border-[#e5ded3] h-9 text-sm rounded-lg focus-visible:ring-[#173f35]" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-[#10231f] font-semibold text-xs">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="+1 234 567 890" className="bg-[#f7f4ef] border-[#e5ded3] h-9 text-sm rounded-lg focus-visible:ring-[#173f35]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roleType" className="text-[#10231f] font-semibold text-xs">Your Role</Label>
            <select 
              id="roleType" 
              name="roleType" 
              required 
              className="flex h-9 w-full rounded-lg border border-[#e5ded3] bg-[#f7f4ef] px-3 py-1.5 text-sm text-[#10231f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173f35]"
            >
              <option value="investor">Investor / Financier</option>
              <option value="contractor">EPC Contractor</option>
              <option value="operator">Operator / O&M</option>
              <option value="government">Government Representative</option>
              <option value="consultant">Consultant / Advisor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-[#10231f] font-semibold text-xs">Message (optional)</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Any specific questions or areas of interest?" 
              className="bg-[#f7f4ef] border-[#e5ded3] min-h-[72px] text-sm rounded-lg p-2.5 focus-visible:ring-[#173f35]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="rounded-full border-[#e5ded3] text-[#10231f] font-semibold text-sm h-9 px-4">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="rounded-full bg-[#173f35] text-white hover:bg-[#173f35]/90 font-semibold text-sm h-9 px-5">
              {loading ? "Submitting..." : "Submit Interest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
