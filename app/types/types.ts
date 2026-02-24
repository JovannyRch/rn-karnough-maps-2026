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
