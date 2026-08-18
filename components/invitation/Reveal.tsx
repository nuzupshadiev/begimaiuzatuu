"use client";

import { useCallback, useState, type ReactNode } from "react";

/**
 * Fades a block up as it scrolls into view, the way the reference reveals each
 * section. Content is in the DOM from the first paint, so it stays readable
 * without JavaScript and under `prefers-reduced-motion` (where the stylesheet
 * pins `.reveal` to its visible state).
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: "div" | "section" | "header" | "footer";
  className?: string;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);

  // A ref callback rather than an effect: the observer is attached the moment
  // the node exists and torn down with it, and React 19 runs the returned
  // cleanup on detach.
  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries.some(
          // `bottom <= 0` covers a block the guest jumped past — a restored
          // scroll position or an in-page anchor must never leave text hidden.
          (entry) => entry.isIntersecting || entry.boundingClientRect.bottom <= 0,
        );
        if (shown) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const classes = ["reveal", visible ? "is-visible" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      ref={attach as React.Ref<HTMLDivElement>}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
