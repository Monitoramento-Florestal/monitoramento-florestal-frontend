
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize    = "sm" | "md" | "lg";

interface BaseProps {
  text?:      string;
  icon?:      LucideIcon;
  iconSide?:  "left" | "right";
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  className?: string;
  href?:      string;
  external?:  boolean;
}

type ButtonProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-sage text-cream",
    "hover:bg-sage/90",
    "focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
    "disabled:bg-sage/40 disabled:pointer-events-none",
  ].join(" "),

  outline: [
    "border border-rosewood/40 text-burgundy bg-transparent",
    "hover:bg-secondary",
    "focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
    "disabled:border-rosewood/20 disabled:text-rosewood/50 disabled:pointer-events-none",
  ].join(" "),

  ghost: [
    "text-burgundy bg-transparent",
    "hover:bg-secondary",
    "focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2",
    "disabled:text-rosewood/50 disabled:pointer-events-none",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8  px-3 text-xs     gap-1.5 rounded-md",
  md: "h-9  px-4 text-sm     gap-1.5 rounded-md",
  lg: "h-12 px-6 text-[15px] gap-2   rounded-lg",
};

const iconSize: Record<ButtonSize, number> = {
  sm: 13,
  md: 14,
  lg: 18,
};

const BASE = [
  "inline-flex items-center justify-center",
  "font-sans font-normal leading-none whitespace-nowrap",
  "transition-colors duration-150",
  "outline-none",
].join(" ");


export function Button({
  text,
  icon: Icon,
  iconSide  = "right",
  variant   = "primary",
  size      = "md",
  href,
  external  = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [BASE, variantStyles[variant], sizeStyles[size], className]
    .filter(Boolean)
    .join(" ");

  const iconEl = Icon ? (
    <Icon
      size={iconSize[size]}
      strokeWidth={1.8}
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    />
  ) : null;

  const content = (
    <>
      {iconSide === "left"  && iconEl}
      {text ?? children}
      {iconSide === "right" && iconEl}
    </>
  );

  if (href && external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  // Button
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}