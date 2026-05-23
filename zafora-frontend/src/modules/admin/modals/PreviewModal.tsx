"use client";

import { FileText, X, ExternalLink } from "lucide-react";
import { getDocType, getVisibility, getPreviewUrl } from "@/src/modules/admin/documents/constants";

export default function PreviewModal({ doc, onClose }: { doc: any; onClose: () => void }) {
  const previewUrl = doc.fileUrl ? getPreviewUrl(doc.fileUrl) : null;
  const visInfo = getVisibility(doc.visibility);
  const docType = getDocType(doc.documentType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e5ded3] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#efe3cf] flex items-center justify-center text-[#c59b4a] shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-[#10231f] truncate">{doc.title}</h3>
              <div className="flex items-center gap-2 text-xs text-[#8a958f]">
                <span>{docType.label}</span>
                <span>Â·</span>
                <span className={`flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${visInfo.color}`}>
                  {visInfo.icon} {visInfo.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {doc.fileUrl && (
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#173f35] text-white text-sm font-semibold hover:bg-[#245d4e] transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Open Original
              </a>
            )}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#f7f4ef] text-[#65736f]">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full flex-1 border-0"
              title={doc.title}
              allow="fullscreen"
            />
          ) : doc.fileUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#f7f4ef]">
              <FileText className="h-16 w-16 text-[#c59b4a] mb-4 opacity-60" />
              <h4 className="font-bold text-[#10231f] text-lg mb-2">Preview Not Available</h4>
              <p className="text-[#65736f] mb-6 max-w-sm">
                This file type can't be previewed directly. Use the button below to open it in a new tab.
              </p>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#173f35] text-white font-semibold hover:bg-[#245d4e] transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> Open File
              </a>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#f7f4ef]">
              <FileText className="h-16 w-16 text-[#8a958f] mb-4 opacity-30" />
              <h4 className="font-bold text-[#10231f] text-lg mb-2">No File Attached</h4>
              <p className="text-[#65736f] max-w-sm">
                No file URL has been added for this document yet. Edit it to add a link.
              </p>
            </div>
          )}
        </div>

        {/* Description footer */}
        {doc.description && (
          <div className="p-4 border-t border-[#e5ded3] bg-[#f7f4ef] shrink-0">
            <p className="text-xs text-[#65736f]"><span className="font-semibold text-[#10231f]">Notes:</span> {doc.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
