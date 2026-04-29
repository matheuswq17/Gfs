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
      ? "w-[300px] md:w-[410px]"
      : variant === "compact"
        ? "w-[116px] md:w-[142px]"
        : "w-[142px] md:w-[166px]";

  return (
    <Link href="/" className={clsx("inline-flex items-center", className)} aria-label="GFS Variemix Brasil">
      <Image
        src="/brand/gfs-logo.svg"
        alt="GFS Variemix Brasil"
        width={684}
        height={372}
        priority={priority}
        className={clsx("h-auto", sizeClass)}
      />
    </Link>
  );
}
