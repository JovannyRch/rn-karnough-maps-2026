import { useMemo } from "react";
import useStore from "../store";
import { buildRotatedMap } from "../utils/rotationMapping";

const useSquares = () => {
  const { values, variableQuantity, variableRotation } = useStore();

  const getValue = (index: number) => {
    if (values[index] !== "X") return Number(values[index]);
    return values[index];
  };

  const squares = useMemo(() => {
    const rotatedMap = buildRotatedMap(variableQuantity, variableRotation);

    return rotatedMap.rowLabels.map((rowLabel, rowIndex) =>
      rotatedMap.colLabels.map((colLabel, colIndex) => {
        const index = rotatedMap.indexGrid[rowIndex][colIndex];
        return [getValue(index), colLabel, rowLabel];
      }),
    );
  }, [values, variableQuantity, variableRotation]);

  return squares;
};

export default useSquares;
