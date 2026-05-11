import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export function BrandLogo({
  className,
  priority = false,
  variant = "default",
}: {
  className?: string;
  priority?: boolean;
  variant?: "default" | "compact" | "hero";
}) {
  const sizeClass =
    variant === "hero"
      ? "h-[172px] w-[300px] md:h-[238px] md:w-[410px]"
      : variant === "compact"
        ? "h-[60px] w-[116px] md:h-[72px] md:w-[142px]"
        : "h-[74px] w-[142px] md:h-[86px] md:w-[166px]";

  return (
    <Link
      href="/"
      className={clsx("relative inline-flex shrink-0 overflow-hidden", sizeClass, className)}
      aria-label="GFS Variemix Brasil"
    >
      <Image
        src="/brand/gfs-logo.jpeg"
        alt="GFS Variemix Brasil"
        fill
        sizes={variant === "hero" ? "(min-width: 768px) 410px, 300px" : "(min-width: 768px) 166px, 142px"}
        priority={priority}
        className="object-cover"
      />
    </Link>
  );
}
