import type { ReactNode } from "react";
import GlobalLayout from "@/src/components/layout/GlobalLayout";

export default function PublicShell({ children }: { children: ReactNode }) {
  return <GlobalLayout>{children}</GlobalLayout>;
}
