import * as React from "react";

export interface ChunkTileProps {
  /** City name (the chunk). */
  city: string;
  /** Region/prefecture label (uppercase mono). */
  region?: string;
  found?: number;
  total?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * A city tile on the country chunk-map. Fill rises from the bottom with completion;
 * claimed (green) at 100%, in-progress (amber) partial, untouched (dim). Always tappable.
 * @startingPoint section="Dex" subtitle="City chunk tile (Tileman board)" viewport="180x180"
 */
export function ChunkTile(props: ChunkTileProps): JSX.Element;
