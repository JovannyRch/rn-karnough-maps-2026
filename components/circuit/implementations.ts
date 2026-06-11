import {
  CircuitScene,
  gateInputX,
  gateOutputX,
  SceneGate,
  SceneJunction,
  SceneLabel,
  SceneWire,
} from "./layout";

const PRIME = "′";

type TruthValue = "0" | "1" | "X";

/**
 * Rebuild the truth table in DISPLAY variable order (variables[0] = MSB).
 * `values` is indexed by canonical minterm (base variable order A..E); the
 * rotation maps display positions back to canonical ones, mirroring
 * rotationMapping.toCanonicalIndex.
 */
export const buildTruthTable = (
  values: string[],
  variableQuantity: number,
  variableRotation: number,
): TruthValue[] => {
  const n = variableQuantity;
  const rotation = ((variableRotation % n) + n) % n;

  return Array.from({ length: 2 ** n }, (_, displayIndex) => {
    let canonical = 0;
    for (let p = 0; p < n; p++) {
      const displayPos = (p - rotation + n) % n;
      const bit = (displayIndex >> (n - 1 - displayPos)) & 1;
      canonical = (canonical << 1) | bit;
    }
    const raw = values[canonical];
    return raw === "1" ? "1" : raw === "X" ? "X" : "0";
  });
};

/**
 * Data input for one select combination of the 2^(n-1):1 MUX. `low`/`high`
 * are F with the data variable at 0/1; don't-cares resolve toward constants.
 */
export const muxDataInput = (
  low: TruthValue,
  high: TruthValue,
  dataVariable: string,
): string => {
  const lowIsZeroish = low === "0" || low === "X";
  const highIsZeroish = high === "0" || high === "X";
  const lowIsOneish = low === "1" || low === "X";
  const highIsOneish = high === "1" || high === "X";

  if (lowIsZeroish && highIsZeroish) {
    return "0";
  }
  if (lowIsOneish && highIsOneish) {
    return "1";
  }
  return low === "0" ? dataVariable : `${dataVariable}${PRIME}`;
};

