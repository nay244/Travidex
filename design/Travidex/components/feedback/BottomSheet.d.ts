import * as React from "react";

export interface SnapPoints {
  /** px of sheet visible when peeking. */
  peek: number;
  /** fraction (0–1) of parent height visible at half. */
  half: number;
  /** fraction (0–1) visible at full. */
  full: number;
}

export interface BottomSheetProps {
  /** Controlled snap point. */
  snap?: "peek" | "half" | "full";
  /** Called with the nearest snap point after a drag. */
  onSnap?: (snap: "peek" | "half" | "full") => void;
  /** Fixed header content under the drag handle (completion bar, search…). */
  header?: React.ReactNode;
  /** Scrollable body. */
  children?: React.ReactNode;
  points?: SnapPoints;
  style?: React.CSSProperties;
}

/**
 * Draggable three-snap-point sheet (peek/half/full). Place inside a relatively-
 * positioned phone frame over the map. Header stays fixed; body scrolls.
 */
export function BottomSheet(props: BottomSheetProps): JSX.Element;
