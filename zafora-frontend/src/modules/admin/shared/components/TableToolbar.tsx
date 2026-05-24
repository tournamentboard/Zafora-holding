"use client";

import { Search, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  rightSlot?: React.ReactNode;
}

export default function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "All",
  rightSlot,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a958f]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-8 py-2.5 border border-[#e5ded3] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#173f35] text-[#10231f] placeholder:text-[#8a958f]"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a958f] hover:text-[#173f35]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {filterOptions && onFilterChange && (
        <select
          value={filterValue}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2.5 border border-[#e5ded3] rounded-xl text-sm bg-white text-[#10231f] focus:outline-none focus:ring-2 focus:ring-[#173f35] cursor-pointer"
        >
          <option value="all">{filterLabel}</option>
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
    </div>
  );
}
