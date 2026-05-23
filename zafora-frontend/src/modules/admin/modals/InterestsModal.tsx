"use client";

import { useListProjectInterests } from "@/src/lib/api-client-react";
import { X, Users, Mail } from "lucide-react";
import { format } from "date-fns";

export default function InterestsModal({ projectId, onClose }: { projectId: number; onClose: () => void }) {
  const { data, isLoading } = useListProjectInterests(projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#e5ded3]">
          <div>
            <h3 className="font-bold text-[#10231f] text-lg">Interested Parties</h3>
            <p className="text-sm text-[#65736f]">People who expressed interest in this project</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#f7f4ef] text-[#65736f]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8 text-[#8a958f]">Loading...</div>
          ) : !data?.interests?.length ? (
            <div className="text-center py-10 text-[#8a958f]">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No one has expressed interest yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.interests.map(interest => (
                <div key={interest.id} className="bg-[#f7f4ef] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#10231f]">{interest.fullName}</div>
                      <div className="text-sm text-[#65736f]">{interest.organization} · {interest.roleType}</div>
                      <div className="text-xs text-[#8a958f] mt-0.5">{interest.email}{interest.phone ? ` · ${interest.phone}` : ""}</div>
                    </div>
                    <div className="text-xs text-[#8a958f]">{format(new Date(interest.createdAt), "MMM d, yyyy")}</div>
                  </div>
                  {interest.message && (
                    <div className="mt-3 text-sm text-[#10231f] bg-white rounded-lg p-3 border border-[#e5ded3]">
                      {interest.message}
                    </div>
                  )}
                  <a
                    href={`mailto:${interest.email}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#173f35] hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" /> Email them
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
