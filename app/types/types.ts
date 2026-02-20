export type ViewMode = "map" | "table";

export interface Position {
  row: number;
  column: number;
}

export interface BoxColor {
  row: number;
  column: number;
  style: any;
}

export interface VectorResultItem {
  value: string;
  style: any;
}
