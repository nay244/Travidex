import * as React from "react";

export interface SightRowProps {
  name: string;
  /** Dex number — rendered zero-padded as #017. */
  dexNo?: number | string;
  /** Reference thumbnail URL (shown full for found). Unfound renders a hollow box. */
  thumb?: string;
  /** Found = full-color thumb; unfound = hollow outlined box with a faint glyph. */
  found?: boolean;
  /** Mono distance, e.g. "1.2 km" (location-on). */
  distance?: string;
  /** Status text when no distance (location-off / planning). */
  status?: string;
  /** Type tags shown as a fallback meta line. */
  types?: string[];
  /** Highlight for pin⇄row focus sync / current selection. */
  selected?: boolean;
  /** Tapping the row body — selects the sight (enables the Log-find stamp). */
  onClick?: () => void;
  /** The right-side "see more" chevron — opens the entry detail. */
  onSeeMore?: () => void;
  style?: React.CSSProperties;
}

/**
 * Dex list row: thumbnail (found=full / unfound=hollow), dex #, name, distance/status,
 * and a "see more" chevron. Row tap selects; chevron opens detail.
 * @startingPoint section="Dex" subtitle="Sight list row (found / unfound)" viewport="360x72"
 */
export function SightRow(props: SightRowProps): JSX.Element;
