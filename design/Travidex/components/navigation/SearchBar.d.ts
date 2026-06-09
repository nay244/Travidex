import * as React from "react";

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Leading search glyph from the host icon set. */
  icon?: React.ReactNode;
  onClear?: () => void;
  style?: React.CSSProperties;
}

/** Rounded inset search field with leading glyph + clear button. */
export function SearchBar(props: SearchBarProps): JSX.Element;
