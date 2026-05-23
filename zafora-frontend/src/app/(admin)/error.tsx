"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f4ef] px-4 text-center">
      <h2 className="text-xl font-bold text-[#10231f]">Admin error</h2>
      <p className="max-w-md text-sm text-[#65736f]">
        {error.message || "Something went wrong in the admin area."}
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
