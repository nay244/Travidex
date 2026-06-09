import * as React from "react";

export interface SightPinProps {
  /** found = bright green, unseen = dim. */
  state?: "found" | "unseen";
  /** Optional dex number rendered in the pin. */
  dexNo?: number | string;
  /** Enlarged amber selected state (synced with a focused dex row). */
  selected?: boolean;
  /** When > 1, renders a cluster count bubble instead. */
  cluster?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/** Map marker for a sight. Bright green = found, dim = unseen, amber+enlarged = selected. */
export function SightPin(props: SightPinProps): JSX.Element;
