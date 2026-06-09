import * as React from "react";

export interface TypeTagProps {
  /** Category label, sentence case (e.g. "Historic", "Scenic", "Food"). */
  label: string;
  /** Optional leading icon node (small Lucide glyph). */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Blue classification chip for a sight's type tags. Use one per category; keep labels short. */
export function TypeTag(props: TypeTagProps): JSX.Element;
