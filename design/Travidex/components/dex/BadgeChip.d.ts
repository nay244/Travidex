import * as React from "react";

export interface BadgeProgress {
  current: number;
  total: number;
}

export interface BadgeChipProps {
  name: string;
  /** Medallion icon node. */
  icon?: React.ReactNode;
  /** Earned = colored + glow; locked = dim + criteria. */
  earned?: boolean;
  /** Criteria text shown when locked (and no progress). */
  criteria?: string;
  /** Progress toward earning (shows a mini bar when locked). */
  progress?: BadgeProgress;
  style?: React.CSSProperties;
}

/** Achievement medallion for the Badges grid. Earned glows amber; locked is dim with criteria/progress. */
export function BadgeChip(props: BadgeChipProps): JSX.Element;
