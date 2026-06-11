import { memo } from "react";
import Svg, {
  Circle,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";

import { getGroupColor } from "@/constants/groupColors";
import { GateGlyph } from "./gates";
import { CircuitScene } from "./layout";
import {
  CIRCUIT_GATE_FILL as GATE_FILL,
  CIRCUIT_INK as INK,
  CIRCUIT_RAIL as RAIL,
} from "./palette";

interface CircuitDiagramProps {
  scene: CircuitScene;
  selectedTerm: number | null;
  onSelectTerm?: (termIndex: number) => void;
}

const elementOpacity = (
  termIndex: number | null,
  selected: number | null,
): number => {
  if (selected === null) {
    return 1;
  }
  if (termIndex === null) {
    return 0.42;
  }
  return termIndex === selected ? 1 : 0.14;
};

const elementColor = (termIndex: number | null, neutral: string): string =>
  termIndex === null ? neutral : getGroupColor(termIndex);

const CircuitDiagram = ({
  scene,
  selectedTerm,
  onSelectTerm,
}: CircuitDiagramProps) => {
  return (
    <Svg width={scene.width} height={scene.height}>
      {scene.wires.map((wire, idx) => {
        const isSelected =
          selectedTerm !== null && wire.termIndex === selectedTerm;
        return (
          <Line
            key={`w-${idx}`}
            x1={wire.x1}
            y1={wire.y1}
            x2={wire.x2}
            y2={wire.y2}
            stroke={elementColor(
              wire.termIndex,
              wire.termIndex === null && !wire.emphasis ? RAIL : INK,
            )}
            strokeWidth={
              wire.termIndex === null
                ? wire.emphasis
                  ? 2.4
                  : 1.6
                : isSelected
                  ? 3
                  : 2.2
            }
            strokeLinecap="round"
            opacity={elementOpacity(wire.termIndex, selectedTerm)}
          />
        );
      })}

      {scene.boxes.map((box, idx) => (
        <Path
          key={`b-${idx}`}
          d={box.d}
          fill={GATE_FILL}
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
          opacity={selectedTerm === null ? 1 : 0.42}
        />
      ))}

      {scene.gates.map((gate, idx) => (
        <GateGlyph
          key={`g-${idx}`}
          kind={gate.kind}
          x={gate.x}
          y={gate.y}
          w={gate.w}
          h={gate.h}
          stroke={
            gate.termIndex === null ? INK : getGroupColor(gate.termIndex)
          }
          fill={GATE_FILL}
          opacity={elementOpacity(gate.termIndex, selectedTerm)}
          showLabel={gate.showLabel}
          strokeWidth={
            selectedTerm !== null && gate.termIndex === selectedTerm ? 2.6 : 2
          }
        />
      ))}

      {scene.junctions.map((junction, idx) => (
        <Circle
          key={`j-${idx}`}
          cx={junction.x}
          cy={junction.y}
          r={junction.r ?? 3}
          fill={elementColor(junction.termIndex, INK)}
          opacity={elementOpacity(junction.termIndex, selectedTerm)}
        />
      ))}

      {scene.labels.map((label, idx) => (
        <SvgText
          key={`t-${idx}`}
          x={label.x}
          y={label.y}
          fontSize={label.size}
          fontWeight={label.weight}
          fill={elementColor(label.termIndex, INK)}
          textAnchor={label.anchor}
          opacity={elementOpacity(label.termIndex, selectedTerm)}
        >
          {label.text}
        </SvgText>
      ))}

      {onSelectTerm &&
        scene.hits.map((hit) => (
          <Rect
            key={`h-${hit.termIndex}`}
            x={hit.x}
            y={hit.y}
            width={hit.w}
            height={hit.h}
            fill="transparent"
            onPress={() => onSelectTerm(hit.termIndex)}
          />
        ))}
    </Svg>
  );
};

export default memo(CircuitDiagram);
