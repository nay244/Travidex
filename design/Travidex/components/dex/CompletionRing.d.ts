import * as React from "react";

export interface CompletionRingProps {
  found?: number;
  total?: number;
  size?: number;
  stroke?: number;
  /** Custom center content (flag, count). Defaults to percentage. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Circular completion ring. Green=claimed, amber=partial, dim=untouched. Spring fill. */
export function CompletionRing(props: CompletionRingProps): JSX.Element;
