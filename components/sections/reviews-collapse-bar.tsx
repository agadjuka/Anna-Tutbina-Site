"use client";

import { useReviewsExpand } from "@/components/sections/reviews-expand-context";
import { cn } from "@/lib/utils";

export function ReviewsCollapseBar() {
  const { allExpanded, collapseAll } = useReviewsExpand();

  if (!allExpanded) return null;

  return (
    <div className="mt-6 flex justify-center md:mt-8">
      <button
        type="button"
        onClick={collapseAll}
        className={cn(
          "group/btn inline-flex items-center gap-1.5 rounded-full border border-[#e5e0db] bg-white/80 px-3.5 py-1.5 font-sans text-xs text-muted-foreground transition-colors",
          "hover:border-[#bea692]/35 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bea692]/25 md:text-sm"
        )}
      >
        <span>Свернуть</span>
        <svg
          className="h-3 w-3 shrink-0 text-[#bea692]/70 transition-transform duration-300 group-hover/btn:text-[#bea692]"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M2.5 7.5L6 4l3.5 3.5" />
        </svg>
      </button>
    </div>
  );
}
