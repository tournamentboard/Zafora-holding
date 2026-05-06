import { useState } from "react";
import { useListLeads, useUpdateLead } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const STATUSES = ["new", "reviewed", "contacted", "qualified", "proposal_sent", "in_progress", "closed", "rejected"];

export default function LeadsTable() {
  const { data, isLoading, refetch } = useListLeads({ limit: 50 });
  const updateLead = useUpdateLead();
  const { toast } = useToast();
  
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateLead.mutateAsync({ id, data: { status: newStatus } });
      toast({ title: "Status updated" });
      refetch();
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (e) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-white">Lead Inbox</h2>
        <Badge variant="outline">{data?.total || 0} Total</Badge>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Date</th>
                <th className="p-4 font-semibold text-muted-foreground">Contact</th>
                <th className="p-4 font-semibold text-muted-foreground">Organization</th>
                <th className="p-4 font-semibold text-muted-foreground">Type</th>
                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.leads?.map(lead => (
                <tr key={lead.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 whitespace-nowrap text-muted-foreground">
                    {format(new Date(lead.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{lead.fullName}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </td>
                  <td className="p-4">{lead.organization}</td>
                  <td className="p-4 capitalize">{lead.requestType.replace("_", " ")}</td>
                  <td className="p-4">
                    <select 
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="bg-secondary border border-border rounded px-2 py-1 text-xs uppercase font-medium focus:ring-1 focus:ring-primary"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedLead(lead)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {!data?.leads?.length && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif">Lead Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">Contact</div>
                <div className="font-medium">{selectedLead.fullName}</div>
                <div>{selectedLead.email}</div>
                <div>{selectedLead.phone}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase mb-1">Organization Info</div>
                <div className="font-medium">{selectedLead.organization}</div>
                <div>{selectedLead.country}</div>
                <div>Role: {selectedLead.roleType || 'N/A'}</div>
              </div>
              <div className="col-span-2 border-t border-border pt-4">
                <div className="text-muted-foreground text-xs uppercase mb-1">Request Type</div>
                <div className="font-medium uppercase tracking-wider text-primary">{selectedLead.requestType.replace("_", " ")}</div>
              </div>
              <div className="col-span-2 border-t border-border pt-4">
                <div className="text-muted-foreground text-xs uppercase mb-1">Message</div>
                <div className="bg-secondary p-4 rounded-md whitespace-pre-wrap">{selectedLead.message}</div>
              </div>
              {selectedLead.budgetFundingNeed && (
                <div className="col-span-2">
                  <div className="text-muted-foreground text-xs uppercase mb-1">Budget / Funding Need</div>
                  <div className="font-medium">{selectedLead.budgetFundingNeed}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}