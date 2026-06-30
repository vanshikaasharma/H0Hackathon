import Image from "next/image";

interface RackdLogoProps {
  className?: string;
  /** Icon size in px — wordmark scales with it */
  size?: number;
  /** Hide "Rackd" text (e.g. collapsed sidebar) */
  showWordmark?: boolean;
}

// Logo in the nav — icon from public/logo.png, favicon from app/icon.png.
export default function RackdLogo({
  className = "",
  size = 36,
  showWordmark = true,
}: RackdLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        className="shrink-0"
        aria-hidden
      />
      {showWordmark && (
        <span className="text-lg font-bold tracking-tight text-rackd-charcoal sm:text-xl">
          Rack<span className="text-rackd-charcoal/70">d</span>
        </span>
      )}
    </div>
  );
}
