import { useState } from "react";
import { useListLeads, useUpdateLead } from "@workspace/api-client-react";
import { useToast } from "@/src/hooks/use-toast";
import { X, Mail, Phone, Building2, MapPin, MessageSquare, ChevronDown } from "lucide-react";
import { format } from "date-fns";

const STATUSES = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "reviewed", label: "Reviewed", color: "bg-purple-100 text-purple-700" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-100 text-yellow-700" },
  { value: "qualified", label: "Qualified", color: "bg-green-100 text-green-700" },
  { value: "proposal_sent", label: "Proposal Sent", color: "bg-orange-100 text-orange-700" },
  { value: "in_progress", label: "In Progress", color: "bg-teal-100 text-teal-700" },
  { value: "closed", label: "Closed Won", color: "bg-gray-100 text-gray-600" },
  { value: "rejected", label: "Not a Fit", color: "bg-red-100 text-red-600" },
];

const REQUEST_LABELS: Record<string, string> = {
  consultation: "General Consultation",
  project_submission: "Submit a Project",
  funding: "Funding Inquiry",
  government_advisory: "Government Advisory",
  partnership: "Partnership Proposal",
};

function getStatusInfo(value: string) {
  return STATUSES.find(s => s.value === value) || { label: value, color: "bg-gray-100 text-gray-600" };
}

export default function LeadsTable() {
  const { data, isLoading, refetch } = useListLeads({ limit: 100 });
  const updateLead = useUpdateLead();
  const { toast } = useToast();
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateLead.mutateAsync({ id, data: { status: newStatus } });
      toast({ title: "Status updated!" });
      refetch();
      if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status: newStatus });
    } catch {
      toast({ title: "Could not update status. Try again.", variant: "destructive" });
    }
  };

  const filtered = filterStatus === "all"
    ? data?.leads
    : data?.leads?.filter(l => l.status === filterStatus);

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-[#e5ded3]" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-[#10231f] mb-1">Inquiries</h2>
        <p className="text-[#65736f]">Everyone who has contacted you through the website. Click on a person to read their message.</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === "all" ? "bg-[#173f35] text-white" : "bg-white border border-[#e5ded3] text-[#65736f] hover:border-[#173f35]"}`}
        >
          All ({data?.total || 0})
        </button>
        {STATUSES.slice(0, 4).map(s => {
          const count = data?.leads?.filter(l => l.status === s.value).length || 0;
          if (!count) return null;
          return (
            <button
              key={s.value}
              onClick={() => setFilterStatus(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filterStatus === s.value ? "bg-[#173f35] text-white" : "bg-white border border-[#e5ded3] text-[#65736f] hover:border-[#173f35]"}`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered?.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e5ded3]">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-[#8a958f] opacity-40" />
            <p className="text-[#65736f] font-medium">No inquiries here yet.</p>
            <p className="text-[#8a958f] text-sm mt-1">When someone contacts you through the website, they will appear here.</p>
          </div>
        )}

        {filtered?.map((lead) => {
          const statusInfo = getStatusInfo(lead.status);
          return (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="bg-white border border-[#e5ded3] rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#c59b4a] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {lead.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[#10231f] text-base">{lead.fullName}</div>
                    <div className="text-sm text-[#65736f] flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{lead.organization}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.country}</span>
                      <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-[#f7f4ef] text-[#65736f] text-xs font-medium px-2 py-1 rounded-lg">
                        {REQUEST_LABELS[lead.requestType] || lead.requestType}
                      </span>
                      <span className="text-xs text-[#8a958f]">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  <div className="relative">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className="appearance-none pl-3 pr-7 py-1.5 text-xs font-semibold border border-[#e5ded3] rounded-lg bg-white text-[#10231f] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#173f35]"
                    >
                      {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8a958f] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail panel / modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#e5ded3]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#173f35] text-white flex items-center justify-center font-bold text-lg">
                  {selectedLead.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#10231f] text-lg">{selectedLead.fullName}</h3>
                  <p className="text-[#65736f] text-sm">{selectedLead.organization}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-lg hover:bg-[#f7f4ef] text-[#65736f]">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InfoBlock icon={<Mail className="h-4 w-4" />} label="Email" value={selectedLead.email} />
                <InfoBlock icon={<Phone className="h-4 w-4" />} label="Phone" value={selectedLead.phone || "Not provided"} />
                <InfoBlock icon={<MapPin className="h-4 w-4" />} label="Country" value={selectedLead.country} />
                <InfoBlock icon={<Building2 className="h-4 w-4" />} label="Role" value={selectedLead.roleType || "Not specified"} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f7f4ef] rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#8a958f] uppercase mb-1">Request Type</div>
                  <div className="font-semibold text-[#10231f]">{REQUEST_LABELS[selectedLead.requestType] || selectedLead.requestType}</div>
                </div>
                {selectedLead.projectSector && (
                  <div className="bg-[#f7f4ef] rounded-xl p-4">
                    <div className="text-xs font-semibold text-[#8a958f] uppercase mb-1">Sector</div>
                    <div className="font-semibold text-[#10231f]">{selectedLead.projectSector}</div>
                  </div>
                )}
                {selectedLead.budgetFundingNeed && (
                  <div className="bg-[#f7f4ef] rounded-xl p-4">
                    <div className="text-xs font-semibold text-[#8a958f] uppercase mb-1">Budget / Funding Need</div>
                    <div className="font-semibold text-[#10231f]">{selectedLead.budgetFundingNeed}</div>
                  </div>
                )}
                {selectedLead.projectTimeline && (
                  <div className="bg-[#f7f4ef] rounded-xl p-4">
                    <div className="text-xs font-semibold text-[#8a958f] uppercase mb-1">Timeline</div>
                    <div className="font-semibold text-[#10231f]">{selectedLead.projectTimeline}</div>
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8a958f] uppercase mb-2">Their Message</div>
                <div className="bg-[#f7f4ef] rounded-xl p-4 text-[#10231f] leading-relaxed whitespace-pre-wrap text-sm">
                  {selectedLead.message || "No message provided."}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-[#8a958f] uppercase mb-2">Update Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(selectedLead.id, s.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        selectedLead.status === s.value
                          ? "bg-[#173f35] text-white border-[#173f35]"
                          : "bg-white border-[#e5ded3] text-[#65736f] hover:border-[#173f35] hover:text-[#173f35]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#173f35] text-white font-semibold hover:bg-[#245d4e] transition-colors"
                >
                  <Mail className="h-4 w-4" /> Email This Person
                </a>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-6 py-3 rounded-xl border border-[#e5ded3] text-[#65736f] font-semibold hover:bg-[#f7f4ef] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#f7f4ef] rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8a958f] uppercase mb-1">
        {icon} {label}
      </div>
      <div className="font-medium text-[#10231f] text-sm">{value}</div>
    </div>
  );
}
