"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-xl font-semibold text-rackd-charcoal">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-rackd-charcoal/60">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-2xl bg-rackd-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-rackd-charcoal/90"
      >
        Try again
      </button>
    </div>
  );
}
