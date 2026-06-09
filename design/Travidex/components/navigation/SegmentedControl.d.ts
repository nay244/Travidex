import * as React from "react";

export interface SegmentOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  /** Either {value,label} objects or plain strings. */
  options: (SegmentOption | string)[];
  value: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** iOS-style segmented pill with a spring-sliding thumb. 2–4 options. */
export function SegmentedControl(props: SegmentedControlProps): JSX.Element;
