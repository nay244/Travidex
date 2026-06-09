import * as React from "react";

export interface ToastProps {
  tone?: "success" | "progress" | "info" | "error";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** Optional inline action label. */
  action?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

/** Transient message with an accent edge. success=green, progress=amber, info=blue, error=red. */
export function Toast(props: ToastProps): JSX.Element;
