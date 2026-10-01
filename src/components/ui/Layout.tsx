import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** 1440px page column with the fluid 50px gutter. */
export function Container({ className, children, ...rest }: { className?: string; children: ReactNode } & ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-gutter", className)} {...rest}>
      {children}
    </div>
  );
}

/** Full-width cream surface used by the "about" and "FAQ" blocks. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("bg-cream px-panel-x pt-panel text-ink", className)}>{children}</div>;
}

/** "from 500€" chip. */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-block bg-paper/30 px-[10px] py-[5px] text-sub font-semibold", className)}>{children}</span>;
}
