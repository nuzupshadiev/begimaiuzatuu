/**
 * Line-drawn icons that echo the botanical engravings in the template's
 * ornament sheets. All are decorative, so every one is `aria-hidden`.
 */
import type { ScheduleIcon } from "@/data/template-content";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A small sprig used as a divider between blocks. */
export function SprigIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
      <path d="M12 21V6" />
      <path d="M12 9c-1.6 0-3-1.2-3-2.9 1.7 0 3 1.2 3 2.9Z" />
      <path d="M12 9c1.6 0 3-1.2 3-2.9-1.7 0-3 1.2-3 2.9Z" />
      <path d="M12 14c-1.9 0-3.4-1.4-3.4-3.3 1.9 0 3.4 1.4 3.4 3.3Z" />
      <path d="M12 14c1.9 0 3.4-1.4 3.4-3.3-1.9 0-3.4 1.4-3.4 3.3Z" />
      <circle cx="12" cy="4" r="1.6" />
    </svg>
  );
}

export function ScheduleIconGlyph({ name }: { name: ScheduleIcon }) {
  switch (name) {
    case "gate":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <path d="M5 21V9a7 7 0 0 1 14 0v12" />
          <path d="M12 21V4" />
          <path d="M8.5 21v-9" />
          <path d="M15.5 21v-9" />
        </svg>
      );
    case "bloom":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <circle cx="12" cy="9" r="2.2" />
          <path d="M12 6.8c0-2 1.3-3.3 3-3.3 0 1.9-1.2 3.3-3 3.3Z" />
          <path d="M12 6.8c0-2-1.3-3.3-3-3.3 0 1.9 1.2 3.3 3 3.3Z" />
          <path d="M14.2 9c1.9-.5 3.5.3 4 2-1.8.5-3.4-.3-4-2Z" />
          <path d="M9.8 9c-1.9-.5-3.5.3-4 2 1.8.5 3.4-.3 4-2Z" />
          <path d="M12 11.2V21" />
        </svg>
      );
    case "dove":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <path d="M3 13c3.4.6 6-.6 7.8-3.6" />
          <path d="M10.8 9.4c1.4-2.2 3.6-3 6.2-2.3 2 .6 3.3 2.2 4 4.7-2.3 1-4 .9-5.2-.4" />
          <path d="M15.8 11.4c-.4 3.6-2.6 5.8-6.6 6.6-1.7.3-3.4.1-5.2-.6" />
          <circle cx="17.4" cy="8.2" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "feast":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <path d="M4 12h16a8 6 0 0 1-16 0Z" />
          <path d="M9.5 19.5h5" />
          <path d="M9 9.5c-1-1.2 1-2.3 0-3.5" />
          <path d="M12 9.5c-1-1.2 1-2.3 0-3.5" />
          <path d="M15 9.5c-1-1.2 1-2.3 0-3.5" />
        </svg>
      );
    case "dance":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <path d="M12 20.5S4.8 16 4.8 10.6A3.8 3.8 0 0 1 12 8.9a3.8 3.8 0 0 1 7.2 1.7c0 5.4-7.2 9.9-7.2 9.9Z" />
        </svg>
      );
    case "lantern":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" {...strokeProps}>
          <path d="M12 3v2" />
          <path d="M8 8h8l1.5 8.5A5.5 5.5 0 0 1 12 21a5.5 5.5 0 0 1-5.5-4.5Z" />
          <path d="M9.5 5.5h5V8h-5z" />
          <path d="M12 12v4" />
        </svg>
      );
  }
}
