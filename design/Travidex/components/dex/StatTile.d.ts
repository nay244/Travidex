import * as React from "react";

export interface StatTileProps {
  icon?: React.ReactNode;
  /** Mono value (string or number). */
  value: React.ReactNode;
  /** Uppercase mono label. */
  label: string;
  tone?: "neutral" | "found" | "info" | "progress";
  style?: React.CSSProperties;
}

/** Icon + mono value + label tile. Use in a row of 3 (stat strips) or a Profile grid. */
export function StatTile(props: StatTileProps): JSX.Element;
