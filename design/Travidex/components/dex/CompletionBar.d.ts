import * as React from "react";

export interface CompletionBarProps {
  found?: number;
  total?: number;
  /** Uppercase mono label, e.g. "PARIS". */
  label?: string;
  /** Show the found/total count on the right. */
  showCount?: boolean;
  height?: number;
  style?: React.CSSProperties;
}

/** Horizontal completion bar. Green at 100% (claimed), amber partial, dim at 0. */
export function CompletionBar(props: CompletionBarProps): JSX.Element;
