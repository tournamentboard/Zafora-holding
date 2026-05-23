import { cn } from "@/src/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  badge,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-10", className)}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          {badge && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#efe3cf] px-3 py-1.5 text-xs font-bold text-[#173f35]">
              {badge}
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-[#10231f] md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-lg text-[#65736f]">{description}</p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
