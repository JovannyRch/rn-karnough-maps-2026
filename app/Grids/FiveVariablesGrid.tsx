import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import variablesStyles from "./styles";
import GridBox from "@/components/GridBox";
import DiagonalBox from "./DiagonalBox";
import useStore from "../store";
import { buildRotatedMap } from "../utils/rotationMapping";

// 8 data columns; below ~46px per cell the map becomes hard to tap, so the
// grid keeps a minimum width and scrolls horizontally on narrow screens.
const MIN_CELL_WIDTH = 46;
const LABEL_COLUMN_WIDTH = 50;
const MIN_GRID_WIDTH = LABEL_COLUMN_WIDTH + 8 * MIN_CELL_WIDTH;

export default function FiveVariablesGrid() {
  const { variableRotation, variables } = useStore();
  const vars = variables.slice(0, 5);
  const rotatedMap = buildRotatedMap(5, variableRotation);
  const [containerWidth, setContainerWidth] = useState(0);

  const gridWidth = Math.max(containerWidth, MIN_GRID_WIDTH);

  return (
    <View
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        bounces={false}
      >
        <View style={{ width: gridWidth }}>
          <View style={variablesStyles.row}>
            <View style={variablesStyles.lefColumn}>
              <DiagonalBox
                text1={vars[3] + vars[4]}
                text2={vars[0] + vars[1] + vars[2]}
              />
            </View>
            {rotatedMap.colLabels.map((label) => (
              <View key={`col-${label}`} style={variablesStyles.vars}>
                <Text style={variablesStyles.varText5}>{label}</Text>
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
      </ScrollView>
    </View>
  );
}
