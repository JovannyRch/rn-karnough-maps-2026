import { buildRotatedMap } from "@/app/utils/rotationMapping";

interface BoxColorLike {
  row: number;
  column: number;
  style: Record<string, unknown>;
}

interface GroupColorLookupInput {
  variableQuantity: number;
  variableRotation: number;
  boxColors: BoxColorLike[];
}

export const buildGroupColorsByMinterm = ({
  variableQuantity,
  variableRotation,
  boxColors,
}: GroupColorLookupInput): Map<number, string[]> => {
  const rotatedMap = buildRotatedMap(variableQuantity, variableRotation);
  const mintermByCell = new Map<string, number>();

  rotatedMap.indexGrid.forEach((row, rowIndex) => {
    row.forEach((index, columnIndex) => {
      mintermByCell.set(`${rowIndex}-${columnIndex}`, index);
    });
  });

  const groupColorsByMinterm = new Map<number, string[]>();
  boxColors.forEach((item) => {
    const color =
      typeof item.style.borderColor === "string" ? item.style.borderColor : null;
    if (!color) {
      return;
    }

    const minterm = mintermByCell.get(`${item.row}-${item.column}`);
    if (typeof minterm !== "number") {
      return;
    }

    const current = groupColorsByMinterm.get(minterm) ?? [];
    if (!current.includes(color)) {
      current.push(color);
      groupColorsByMinterm.set(minterm, current);
    }
  });

  return groupColorsByMinterm;
};
