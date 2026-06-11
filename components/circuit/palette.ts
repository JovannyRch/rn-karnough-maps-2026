import { DUO } from "@/constants/duoTheme";

// Single source for circuit drawing colors, shared by the native renderer
// (CircuitDiagram) and the SVG serializer (sceneToSvg) so app and PDF match.
export const CIRCUIT_INK = DUO.slate;
export const CIRCUIT_RAIL = "#9AAFA0";
export const CIRCUIT_GATE_FILL = DUO.white;
