import type { ReactNode } from "react";
import AdminSidebar from "@/src/modules/admin/shared/components/AdminSidebar";
import AdminHeader from "@/src/modules/admin/shared/components/AdminHeader";

export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#f7f4ef" }}>
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
