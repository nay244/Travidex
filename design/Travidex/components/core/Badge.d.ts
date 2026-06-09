import * as React from "react";

export interface BadgeProps {
  /** Color semantic. */
  tone?: "found" | "progress" | "info" | "neutral" | "danger";
  /** Uppercase mono label. */
  label: string;
  /** Show a leading status dot. */
  dot?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Small uppercase status pill. Submission status: Pending=progress, Approved=found, Rejected=danger. */
export function Badge(props: BadgeProps): JSX.Element;

export interface CountBadgeProps {
  count: number;
  max?: number;
  style?: React.CSSProperties;
}

/** Numeric notification badge (amber) — tab bar / feed counts. */
export function CountBadge(props: CountBadgeProps): JSX.Element;
