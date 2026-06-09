import * as React from "react";

export interface TabItem {
  id: string;
  label: string;
  /** Icon name passed to renderIcon (e.g. a Lucide name). */
  icon: string;
  /** Marks the raised center stamp action (Log find). */
  center?: boolean;
}

export interface TabBarProps {
  /** Defaults to the five Travidex tabs. */
  tabs?: TabItem[];
  /** Id of the active tab. */
  active: string;
  onChange?: (id: string) => void;
  /** Called when the (enabled) center stamp button is tapped. */
  onFind?: () => void;
  /** Enables the center stamp button (amber/active). Off = grey/disabled until a sight is selected. */
  findEnabled?: boolean;
  /** Host-supplied icon renderer: (name, active) => ReactNode. */
  renderIcon?: (name: string, active: boolean) => React.ReactNode;
}

/**
 * Five-tab bottom navigation with a raised center STAMP action (Log find).
 * The stamp is disabled (grey) until a sight is selected, then amber/active.
 * @startingPoint section="Navigation" subtitle="5-tab bar with stamp Log-find button" viewport="390x90"
 */
export function TabBar(props: TabBarProps): JSX.Element;
