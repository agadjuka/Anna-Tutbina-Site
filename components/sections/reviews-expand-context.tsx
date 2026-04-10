"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ReviewsExpandContextValue = {
  allExpanded: boolean;
  expandAll: () => void;
  collapseAll: () => void;
};

const ReviewsExpandContext = createContext<ReviewsExpandContextValue | null>(null);

export function ReviewsExpandProvider({ children }: { children: ReactNode }) {
  const [allExpanded, setAllExpanded] = useState(false);
  const expandAll = useCallback(() => setAllExpanded(true), []);
  const collapseAll = useCallback(() => setAllExpanded(false), []);

  const value = useMemo(
    () => ({ allExpanded, expandAll, collapseAll }),
    [allExpanded, expandAll, collapseAll]
  );

  return (
    <ReviewsExpandContext.Provider value={value}>{children}</ReviewsExpandContext.Provider>
  );
}

export function useReviewsExpand(): ReviewsExpandContextValue {
  const ctx = useContext(ReviewsExpandContext);
  if (!ctx) {
    throw new Error("useReviewsExpand must be used within ReviewsExpandProvider");
  }
  return ctx;
}
