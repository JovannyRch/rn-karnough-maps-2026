const BASE_VARIABLES = ["A", "B", "C", "D"] as const;

export const getRotatedVariables = (
  variableQuantity: number,
  variableRotation: number
) => {
  const base = BASE_VARIABLES.slice(0, variableQuantity);
  const safeRotation =
    ((variableRotation % variableQuantity) + variableQuantity) % variableQuantity;

  return base.map((_, index) => base[(index + safeRotation) % variableQuantity]);
};

const getGrayLabels = (bitCount: number) => {
  if (bitCount <= 0) {
    return [""];
  }

  if (bitCount === 1) {
    return ["0", "1"];
  }

  if (bitCount === 2) {
    return ["00", "01", "11", "10"];
  }

  return [];
};

const getAxisBits = (variableQuantity: number) => {
  if (variableQuantity === 2) {
    return { colBits: 1, rowBits: 1 };
  }

  if (variableQuantity === 3) {
    return { colBits: 2, rowBits: 1 };
  }

  return { colBits: 2, rowBits: 2 };
};

const toCanonicalIndex = (
  variableQuantity: number,
  rotatedVariables: string[],
  displayBits: string
) => {
  const bitByVariable = new Map<string, string>();
  for (let i = 0; i < rotatedVariables.length; i++) {
    bitByVariable.set(rotatedVariables[i], displayBits[i] ?? "0");
  }

  const canonicalBits = BASE_VARIABLES.slice(0, variableQuantity)
    .map((variable) => bitByVariable.get(variable) ?? "0")
    .join("");

  return parseInt(canonicalBits, 2);
};

export const buildRotatedMap = (
  variableQuantity: number,
  variableRotation: number
) => {
  const rotatedVariables = getRotatedVariables(variableQuantity, variableRotation);
  const { colBits, rowBits } = getAxisBits(variableQuantity);

  const colLabels = getGrayLabels(colBits);
  const rowLabels = getGrayLabels(rowBits);

  const indexGrid = rowLabels.map((rowLabel) =>
    colLabels.map((colLabel) => {
      const displayBits = `${colLabel}${rowLabel}`;
      return toCanonicalIndex(variableQuantity, rotatedVariables, displayBits);
    })
  );

  return {
    rotatedVariables,
    colLabels,
    rowLabels,
    indexGrid,
  };
};
