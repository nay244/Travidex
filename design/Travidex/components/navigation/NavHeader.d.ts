import * as React from "react";

export interface NavHeaderProps {
  title?: string;
  /** Show a leading control + handler. Omit for no leading control. */
  onBack?: () => void;
  /** back = chevron, close = ✕. */
  mode?: "back" | "close";
  backIcon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  /** Right-aligned action slot (icon button, etc.). */
  right?: React.ReactNode;
  /** Transparent over hero/map — leading control gets a glass chip. */
  transparent?: boolean;
  style?: React.CSSProperties;
}

/** Top navigation bar: centered title, optional back/close, right action slot. */
export function NavHeader(props: NavHeaderProps): JSX.Element;
