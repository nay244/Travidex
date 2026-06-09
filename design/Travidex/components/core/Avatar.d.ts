import * as React from "react";

export interface AvatarProps {
  /** Image URL. Falls back to initials when absent. */
  src?: string;
  /** Used for initials + alt text. */
  name?: string;
  /** Diameter in px. */
  size?: number;
  /** Show an accent ring (own profile / active). */
  ring?: boolean;
  ringColor?: string;
  style?: React.CSSProperties;
}

/** Circular user avatar — photo or initials fallback, optional accent ring. */
export function Avatar(props: AvatarProps): JSX.Element;
