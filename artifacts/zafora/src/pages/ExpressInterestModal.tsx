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
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-white">Express Interest</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Provide your details below to request more information or express investment intent for this project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Jane Doe" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input id="organization" name="organization" required placeholder="Acme Capital" className="bg-background border-border" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="jane@example.com" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="+1 234 567 890" className="bg-background border-border" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleType">Your Role</Label>
            <select 
              id="roleType" 
              name="roleType" 
              required 
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="investor">Investor / Financier</option>
              <option value="contractor">EPC Contractor</option>
              <option value="operator">Operator / O&M</option>
              <option value="government">Government Representative</option>
              <option value="consultant">Consultant / Advisor</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Any specific questions or areas of interest?" 
              className="bg-background border-border min-h-[100px]"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Interest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}