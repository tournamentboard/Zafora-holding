"use client";

import { useState } from "react";

interface TableFiltersState<T extends string = string> {
  filterValue: T | "all";
  setFilterValue: (value: T | "all") => void;
  resetFilter: () => void;
}

export function useTableFilters<T extends string = string>(
  defaultValue: T | "all" = "all",
): TableFiltersState<T> {
  const [filterValue, setFilterValue] = useState<T | "all">(defaultValue);

  const resetFilter = () => setFilterValue("all");

  return { filterValue, setFilterValue, resetFilter };
}
