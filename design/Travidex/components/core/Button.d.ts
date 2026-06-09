import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. primary = amber (Log find / Find), positive = green (Navigate/confirm), secondary = neutral, ghost = transparent. */
  variant?: "primary" | "positive" | "secondary" | "ghost";
  /** Control height. */
  size?: "md" | "sm";
  /** Stretch to container width. */
  full?: boolean;
  disabled?: boolean;
  /** Show a spinner and block interaction. */
  loading?: boolean;
  /** Leading icon node (e.g. a Lucide glyph). */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Primary tappable action. Amber `primary` is reserved for the Log/Find action;
 * green `positive` for Navigate/confirm-go. Never use two filled buttons of the
 * same color side by side — pair a filled action with `secondary`.
 *
 * @startingPoint section="Core" subtitle="Action button — amber/green/neutral" viewport="320x80"
 */
export function Button(props: ButtonProps): JSX.Element;
