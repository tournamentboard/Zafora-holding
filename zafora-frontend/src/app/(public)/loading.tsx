export default function PublicLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5ded3] border-t-[#173f35]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
