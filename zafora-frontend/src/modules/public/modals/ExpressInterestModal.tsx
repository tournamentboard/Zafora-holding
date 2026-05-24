"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useExpressInterestMutation } from "@/src/modules/public/projects";
import { expressInterestSchema } from "@/src/lib/validators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

export default function ExpressInterestModal({
  projectId,
  onClose,
}: {
  projectId: number;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useExpressInterestMutation(projectId);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      fullName: fd.get("fullName") as string,
      organization: fd.get("organization") as string,
      email: fd.get("email") as string,
      phone: (fd.get("phone") as string) || null,
      roleType: fd.get("roleType") as string,
      message: (fd.get("message") as string) || null,
    };

    const parsed = expressInterestSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[String(i.path[0])] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await mutateAsync(parsed.data);
      toast.success("Interest Registered", {
        description: "Our team will contact you shortly.",
      });
      onClose();
    } catch (err) {
      toast.error("Submission failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] rounded-[20px] border-[#e5ded3] bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-[#10231f]">
            Express Interest
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-[#65736f]">
            Provide your details to request more information or express investment intent.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "fullName", label: "Full Name", placeholder: "Jane Doe" },
              { id: "organization", label: "Organization", placeholder: "Acme Capital" },
            ].map(({ id, label, placeholder }) => (
              <div key={id} className="space-y-1.5">
                <Label htmlFor={id} className="text-xs font-semibold text-[#10231f]">
                  {label}
                </Label>
                <Input
                  id={id}
                  name={id}
                  required
                  placeholder={placeholder}
                  className="h-9 rounded-lg border-[#e5ded3] bg-[#f7f4ef] text-sm focus-visible:ring-[#173f35]"
                />
                {errors[id] && (
                  <p className="text-xs text-red-500">{errors[id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#10231f]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                className="h-9 rounded-lg border-[#e5ded3] bg-[#f7f4ef] text-sm focus-visible:ring-[#173f35]"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold text-[#10231f]">
                Phone (optional)
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 234 567 890"
                className="h-9 rounded-lg border-[#e5ded3] bg-[#f7f4ef] text-sm focus-visible:ring-[#173f35]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="roleType" className="text-xs font-semibold text-[#10231f]">
              Your Role
            </Label>
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
            {errors.roleType && <p className="text-xs text-red-500">{errors.roleType}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold text-[#10231f]">
              Message (optional)
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Any specific questions or areas of interest?"
              className="min-h-[72px] rounded-lg border-[#e5ded3] bg-[#f7f4ef] p-2.5 text-sm focus-visible:ring-[#173f35]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-9 rounded-full border-[#e5ded3] px-4 text-sm font-semibold text-[#10231f]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 rounded-full bg-[#173f35] px-5 text-sm font-semibold text-white hover:bg-[#173f35]/90"
            >
              {isPending ? "Submitting…" : "Submit Interest"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
