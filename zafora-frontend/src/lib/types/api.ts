export type HealthStatus = {
  status: "ok";
};

export type ApiErrorBody = {
  message?: string;
  title?: string;
  detail?: string;
  error?: string;
};

export type ApiListResponse<TItem, TKey extends string> = {
  [K in TKey]: TItem[];
} & {
  total?: number;
};
