import { Fragment } from "react";
import { Circle, Path, Text as SvgText } from "react-native-svg";

import { bubbleRadius, GateKind } from "./layout";

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

const andPath = (x: number, y: number, w: number, h: number): string => {
  const r = h / 2;
  return [
    `M ${x} ${y - r}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + r}`,
    `H ${x}`,
    "Z",
  ].join(" ");
};

const orPath = (x: number, y: number, w: number, h: number): string => {
  const top = y - h / 2;
  const bottom = y + h / 2;
  return [
    `M ${x} ${top}`,
    `Q ${x + w * 0.62} ${top} ${x + w} ${y}`,
    `Q ${x + w * 0.62} ${bottom} ${x} ${bottom}`,
    `Q ${x + w * 0.3} ${y} ${x} ${top}`,
    "Z",
  ].join(" ");
};

const notPath = (x: number, y: number, w: number, h: number): string =>
  `M ${x} ${y - h / 2} L ${x} ${y + h / 2} L ${x + w} ${y} Z`;

const GATE_TEXT: Record<GateKind, string> = {
  and: "AND",
  or: "OR",
  nand: "NAND",
  nor: "NOR",
  not: "NOT",
};

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
  const path =
    kind === "and" || kind === "nand"
      ? andPath(x, y, w, h)
      : kind === "not"
        ? notPath(x, y, w, h)
        : orPath(x, y, w, h);

  const hasBubble = kind === "nand" || kind === "nor" || kind === "not";
  const r = bubbleRadius(h);
  const labelText = GATE_TEXT[kind];
  const labelSize = labelText.length > 3 ? 8.5 : 9.5;
  const labelX = kind === "or" || kind === "nor" ? x + w * 0.46 : x + w * 0.44;

  return (
    <Fragment>
      <Path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        opacity={opacity}
      />
      {hasBubble && (
        <Circle
          cx={x + w + r}
          cy={y}
          r={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      )}
      {showLabel && kind !== "not" && (
        <SvgText
          x={labelX}
          y={y + labelSize * 0.36}
          fontSize={labelSize}
          fontWeight="800"
          fill={stroke}
          textAnchor="middle"
          opacity={opacity}
        >
          {labelText}
        </SvgText>
      )}
    </Fragment>
  );
};
