import { Fragment } from "react";
import { Circle, Path, Text as SvgText } from "react-native-svg";

import { gateBodyPath, gateBubble, gateLabel } from "./gatePaths";
import { GateKind } from "./layout";

interface GateGlyphProps {
  kind: GateKind;
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  fill: string;
  opacity: number;
  showLabel: boolean;
  strokeWidth?: number;
}

export const GateGlyph = ({
  kind,
  x,
  y,
  w,
  h,
  stroke,
  fill,
  opacity,
  showLabel,
  strokeWidth = 2,
}: GateGlyphProps) => {
  const bubble = gateBubble(kind, x, y, w, h);
  const label = showLabel ? gateLabel(kind, x, y, w) : null;

  return (
    <Fragment>
      <Path
        d={gateBodyPath(kind, x, y, w, h)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
      />
      {bubble && (
        <Circle
          cx={bubble.cx}
          cy={bubble.cy}
          r={bubble.r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      )}
      {label && (
        <SvgText
          x={label.x}
          y={label.y}
          fontSize={label.size}
          fontWeight="800"
          fill={stroke}
          textAnchor="middle"
          opacity={opacity}
        >
          {label.text}
        </SvgText>
      )}
    </Fragment>
  );
};
