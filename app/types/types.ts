export type ViewMode = "map" | "table";

export interface Position {
  row: number;
  column: number;
}

export interface BoxColor {
  row: number;
  column: number;
  groupIndex?: number;
  style: any;
}

export interface VectorResultItem {
  value: string;
  groupIndex?: number;
  style: any;
}

/** Per-group explanation data for the step-by-step solve mode. */
export interface GroupStepInfo {
  groupIndex: number;
  termPlain: string;
  termMath: string;
  cellCount: number;
  /** Literals that stay constant across the group, e.g. ["A", "C'"]. */
  fixedLiterals: string[];
  /** Variables that change inside the group and drop out, e.g. ["B"]. */
  eliminatedVariables: string[];
}
