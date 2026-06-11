import {
  CircuitModel,
  CircuitTerm,
  CircuitVariant,
  complementKey,
  formatTermLabel,
  literalKey,
} from "./model";

export type GateKind = "and" | "or" | "nand" | "nor" | "not";

export interface SceneWire {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  termIndex: number | null;
  emphasis?: boolean;
}

export interface SceneGate {
  kind: GateKind;
  /** Left edge of the gate body. */
  x: number;
  /** Vertical center of the gate body. */
  y: number;
  w: number;
  h: number;
  termIndex: number | null;
  showLabel: boolean;
}

export interface SceneJunction {
  x: number;
  y: number;
  termIndex: number | null;
  r?: number;
}

export interface SceneLabel {
  x: number;
  y: number;
  text: string;
  size: number;
  weight: "600" | "700" | "800" | "900";
  termIndex: number | null;
  anchor: "start" | "middle" | "end";
}

export interface SceneHit {
  termIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CircuitStats {
  gates: number;
  inputs: number;
  inverters: number;
  levels: number;
}

/** Free-form component body (MUX trapezoid, decoder rectangle) as an SVG path. */
export interface SceneBox {
  d: string;
}

export interface CircuitScene {
  width: number;
  height: number;
  wires: SceneWire[];
  gates: SceneGate[];
  junctions: SceneJunction[];
  labels: SceneLabel[];
  hits: SceneHit[];
  boxes: SceneBox[];
  stats: CircuitStats;
}

export const bubbleRadius = (gateHeight: number): number =>
  gateHeight < 20 ? 3.2 : 4.5;

const gateHasBubble = (kind: GateKind): boolean =>
  kind === "nand" || kind === "nor" || kind === "not";

export const gateOutputX = (kind: GateKind, x: number, w: number, h: number) =>
  x + w + (gateHasBubble(kind) ? bubbleRadius(h) * 2 : 0);

/** OR-shaped gates have a concave input edge; wires overlap a little and the
 *  gate fill (drawn afterwards) covers the excess. */
export const gateInputX = (kind: GateKind, x: number, w: number): number =>
  kind === "or" || kind === "nor" ? x + Math.min(12, w * 0.2) : x;

const spreadPinYs = (count: number, centerY: number, spacing: number) => {
  if (count <= 1) {
    return [centerY];
  }
  const total = (count - 1) * spacing;
  const start = centerY - total / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
};

interface TermStage {
  term: CircuitTerm;
  /** Rail keys feeding this stage, in literal order (e.g. "A", "B'"). */
  pinKeys: string[];
  /** null = the term is routed as a plain wire (no first-level gate). */
  gate: GateKind | null;
}

interface Network {
  stages: TermStage[];
  finalGate: GateKind | null;
  /** Inverter after the last stage (term gate when there is no final gate,
   *  otherwise after the final gate) that restores F. */
  outputInverter: boolean;
  inverterKind: GateKind;
}

const buildNetwork = (
  model: CircuitModel,
  variant: CircuitVariant,
): Network => {
  const sop = model.resultType === "SOP";
  const singleTerm = model.terms.length === 1;

  if (variant === "standard") {
    const termGate: GateKind = sop ? "and" : "or";
    const stages: TermStage[] = model.terms.map((term) => {
      if (term.literals.length > 1) {
        return { term, pinKeys: term.literals.map(literalKey), gate: termGate };
      }
      return { term, pinKeys: [literalKey(term.literals[0])], gate: null };
    });

    return {
      stages,
      finalGate: singleTerm ? null : sop ? "or" : "and",
      outputInverter: false,
      inverterKind: "not",
    };
  }

  // Universal-gate variants. "Matched" combinations (NAND+SOP, NOR+POS) are
  // the classic two-level conversion; "dual" combinations feed complemented
  // literals into the term gates (De Morgan) and invert the final output.
  const gate: GateKind = variant;
  const matched = (variant === "nand") === sop;
  let outputInverter = false;

  const stages: TermStage[] = model.terms.map((term) => {
    if (term.literals.length > 1) {
      const pinKeys = term.literals.map((literal) =>
        matched ? literalKey(literal) : complementKey(literal),
      );
      if (singleTerm && matched) {
        // F = NAND(NAND(...)) / NOR(NOR(...)): restore F with an inverter.
        outputInverter = true;
      }
      return { term, pinKeys, gate };
    }

    const literal = term.literals[0];

    if (singleTerm) {
      // One 1-input universal gate fed from the complemented rail:
      // F = x -> G(x'), F = x' -> G(x).
      return { term, pinKeys: [complementKey(literal)], gate };
    }

    // Single-literal term feeding the final gate directly. Matched: the
    // inner inversion cancels against the rail, so the complement feeds the
    // final gate. Dual: the stage value is the literal itself.
    return {
      term,
      pinKeys: [matched ? complementKey(literal) : literalKey(literal)],
      gate: null,
    };
  });

  if (!singleTerm && !matched) {
    // Dual final gate produces F'; one more 1-input gate restores F.
    outputInverter = true;
  }

  return {
    stages,
    finalGate: singleTerm ? null : gate,
    outputInverter,
    inverterKind: gate,
  };
};

interface RailSpec {
  key: string;
  label: string;
  variable: string;
  negated: boolean;
  x: number;
  /** Positive rail that only exists to feed its inverter. */
  isStub: boolean;
}

const PRIME = "′";

const pinDisplayLabel = (key: string): string =>
  key.endsWith("'") ? `${key.slice(0, -1)}${PRIME}` : key;

export const buildCircuitScene = (
  model: CircuitModel,
  variableOrder: string[],
  variant: CircuitVariant,
  compact = false,
): CircuitScene | null => {
  if (model.kind !== "network") {
    return null;
  }

  const network = buildNetwork(model, variant);
  const usedKeys = new Set(network.stages.flatMap((stage) => stage.pinKeys));

  // Rail order follows the map's variable order; unknown names (defensive,
  // e.g. stale renames) are appended at the end.
  const namesInTerms = model.terms.flatMap((term) =>
    term.literals.map((literal) => literal.name),
  );
  const orderedNames = [
    ...variableOrder.filter((name) => namesInTerms.includes(name)),
    ...namesInTerms.filter((name) => !variableOrder.includes(name)),
  ].filter((name, index, list) => list.indexOf(name) === index);

  const rails: RailSpec[] = [];
  if (!compact) {
    orderedNames.forEach((name) => {
      const posUsed = usedKeys.has(name);
      const negUsed = usedKeys.has(`${name}'`);
      if (!posUsed && !negUsed) {
        return;
      }
      rails.push({
        key: name,
        label: name,
        variable: name,
        negated: false,
        x: 0,
        isStub: !posUsed,
      });
      if (negUsed) {
        rails.push({
          key: `${name}'`,
          label: `${name}${PRIME}`,
          variable: name,
          negated: true,
          x: 0,
          isStub: false,
        });
      }
    });

    if (rails.length === 0) {
      return null;
    }
  }

  const hasInverters = rails.some((rail) => rail.negated);
  const isUniversal = variant !== "standard";

  const labelBaseY = 16;
  const railsStartY = 23;
  const inverterY = 46;

  let gateX: number;
  let rowsTop: number;
  let lastRailX = 0;

  if (compact) {
    const maxPinLabel = Math.max(
      1,
      ...network.stages.flatMap((stage) =>
        stage.pinKeys.map((key) => pinDisplayLabel(key).length),
      ),
    );
    gateX = 14 + maxPinLabel * 8 + 30;
    rowsTop = 30;
  } else {
    const maxLabelLength = Math.max(...rails.map((rail) => rail.label.length));
    const railSpacing = Math.max(
      isUniversal && hasInverters ? 40 : 30,
      14 + maxLabelLength * 8,
    );
    rails.forEach((rail, index) => {
      rail.x = 14 + 14 + index * railSpacing;
    });
    lastRailX = rails[rails.length - 1].x;
    gateX = lastRailX + 54;
    rowsTop = hasInverters ? 78 : 50;
  }

  const railByKey = new Map(rails.map((rail) => [rail.key, rail]));
  const gateW = 62;
  const pinSpacing = 13;

  const wires: SceneWire[] = [];
  const gates: SceneGate[] = [];
  const junctions: SceneJunction[] = [];
  const labels: SceneLabel[] = [];
  const hits: SceneHit[] = [];

  let statGates = 0;
  let statInputs = 0;
  let statInverters = 0;

  // Highest junction-y reached on every rail, used to trim rails neatly.
  const railLastY = new Map<string, number>(
    rails.map((rail) => [rail.key, rail.negated ? inverterY : railsStartY + 8]),
  );
  const touchRail = (key: string, y: number) => {
    railLastY.set(key, Math.max(railLastY.get(key) ?? 0, y));
  };

  /** Draw the source for one stage pin: either a tap on its rail, or (in
   *  compact mode) a labeled stub. Returns the x where the feed wire starts. */
  const drawPinSource = (
    key: string,
    pinY: number,
    termIndex: number,
  ): number => {
    if (compact) {
      labels.push({
        x: gateX - 28,
        y: pinY + 3.5,
        text: pinDisplayLabel(key),
        size: 10.5,
        weight: "800",
        termIndex,
        anchor: "end",
      });
      return gateX - 24;
    }

    const rail = railByKey.get(key);
    if (!rail) {
      return gateX - 24;
    }
    junctions.push({ x: rail.x, y: pinY, termIndex });
    touchRail(key, pinY);
    return rail.x;
  };

  // ---- Term rows -----------------------------------------------------------

  interface RowGeom {
    stage: TermStage;
    centerY: number;
    rowTop: number;
    rowBottom: number;
    gateH: number;
  }

  let cursor = rowsTop;
  const rows: RowGeom[] = network.stages.map((stage) => {
    const pinCount = stage.pinKeys.length;
    const gateH = stage.gate ? Math.max(36, pinCount * pinSpacing + 12) : 24;
    const rowH = gateH + 30;
    const row: RowGeom = {
      stage,
      centerY: cursor + rowH / 2,
      rowTop: cursor,
      rowBottom: cursor + rowH,
      gateH,
    };
    cursor += rowH + 14;
    return row;
  });

  const termOutputs: { x: number; y: number; termIndex: number }[] = [];

  rows.forEach((row) => {
    const { stage, centerY, gateH } = row;
    const termIndex = stage.term.index;

    if (stage.gate) {
      const pinYs = spreadPinYs(stage.pinKeys.length, centerY, pinSpacing);
      const inX = gateInputX(stage.gate, gateX, gateW);

      stage.pinKeys.forEach((key, pinIdx) => {
        const pinY = pinYs[pinIdx];
        const fromX = drawPinSource(key, pinY, termIndex);
        wires.push({ x1: fromX, y1: pinY, x2: inX, y2: pinY, termIndex });
      });

      gates.push({
        kind: stage.gate,
        x: gateX,
        y: centerY,
        w: gateW,
        h: gateH,
        termIndex,
        showLabel: true,
      });
      statGates += 1;
      statInputs += stage.pinKeys.length;
      if (stage.pinKeys.length === 1) {
        statInverters += 1;
      }

      let outX = gateOutputX(stage.gate, gateX, gateW, gateH);

      if (network.outputInverter && !network.finalGate) {
        const invW = 30;
        const invH = 22;
        const invX = outX + 22;
        wires.push({ x1: outX, y1: centerY, x2: invX, y2: centerY, termIndex });
        gates.push({
          kind: network.inverterKind,
          x: invX,
          y: centerY,
          w: invW,
          h: invH,
          termIndex,
          showLabel: false,
        });
        statGates += 1;
        statInputs += 1;
        statInverters += 1;
        outX = gateOutputX(network.inverterKind, invX, invW, invH);
      }

      termOutputs.push({ x: outX, y: centerY, termIndex });
    } else {
      // Direct wire from a rail (no first-level gate).
      const key = stage.pinKeys[0];
      const outX = gateX + gateW - 20;
      const fromX = drawPinSource(key, centerY, termIndex);
      wires.push({ x1: fromX, y1: centerY, x2: outX, y2: centerY, termIndex });
      termOutputs.push({ x: outX, y: centerY, termIndex });
    }

    const label = formatTermLabel(stage.term, model.resultType);
    labels.push({
      x: gateX + gateW + 4,
      y: centerY - gateH / 2 - 7,
      text: label,
      size: label.length > 12 ? 9.5 : 11,
      weight: "800",
      termIndex,
      anchor: "end",
    });
  });

  // ---- Final gate and output ----------------------------------------------

  let outputX: number;
  let outputY: number;
  let finalBottom = 0;

  if (network.finalGate && termOutputs.length > 1) {
    const sorted = [...termOutputs].sort((a, b) => a.y - b.y);
    const centerIdx = (sorted.length - 1) / 2;
    const ranks = sorted.map(
      (_, idx) => Math.ceil(centerIdx) - Math.round(Math.abs(idx - centerIdx)),
    );
    const maxRank = Math.max(...ranks);
    const laneStep = 12;

    const maxOutX = Math.max(...sorted.map((out) => out.x));
    const finalX = maxOutX + 42 + maxRank * laneStep;
    const finalW = 66;
    const finalH = Math.max(44, sorted.length * 15 + 16);
    const finalCenterY =
      sorted.reduce((acc, out) => acc + out.y, 0) / sorted.length;
    const finalInX = gateInputX(network.finalGate, finalX, finalW);
    const pinYs = spreadPinYs(sorted.length, finalCenterY, 15);

    sorted.forEach((out, idx) => {
      const pinY = pinYs[idx];
      const laneX = Math.max(out.x + 12, finalX - 26 - ranks[idx] * laneStep);
      const termIndex = out.termIndex;

      wires.push({ x1: out.x, y1: out.y, x2: laneX, y2: out.y, termIndex });
      if (out.y !== pinY) {
        wires.push({ x1: laneX, y1: out.y, x2: laneX, y2: pinY, termIndex });
      }
      wires.push({ x1: laneX, y1: pinY, x2: finalInX, y2: pinY, termIndex });
    });

    gates.push({
      kind: network.finalGate,
      x: finalX,
      y: finalCenterY,
      w: finalW,
      h: finalH,
      termIndex: null,
      showLabel: true,
    });
    statGates += 1;
    statInputs += sorted.length;

    let finalOutX = gateOutputX(network.finalGate, finalX, finalW, finalH);

    if (network.outputInverter) {
      const invW = 30;
      const invH = 22;
      const invX = finalOutX + 18;
      wires.push({
        x1: finalOutX,
        y1: finalCenterY,
        x2: invX,
        y2: finalCenterY,
        termIndex: null,
        emphasis: true,
      });
      gates.push({
        kind: network.inverterKind,
        x: invX,
        y: finalCenterY,
        w: invW,
        h: invH,
        termIndex: null,
        showLabel: false,
      });
      statGates += 1;
      statInputs += 1;
      statInverters += 1;
      finalOutX = gateOutputX(network.inverterKind, invX, invW, invH);
    }

    outputX = finalOutX + 30;
    outputY = finalCenterY;
    finalBottom = finalCenterY + finalH / 2;

    wires.push({
      x1: finalOutX,
      y1: finalCenterY,
      x2: outputX,
      y2: finalCenterY,
      termIndex: null,
      emphasis: true,
    });
  } else {
    const out = termOutputs[0];
    if (!out) {
      return null;
    }
    outputX = out.x + 46;
    outputY = out.y;
    wires.push({
      x1: out.x,
      y1: out.y,
      x2: outputX,
      y2: out.y,
      termIndex: out.termIndex,
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

  // ---- Rails, labels and inverters (full mode only) ------------------------

  rails.forEach((rail) => {
    labels.push({
      x: rail.x,
      y: labelBaseY,
      text: rail.label,
      size: 10.5,
      weight: "800",
      termIndex: null,
      anchor: "middle",
    });

    const top = rail.negated ? inverterY : railsStartY;
    const bottom = rail.isStub
      ? inverterY
      : Math.max(railLastY.get(rail.key) ?? top, top + 6);

    wires.push({ x1: rail.x, y1: top, x2: rail.x, y2: bottom, termIndex: null });
  });

  rails
    .filter((rail) => rail.negated)
    .forEach((rail) => {
      const source = railByKey.get(rail.variable);
      if (!source) {
        return;
      }

      const isMini = network.inverterKind !== "not";
      const invW = isMini ? 16 : 12;
      const invH = isMini ? 14 : 13;
      const invX = source.x + 4;
      const invOutX = gateOutputX(network.inverterKind, invX, invW, invH);

      wires.push({
        x1: source.x,
        y1: inverterY,
        x2: invX,
        y2: inverterY,
        termIndex: null,
      });
      wires.push({
        x1: invOutX,
        y1: inverterY,
        x2: rail.x,
        y2: inverterY,
        termIndex: null,
      });
      gates.push({
        kind: network.inverterKind,
        x: invX,
        y: inverterY,
        w: invW,
        h: invH,
        termIndex: null,
        showLabel: false,
      });
      statGates += 1;
      statInputs += 1;
      statInverters += 1;
      if (!source.isStub) {
        junctions.push({ x: source.x, y: inverterY, termIndex: null });
      }
    });

  // ---- Touch targets --------------------------------------------------------

  const hitStartX = compact ? 8 : lastRailX + 10;
  rows.forEach((row) => {
    hits.push({
      termIndex: row.stage.term.index,
      x: hitStartX,
      y: row.rowTop,
      w: Math.max(40, outputX - hitStartX - 14),
      h: row.rowBottom - row.rowTop,
    });
  });

  // ---- Stats ----------------------------------------------------------------

  const stageLevel = (stage: TermStage): number => {
    const inverterLevel =
      !compact && stage.pinKeys.some((key) => key.endsWith("'")) ? 1 : 0;
    return inverterLevel + (stage.gate ? 1 : 0);
  };
  const levels =
    network.stages.length > 0
      ? Math.max(...network.stages.map(stageLevel)) +
        (network.finalGate ? 1 : 0) +
        (network.outputInverter ? 1 : 0)
      : 0;

  const rowsBottom = rows.length > 0 ? rows[rows.length - 1].rowBottom : rowsTop;
  const width = outputX + 28;
  const height = Math.max(rowsBottom, finalBottom + 14) + 16;

  return {
    width,
    height,
    wires,
    gates,
    junctions,
    labels,
    hits,
    boxes: [],
    stats: {
      gates: statGates,
      inputs: statInputs,
      inverters: statInverters,
      levels,
    },
  };
};
