import { bubbleRadius, GateKind } from "./layout";

/** Shared gate geometry for the native renderer (gates.tsx) and the SVG
 *  string serializer (sceneToSvg.ts) so app and PDF draw identically. */

export const gateBodyPath = (
  kind: GateKind,
  x: number,
  y: number,
  w: number,
  h: number,
): string => {
  if (kind === "and" || kind === "nand") {
    const r = h / 2;
    return [
      `M ${x} ${y - r}`,
      `H ${x + w - r}`,
      `A ${r} ${r} 0 0 1 ${x + w - r} ${y + r}`,
      `H ${x}`,
      "Z",
    ].join(" ");
  }

  if (kind === "not") {
    return `M ${x} ${y - h / 2} L ${x} ${y + h / 2} L ${x + w} ${y} Z`;
  }

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

export const gateHasBubble = (kind: GateKind): boolean =>
  kind === "nand" || kind === "nor" || kind === "not";

export const gateBubble = (
  kind: GateKind,
  x: number,
  y: number,
  w: number,
  h: number,
): { cx: number; cy: number; r: number } | null => {
  if (!gateHasBubble(kind)) {
    return null;
  }
  const r = bubbleRadius(h);
  return { cx: x + w + r, cy: y, r };
};

const GATE_TEXT: Record<GateKind, string> = {
  and: "AND",
  or: "OR",
  nand: "NAND",
  nor: "NOR",
  not: "NOT",
};

export const gateLabel = (
  kind: GateKind,
  x: number,
  y: number,
  w: number,
): { text: string; x: number; y: number; size: number } | null => {
  if (kind === "not") {
    return null;
  }
  const text = GATE_TEXT[kind];
  const size = text.length > 3 ? 8.5 : 9.5;
  return {
    text,
    x: kind === "or" || kind === "nor" ? x + w * 0.46 : x + w * 0.44,
    y: y + size * 0.36,
    size,
  };
};