const roundedRectPath = (x: number, y: number, w: number, h: number) => {
  const r = 8;
  return [
    `M ${x + r} ${y}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V ${y + h - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
};

const spread = (count: number, centerY: number, spacing: number) => {
  const total = (count - 1) * spacing;
  const start = centerY - total / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
};

export const buildMuxScene = (
  values: string[],
  variableQuantity: number,
  variableRotation: number,
  variables: string[],
): CircuitScene | null => {
  const n = variableQuantity;
  if (n < 2 || variables.length < n) {
    return null;
  }

  const table = buildTruthTable(values, n, variableRotation);
  const selects = variables.slice(0, n - 1);
  const dataVariable = variables[n - 1];
  const dataCount = 2 ** (n - 1);

  const dataLabels = Array.from({ length: dataCount }, (_, j) =>
    muxDataInput(table[j * 2], table[j * 2 + 1], dataVariable),
  );

  const wires: SceneWire[] = [];
  const labels: SceneLabel[] = [];
  const junctions: SceneJunction[] = [];

  const maxLabelLen = Math.max(...dataLabels.map((label) => label.length));
  const pinSpacing = 16;
  const muxX = 14 + maxLabelLen * 8 + 26;
  const muxW = Math.max(62, selects.length * 28);
  const slant = 12;
  const muxTop = 24;
  const muxH = Math.max(dataCount * pinSpacing + 16, 64);
  const muxBottom = muxTop + muxH;
  const centerY = (muxTop + muxBottom) / 2;

  const boxPath = [
    `M ${muxX} ${muxTop}`,
    `L ${muxX + muxW} ${muxTop + slant}`,
    `L ${muxX + muxW} ${muxBottom - slant}`,
    `L ${muxX} ${muxBottom}`,
    "Z",
  ].join(" ");

  const pinYs = spread(dataCount, centerY, pinSpacing);
  dataLabels.forEach((label, j) => {
    const pinY = pinYs[j];
    labels.push({
      x: muxX - 24,
      y: pinY + 3.5,
      text: label,
      size: 10.5,
      weight: "800",
      termIndex: null,
      anchor: "end",
    });
    wires.push({
      x1: muxX - 20,
      y1: pinY,
      x2: muxX,
      y2: pinY,
      termIndex: null,
      emphasis: true,
    });
    labels.push({
      x: muxX + 5,
      y: pinY + 2.8,
      text: String(j),
      size: 7.5,
      weight: "700",
      termIndex: null,
      anchor: "start",
    });
  });

  labels.push({
    x: muxX + muxW / 2 + 4,
    y: centerY - 2,
    text: "MUX",
    size: 10,
    weight: "900",
    termIndex: null,
    anchor: "middle",
  });
  labels.push({
    x: muxX + muxW / 2 + 4,
    y: centerY + 11,
    text: `${dataCount}:1`,
    size: 8.5,
    weight: "700",
    termIndex: null,
    anchor: "middle",
  });

  // Select lines leave the slanted bottom edge.
  const stackSelectLabels = selects.length > 2;
  selects.forEach((name, i) => {
    const sx = muxX + (muxW * (i + 1)) / (selects.length + 1);
    const t = (sx - muxX) / muxW;
    const edgeY = muxBottom - slant * t;
    const dropY = muxBottom + 14 + (stackSelectLabels ? (i % 2) * 11 : 0);

    wires.push({
      x1: sx,
      y1: edgeY,
      x2: sx,
      y2: dropY,
      termIndex: null,
      emphasis: true,
    });
    labels.push({
      x: sx,
      y: dropY + 11,
      text: name,
      size: 10,
      weight: "800",
      termIndex: null,
      anchor: "middle",
    });
  });

  const outX = muxX + muxW + 44;
  wires.push({
    x1: muxX + muxW,
    y1: centerY,
    x2: outX,
    y2: centerY,
    termIndex: null,
    emphasis: true,
  });
  junctions.push({ x: outX, y: centerY, termIndex: null, r: 3.8 });
  labels.push({
    x: outX + 9,
    y: centerY + 4.5,
    text: "F",
    size: 13,
    weight: "900",
    termIndex: null,
    anchor: "start",
  });

  return {
    width: outX + 28,
    height: muxBottom + 14 + (stackSelectLabels ? 22 : 11) + 14,
    wires,
    gates: [],
    junctions,
    labels,
    hits: [],
    boxes: [{ d: boxPath }],
    stats: {
      gates: 1,
      inputs: dataCount + selects.length,
      inverters: 0,
      levels: 1,
    },
  };
};

export const buildDecoderScene = (
  values: string[],
  variableQuantity: number,
  variableRotation: number,
  variables: string[],
): CircuitScene | null => {
  const n = variableQuantity;
  if (n < 2 || variables.length < n) {
    return null;
  }

  const table = buildTruthTable(values, n, variableRotation);
  const minterms = table
    .map((value, index) => ({ value, index }))
    .filter((item) => item.value === "1")
    .map((item) => item.index);

  if (minterms.length === 0) {
    return null;
  }

  const outCount = 2 ** n;
  const wires: SceneWire[] = [];
  const labels: SceneLabel[] = [];
  const junctions: SceneJunction[] = [];
  const gates: SceneGate[] = [];

  const maxVarLen = Math.max(...variables.map((name) => name.length));
  const decX = 14 + maxVarLen * 8 + 24;
  const decW = 66;
  const pinSpacing = 13;
  const decTop = 24;
  const decH = Math.max(outCount * pinSpacing + 14, n * 18 + 30);
  const decBottom = decTop + decH;
  const decCenterY = (decTop + decBottom) / 2;
  const decRight = decX + decW;

  // Inputs (display order, MSB first).
  const inYs = spread(n, decCenterY, 18);
  variables.slice(0, n).forEach((name, i) => {
    labels.push({
      x: decX - 24,
      y: inYs[i] + 3.5,
      text: name,
      size: 10.5,
      weight: "800",
      termIndex: null,
      anchor: "end",
    });
    wires.push({
      x1: decX - 20,
      y1: inYs[i],
      x2: decX,
      y2: inYs[i],
      termIndex: null,
      emphasis: true,
    });
  });

  labels.push({
    x: decX + 18,
    y: decCenterY - 2,
    text: "DEC",
    size: 10,
    weight: "900",
    termIndex: null,
    anchor: "middle",
  });
  labels.push({
    x: decX + 18,
    y: decCenterY + 11,
    text: `${n}:${outCount}`,
    size: 8.5,
    weight: "700",
    termIndex: null,
    anchor: "middle",
  });

  // Outputs: stubs for all, full routing for used minterms.
  const outYs = spread(outCount, decCenterY, pinSpacing);
  outYs.forEach((y, index) => {
    labels.push({
      x: decRight - 5,
      y: y + 2.8,
      text: String(index),
      size: 7.5,
      weight: "700",
      termIndex: null,
      anchor: "end",
    });
    if (!minterms.includes(index)) {
      wires.push({
        x1: decRight,
        y1: y,
        x2: decRight + 8,
        y2: y,
        termIndex: null,
      });
    }
  });

  const usedYs = minterms.map((index) => outYs[index]);
  const orCenterY = usedYs.reduce((acc, y) => acc + y, 0) / usedYs.length;

  let outputX: number;
  let outputY: number;

  if (minterms.length === 1) {
    // Single minterm: the decoder output IS F.
    outputX = decRight + 64;
    outputY = usedYs[0];
    wires.push({
      x1: decRight,
      y1: outputY,
      x2: outputX,
      y2: outputY,
      termIndex: null,
      emphasis: true,
    });
  } else {
    const count = minterms.length;
    const centerIdx = (count - 1) / 2;
    const ranks = usedYs.map(
      (_, idx) => Math.ceil(centerIdx) - Math.round(Math.abs(idx - centerIdx)),
    );
    const maxRank = Math.max(...ranks);
    const laneStep = 9;

    const orX = decRight + 38 + maxRank * laneStep;
    const orW = 62;
    const orPinSpacing = Math.max(10, Math.min(14, (decH - 20) / count));
    const orH = Math.max(40, count * orPinSpacing + 12);
    const orInX = gateInputX("or", orX, orW);
    const orPinYs = spread(count, orCenterY, orPinSpacing);

    usedYs.forEach((y, idx) => {
      const pinY = orPinYs[idx];
      const laneX = Math.max(decRight + 10, orX - 18 - ranks[idx] * laneStep);

      wires.push({
        x1: decRight,
        y1: y,
        x2: laneX,
        y2: y,
        termIndex: null,
        emphasis: true,
      });
      if (y !== pinY) {
        wires.push({
          x1: laneX,
          y1: y,
          x2: laneX,
          y2: pinY,
          termIndex: null,
          emphasis: true,
        });
      }
      wires.push({
        x1: laneX,
        y1: pinY,
        x2: orInX,
        y2: pinY,
        termIndex: null,
        emphasis: true,
      });
    });

    gates.push({
      kind: "or",
      x: orX,
      y: orCenterY,
      w: orW,
      h: orH,
      termIndex: null,
      showLabel: true,
    });

    const orOutX = gateOutputX("or", orX, orW, orH);
    outputX = orOutX + 34;
    outputY = orCenterY;
    wires.push({
      x1: orOutX,
      y1: orCenterY,
      x2: outputX,
      y2: orCenterY,
      termIndex: null,
      emphasis: true,
    });
  }

  junctions.push({ x: outputX, y: outputY, termIndex: null, r: 3.8 });
  labels.push({
    x: outputX + 9,
    y: outputY + 4.5,
    text: "F",
    size: 13,
    weight: "900",
    termIndex: null,
    anchor: "start",
  });

  return {
    width: outputX + 28,
    height: decBottom + 18,
    wires,
    gates,
    junctions,
    labels,
    hits: [],
    boxes: [{ d: roundedRectPath(decX, decTop, decW, decH) }],
    stats: {
      gates: minterms.length === 1 ? 1 : 2,
      inputs: n + (minterms.length === 1 ? 0 : minterms.length),
      inverters: 0,
      levels: minterms.length === 1 ? 1 : 2,
    },
  };
};
