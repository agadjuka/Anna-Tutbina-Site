"use client";

import { useCallback } from "react";
import { useReviewsExpand } from "@/components/sections/reviews-expand-context";
import { FitOneLineActionLabel } from "@/components/sections/fit-one-line-action-label";
import {
  reviewActionButtonClass,
  reviewActionIconClass,
} from "@/components/sections/review-action-button-styles";

function scrollReviewsSectionIntoView() {
  const el = document.getElementById("reviews");
  if (!el) return;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: reduced ? "auto" : "smooth",
    block: "start",
  });
}

export function ReviewsCollapseBar() {
  const { allExpanded, collapseAll } = useReviewsExpand();

  const handleCollapse = useCallback(() => {
    collapseAll();
    requestAnimationFrame(() => {
      scrollReviewsSectionIntoView();
    });
  }, [collapseAll]);

  if (!allExpanded) return null;

  return (
    <div className="mt-6 flex w-full min-w-0 justify-center md:mt-8">
      <button type="button" onClick={handleCollapse} className={reviewActionButtonClass}>
        <FitOneLineActionLabel>Свернуть</FitOneLineActionLabel>
        <svg
          className={reviewActionIconClass}
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
