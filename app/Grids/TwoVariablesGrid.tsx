import React from "react";
import { View, Text } from "react-native";
import variablesStyles from "./styles";
import GridBox from "@/components/GridBox";
import DiagonalBox from "./DiagonalBox";
import useStore from "../store";
import { buildRotatedMap, getRotatedVariables } from "../utils/rotationMapping";

export default function TwoVariablesGrid() {
  const { variableRotation } = useStore();
  const vars = getRotatedVariables(2, variableRotation);
  const rotatedMap = buildRotatedMap(2, variableRotation);

  return (
    <View>
      <View style={variablesStyles.row}>
        <View style={variablesStyles.lefColumn}>
          <DiagonalBox text1={vars[1]} text2={vars[0]} />
        </View>
        {rotatedMap.colLabels.map((label) => (
          <View key={`col-${label}`} style={variablesStyles.vars}>
            <Text style={variablesStyles.varText}>{label}</Text>
          </View>
        ))}
      </View>
      {rotatedMap.rowLabels.map((rowLabel, row) => (
        <View key={`row-${rowLabel}`} style={variablesStyles.row}>
          <View style={variablesStyles.lefColumn}>
            <Text style={variablesStyles.varText}>{rowLabel}</Text>
          </View>
          {rotatedMap.indexGrid[row].map((index, column) => (
            <GridBox
              key={`cell-${row}-${column}-${index}`}
              index={index}
              row={row}
              column={column}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
