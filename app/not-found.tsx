import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-rackd-charcoal/15">404</p>
      <h1 className="mt-4 text-xl font-semibold text-rackd-charcoal">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-rackd-charcoal/55">
        That item or page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-rackd-charcoal px-5 py-2.5 text-sm font-medium text-white hover:bg-rackd-charcoal/90"
      >
        <ArrowLeft size={16} />
        Back to inventory
      </Link>
    </div>
  );
}
