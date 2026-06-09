import * as React from "react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  /** Optional action node (usually a Button). */
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Centered empty/zero state. Copy nudges forward, never apologizes. */
export function EmptyState(props: EmptyStateProps): JSX.Element;
