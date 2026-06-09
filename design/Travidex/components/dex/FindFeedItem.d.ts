import * as React from "react";

export interface FindFeedItemProps {
  user: string;
  sight: string;
  city?: string;
  /** Uppercase mono date/relative time, e.g. "2H AGO". */
  date: string;
  /** Avatar node (defaults to an initial bubble). */
  avatar?: React.ReactNode;
  /** Photo thumb URL. Pass null to show the striped placeholder; omit for no photo. */
  thumb?: string | null;
  liked?: boolean;
  likes?: number;
  comments?: number;
  onClick?: () => void;
  onLike?: () => void;
  style?: React.CSSProperties;
}

/** Community feed entry: "[user] found [sight] · date" with photo + like/comment counts. */
export function FindFeedItem(props: FindFeedItemProps): JSX.Element;
