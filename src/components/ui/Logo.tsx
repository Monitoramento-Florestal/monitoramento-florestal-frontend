import Image from "next/image";

interface LogoProps {
  size?:          number;
  withWordmark?:  boolean;
  variant?:       "light" | "dark";
  className?:     string;
}

export function Logo({
  size         = 32,
  withWordmark = false,
  variant      = "dark",
  className    = "",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Image
        src="/arbor-logo.png"
        alt="Arbor"
        width={size}
        height={size}
        className="rounded-md object-contain"
        priority
      />

      {withWordmark && (
        <span
          className={`font-medium ${variant === "light" ? "text-cream" : "text-burgundy"}`}
          style={{
            fontSize:      size * 0.54,
            letterSpacing: "-0.03em",
          }}
        >
          Arbor
        </span>
      )}
    </div>
  );
}