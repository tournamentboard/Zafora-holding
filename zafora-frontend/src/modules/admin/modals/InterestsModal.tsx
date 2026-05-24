"use client";

import { useProjectInterests } from "@/src/modules/public/projects";
import { X, Users, Mail } from "lucide-react";
import { format } from "date-fns";

export default function InterestsModal({
  projectId,
  onClose,
}: {
  projectId: number;
  onClose: () => void;
}) {
  const { data, isLoading } = useProjectInterests(projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" style={{ maxHeight: "85vh" }}>
        <div className="flex items-center justify-between border-b border-[#e5ded3] p-6">
          <div>
            <h3 className="text-lg font-bold text-[#10231f]">Interested Parties</h3>
            <p className="text-sm text-[#65736f]">
              People who expressed interest in this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#65736f] hover:bg-[#f7f4ef]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-8 text-center text-[#8a958f]">Loading…</div>
          ) : !data?.interests?.length ? (
            <div className="py-10 text-center text-[#8a958f]">
              <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No one has expressed interest yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.interests.map((interest) => (
                <div
                  key={interest.id}
                  className="rounded-xl bg-[#f7f4ef] p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-[#10231f]">
                        {interest.fullName}
                      </div>
                      <div className="text-sm text-[#65736f]">
                        {interest.organization} · {interest.roleType}
                      </div>
                      <div className="mt-0.5 text-xs text-[#8a958f]">
                        {interest.email}
                        {interest.phone ? ` · ${interest.phone}` : ""}
                      </div>
                    </div>
                    <div className="text-xs text-[#8a958f]">
                      {format(new Date(interest.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>

                  {interest.message && (
                    <div className="mt-3 rounded-lg border border-[#e5ded3] bg-white p-3 text-sm text-[#10231f]">
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
