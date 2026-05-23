"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-xl font-bold text-[#10231f]">Something went wrong</h2>
      <p className="max-w-md text-sm text-[#65736f]">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-[#173f35] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#245d4e]"
      >
        Try again
      </button>
    </div>
  );
}
