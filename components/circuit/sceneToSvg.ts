import { getGroupColor } from "@/constants/groupColors";
import { gateBodyPath, gateBubble, gateLabel } from "./gatePaths";
import { buildDecoderScene, buildMuxScene } from "./implementations";
import { buildCircuitScene, CircuitScene } from "./layout";
import { CircuitVariant, parseCircuitModel, SolveType } from "./model";

const INK = "#2F4858";
const RAIL = "#9AAFA0";
const GATE_FILL = "#FFFFFF";

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const color = (termIndex: number | null, neutral: string): string =>
  termIndex === null ? neutral : getGroupColor(termIndex);

/**
 * Serialize a circuit scene to a standalone SVG string mirroring
 * CircuitDiagram.tsx, for embedding in generated PDFs.
 */
export const sceneToSvg = (scene: CircuitScene): string => {
  const parts: string[] = [];

  scene.wires.forEach((wire) => {
    const stroke = color(
      wire.termIndex,
      wire.termIndex === null && !wire.emphasis ? RAIL : INK,
    );
    const width = wire.termIndex === null ? (wire.emphasis ? 2.4 : 1.6) : 2.2;
    parts.push(
      `<line x1="${wire.x1}" y1="${wire.y1}" x2="${wire.x2}" y2="${wire.y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" />`,
    );
  });

  scene.boxes.forEach((box) => {
    parts.push(
      `<path d="${box.d}" fill="${GATE_FILL}" stroke="${INK}" stroke-width="2" stroke-linejoin="round" />`,
    );
  });

  scene.gates.forEach((gate) => {
    const stroke = color(gate.termIndex, INK);
    parts.push(
      `<path d="${gateBodyPath(gate.kind, gate.x, gate.y, gate.w, gate.h)}" fill="${GATE_FILL}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round" />`,
    );
    const bubble = gateBubble(gate.kind, gate.x, gate.y, gate.w, gate.h);
    if (bubble) {
      parts.push(
        `<circle cx="${bubble.cx}" cy="${bubble.cy}" r="${bubble.r}" fill="${GATE_FILL}" stroke="${stroke}" stroke-width="2" />`,
      );
    }
    const label = gate.showLabel
      ? gateLabel(gate.kind, gate.x, gate.y, gate.w)
      : null;
    if (label) {
      parts.push(
        `<text x="${label.x}" y="${label.y}" font-size="${label.size}" font-weight="800" fill="${stroke}" text-anchor="middle">${escapeXml(label.text)}</text>`,
      );
    }
  });

  scene.junctions.forEach((junction) => {
    parts.push(
      `<circle cx="${junction.x}" cy="${junction.y}" r="${junction.r ?? 3}" fill="${color(junction.termIndex, INK)}" />`,
    );
  });

  scene.labels.forEach((label) => {
    parts.push(
      `<text x="${label.x}" y="${label.y}" font-size="${label.size}" font-weight="${label.weight}" fill="${color(label.termIndex, INK)}" text-anchor="${label.anchor}">${escapeXml(label.text)}</text>`,
    );
  });

  return [
    `<svg width="${scene.width}" height="${scene.height}" viewBox="0 0 ${scene.width} ${scene.height}" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">`,
    ...parts,
    "</svg>",
  ].join("\n");
};

export interface CircuitSvgInput {
  circuitVector: string[];
  resultType: SolveType;
  variables: string[];
  variant: CircuitVariant;
  compact: boolean;
  values: string[];
  variableQuantity: number;
  variableRotation: number;
}

/**
 * Build the SVG string for the circuit exactly as the app currently shows it.
 * Returns null for constant/empty results (the PDF generator's own card
 * handles those).
 */
export const buildCircuitSvg = (input: CircuitSvgInput): string | null => {
  const model = parseCircuitModel(input.circuitVector, input.resultType);
  if (model.kind !== "network") {
    return null;
  }

  const scene =
    input.variant === "mux"
      ? buildMuxScene(
          input.values,
          input.variableQuantity,
          input.variableRotation,
          input.variables,
        )
      : input.variant === "decoder"
        ? buildDecoderScene(
            input.values,
            input.variableQuantity,
            input.variableRotation,
            input.variables,
          )
        : buildCircuitScene(model, input.variables, input.variant, input.compact);

  return scene ? sceneToSvg(scene) : null;
};
