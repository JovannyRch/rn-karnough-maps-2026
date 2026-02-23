import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { buildMinimizationComparison } from "./minimizationComparator";
import { buildRotatedMap } from "@/app/utils/rotationMapping";
import { buildGroupColorsByMinterm } from "./groupColorLookup";

interface CircuitData {
  resultType: string;
  variableQuantity: number;
  circuitVector: string[];
  resultExpression?: string;
  variables?: string[];
}

interface VectorResultItemLike {
  value: string;
  style?: {
    color?: string;
  };
}

interface BoxColorLike {
  row: number;
  column: number;
  style: Record<string, unknown>;
}

interface SessionPDFData extends CircuitData {
  values: string[];
  variableRotation: number;
  vectorResult?: VectorResultItemLike[];
  boxColors?: BoxColorLike[];
  variables?: string[];
}

type SolveType = "SOP" | "POS";

type Literal = {
  symbol: string;
  railIndex: number;
};

const STROKE = "#2f4858";
const FILL_GATE = "#2f4858";
const TERM_COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "#50C878",
  "lightblue",
  "#CD7F32",
  "#ff6699",
];

const getVariables = (quantity: number): string[] => {
  if (quantity === 2) return ["A", "B"];
  if (quantity === 3) return ["A", "B", "C"];
  if (quantity === 4) return ["A", "B", "C", "D"];
  return [];
};

const addNegations = (vars: string[]): string[] => {
  const result: string[] = [];
  vars.forEach((v) => {
    result.push(v);
    result.push(`${v}'`);
  });
  return result;
};

const normalizeTerm = (term: string) => {
  return term
    .replace(/(.)\u0305/g, "$1'")
    .replace(/[()\s]/g, "")
    .trim();
};

const formatCircuitTermLabel = (term: string, solveType: SolveType) => {
  const normalized = normalizeTerm(term).replace(/\./g, "·");
  if (!normalized) {
    return solveType === "POS" ? "(0)" : "0";
  }

  if (solveType === "POS" && normalized.includes("+")) {
    return `(${normalized})`;
  }

  return normalized;
};

const parseLiterals = (
  term: string,
  rails: string[],
  solveType: SolveType,
): Literal[] => {
  const normalized = normalizeTerm(term);
  if (!normalized) {
    return [];
  }

  const tokenSeparator = solveType === "SOP" ? "." : "+";
  const tokens = normalized.includes(tokenSeparator)
    ? normalized.split(tokenSeparator)
    : [normalized];

  return tokens
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => ({
      symbol: token.endsWith("'") ? token : token,
      railIndex: rails.indexOf(token),
    }))
    .filter((literal) => literal.railIndex >= 0);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildExpressionFallback = (data: CircuitData) => {
  if (!data.circuitVector.length) {
    return "";
  }
  if (data.circuitVector.length === 1) {
    return data.circuitVector[0];
  }
  return data.resultType === "POS"
    ? data.circuitVector.map((term) => `(${term})`).join(" · ")
    : data.circuitVector.join(" + ");
};

const toBinary = (value: number, width: number) =>
  value.toString(2).padStart(width, "0");

const styleToCss = (style?: Record<string, unknown>) => {
  if (!style) {
    return "";
  }
  const width = (key: string) => {
    const raw = style[key];
    return typeof raw === "number" ? `${raw}px` : null;
  };
  const color =
    typeof style.borderColor === "string" ? style.borderColor : "#000000";
  const radius = (key: string) => {
    const raw = style[key];
    return typeof raw === "number" ? `${raw}px` : null;
  };
  const css: string[] = ["border-style:solid", `border-color:${color}`];

  const top = width("borderTopWidth");
  const right = width("borderRightWidth");
  const bottom = width("borderBottomWidth");
  const left = width("borderLeftWidth");
  const all = width("borderWidth");
  const allRadius = radius("borderRadius");
  const topLeftRadius = radius("borderTopLeftRadius");
  const topRightRadius = radius("borderTopRightRadius");
  const bottomLeftRadius = radius("borderBottomLeftRadius");
  const bottomRightRadius = radius("borderBottomRightRadius");

  if (top) css.push(`border-top-width:${top}`);
  if (right) css.push(`border-right-width:${right}`);
  if (bottom) css.push(`border-bottom-width:${bottom}`);
  if (left) css.push(`border-left-width:${left}`);
  if (all) css.push(`border-width:${all}`);
  if (allRadius) css.push(`border-radius:${allRadius}`);
  if (topLeftRadius) css.push(`border-top-left-radius:${topLeftRadius}`);
  if (topRightRadius) css.push(`border-top-right-radius:${topRightRadius}`);
  if (bottomLeftRadius) css.push(`border-bottom-left-radius:${bottomLeftRadius}`);
  if (bottomRightRadius) css.push(`border-bottom-right-radius:${bottomRightRadius}`);

  return css.join(";");
};

const getMapAxisNames = (
  quantity: number,
  variables?: string[],
): { top: string; side: string } => {
  const base = variables?.slice(0, quantity) ?? getVariables(quantity);
  if (quantity === 2) {
    return { top: base[1], side: base[0] };
  }
  if (quantity === 3) {
    return { top: `${base[0]}${base[1]}`, side: base[2] };
  }
  return { top: `${base[0]}${base[1]}`, side: `${base[2]}${base[3]}` };
};

const buildSessionHTML = (data: SessionPDFData) => {
  const expression =
    data.resultExpression?.trim() || buildExpressionFallback(data) || "N/A";
  const comparison = buildMinimizationComparison({
    values: data.values,
    variableQuantity: data.variableQuantity,
    resultType: data.resultType === "POS" ? "POS" : "SOP",
    currentResult: expression,
  });
  const rotatedMap = buildRotatedMap(data.variableQuantity, data.variableRotation);
  const groupColorsByMinterm = buildGroupColorsByMinterm({
    variableQuantity: data.variableQuantity,
    variableRotation: data.variableRotation,
    boxColors: data.boxColors ?? [],
  });
  const axisNames = getMapAxisNames(data.variableQuantity, data.variables);
  const overlayByCell = new Map<string, BoxColorLike[]>();
  (data.boxColors ?? []).forEach((item) => {
    const key = `${item.row}-${item.column}`;
    const current = overlayByCell.get(key) ?? [];
    current.push(item);
    overlayByCell.set(key, current);
  });

  const expressionColorized = (data.vectorResult?.length ?? 0) > 0
    ? data.vectorResult!
        .map((item) => {
          const color = item.style?.color ?? "#1d2e19";
          return `<span style="color:${escapeHtml(color)};font-weight:800;">${escapeHtml(
            item.value,
          )}</span>`;
        })
        .join("")
    : `<span style="color:#1d2e19;font-weight:800;">${escapeHtml(expression)}</span>`;

  const truthRows = Array.from(
    { length: Math.pow(2, data.variableQuantity) },
    (_, index) => {
      const groupDots = (groupColorsByMinterm.get(index) ?? [])
        .map((color) => `<span class="group-dot" style="background:${escapeHtml(color)};"></span>`)
        .join("");
      return `
      <tr>
        <td>${index}</td>
        <td>${toBinary(index, data.variableQuantity)}</td>
        <td>${escapeHtml(data.values[index] ?? "0")}</td>
        <td><div class="group-dots">${groupDots || '<span class="group-empty">—</span>'}</div></td>
      </tr>
    `;
    },
  ).join("");

  const mapRows = rotatedMap.rowLabels
    .map((rowLabel, row) => {
      const cells = rotatedMap.indexGrid[row]
        .map((index, column) => {
          const value = data.values[index] ?? "0";
          const overlays = (overlayByCell.get(`${row}-${column}`) ?? [])
            .map(
              (overlay, overlayIndex) =>
                `<div class="map-overlay" style="${styleToCss(
                  overlay.style,
                )};inset:${overlayIndex * 3}px;"></div>`,
            )
            .join("");
          return `
            <td>
              <div class="map-cell">
                <span class="map-index">${index}</span>
                <span class="map-value">${escapeHtml(value)}</span>
                ${overlays}
              </div>
            </td>
          `;
        })
        .join("");

      return `<tr><th>${rowLabel}</th>${cells}</tr>`;
    })
    .join("");

  const equivalents = comparison.exactExpressions
    .map(
      (expressionItem, index) =>
        `<li><strong>#${index + 1}:</strong> ${escapeHtml(expressionItem)}</li>`,
    )
    .join("");

  const circuitHTML = generateCircuitHTML(data);

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sesión Completa - Mapas de Karnaugh</title>
          <style>
            @page { size: A4; margin: 14mm; }
            body { font-family: Arial, sans-serif; margin: 16px; color: #22331f; }
            h1,h2,h3 { margin: 0; }
            .header { border-bottom: 2px solid #2f4858; padding-bottom: 12px; margin-bottom: 16px; }
            .meta { color: #4b5c44; font-size: 13px; margin-top: 6px; }
            .section { margin-top: 16px; padding: 12px; border: 1px solid #d9e8cc; border-radius: 10px; background: #fbfdf8; }
            .page { page-break-inside: avoid; break-inside: avoid; }
            .page-break { page-break-before: always; break-before: page; }
            .map-section { page-break-inside: avoid; break-inside: avoid; }
            .table-section { page-break-inside: avoid; break-inside: avoid; }
            .compare-section { page-break-inside: avoid; break-inside: avoid; }
            .circuit-section {
              page-break-inside: avoid;
              break-inside: avoid;
              min-height: 90vh;
            }
            .result { font-size: 16px; margin-top: 6px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #d9e8cc; text-align: center; padding: 6px; }
            thead th { background: #58cc02; color: #fff; }
            .group-dots { display:flex; gap:6px; justify-content:center; align-items:center; flex-wrap:wrap; min-height:18px; }
            .group-dot { width:10px; height:10px; border-radius:999px; border:1px solid #1f352b; display:inline-block; }
            .group-empty { color:#8a9a83; font-weight:700; font-size:11px; }
            .map-wrap { overflow: hidden; }
            .map-table th.axis { background: #edf8e2; color: #46663a; }
            .map-cell { position: relative; width: 62px; height: 58px; background: #c7d0d8; }
            .map-index { position: absolute; top: 3px; left: 4px; font-size: 10px; color: #253841; }
            .map-value { position: absolute; top: 18px; left: 0; right: 0; font-size: 21px; font-weight: 800; color: #000; text-align: center; }
            .map-overlay { position: absolute; inset: 0; box-sizing: border-box; pointer-events: none; }
            .equiv-list { margin: 8px 0 0 16px; padding: 0; }
            .equiv-list li { margin-bottom: 4px; }
            .foot { margin-top: 16px; color: #72806c; font-size: 11px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <h1>Sesión Completa - Mapas de Karnaugh</h1>
              <div class="meta">Variables: ${data.variableQuantity} | Tipo: ${
                data.resultType === "POS" ? "Producto de Sumas (POS)" : "Suma de Productos (SOP)"
              }</div>
            </div>

            <div class="section">
              <h2>Expresión final</h2>
              <div class="result">${expressionColorized}</div>
            </div>

            <div class="section map-wrap map-section">
              <h2>Mapa de Karnaugh coloreado</h2>
              <table class="map-table">
                <thead>
                  <tr>
                    <th class="axis">${escapeHtml(axisNames.side)} \\ ${escapeHtml(axisNames.top)}</th>
                    ${rotatedMap.colLabels.map((label) => `<th class="axis">${label}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>${mapRows}</tbody>
              </table>
            </div>
          </div>

          <div class="page page-break">
            <div class="section table-section">
              <h2>Tabla de verdad</h2>
              <table>
                <thead>
                  <tr><th>#</th><th>${escapeHtml(
                    (data.variables?.slice(0, data.variableQuantity) ?? getVariables(data.variableQuantity)).join(""),
                  )}</th><th>Resultado</th><th>Grupos</th></tr>
                </thead>
                <tbody>${truthRows}</tbody>
              </table>
            </div>

            <div class="section compare-section">
              <h2>Comparador de minimización</h2>
              <div>Quine-McCluskey: <strong>${escapeHtml(comparison.exactExpression)}</strong></div>
              <div>Heurístico (tipo Espresso): <strong>${escapeHtml(comparison.heuristicExpression)}</strong></div>
              <div style="margin-top:6px;">${
                comparison.currentResultEquivalent
                  ? "Tu resultado es equivalente al exacto."
                  : "Tu resultado difiere del exacto."
              }</div>
              <div style="margin-top:6px;">${
                comparison.hasMultipleEquivalent
                  ? `Hay ${comparison.equivalentSolutions} soluciones mínimas equivalentes.`
                  : "Se encontró una solución mínima única."
              }</div>
              <ul class="equiv-list">${equivalents}</ul>
            </div>
          </div>

          <div class="page page-break">
            <div class="section circuit-section">
              <h2>Circuito</h2>
              ${circuitHTML}
            </div>
          </div>

          <div class="foot">Fecha de generación: ${new Date().toLocaleDateString("es-ES")}</div>
        </body>
      </html>
    `;
};

const spreadPins = (count: number, centerY: number, spacing: number) => {
  if (count <= 1) {
    return [centerY];
  }

  const start = centerY - ((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
};

const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  width = 2,
  color: string = STROKE,
) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" />`;

const text = (
  x: number,
  y: number,
  value: string,
  size = 10,
  weight = 700,
  color = "#111",
  anchor: "start" | "middle" | "end" = "start",
) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}">${value}</text>`;

const dot = (x: number, y: number, r = 3.2, color: string = STROKE) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" />`;

const andGate = (
  x: number,
  y: number,
  w: number,
  h: number,
  borderColor?: string,
) => {
  const top = y - h / 2;
  const bottom = y + h / 2;
  // Keep gate geometry stable when height grows (e.g. final POS gate with many terms).
  const radius = Math.min(h / 2, w * 0.5);
  const arcStartX = x + w - radius;
  const d = [
    `M ${x} ${top}`,
    `L ${arcStartX} ${top}`,
    `Q ${x + w} ${y} ${arcStartX} ${bottom}`,
    `L ${x} ${bottom}`,
    "Z",
  ].join(" ");

  const strokeAttrs = borderColor
    ? ` stroke="${borderColor}" stroke-width="1.4" stroke-opacity="0.55"`
    : "";
  return `<path d="${d}" fill="${FILL_GATE}"${strokeAttrs} />`;
};

const orGate = (x: number, y: number, w: number, h: number) => {
  const top = y - h / 2;
  const bottom = y + h / 2;
  const d = [
    `M ${x - 4} ${top}`,
    `Q ${x + w * 0.3} ${y} ${x - 4} ${bottom}`,
    `Q ${x + w * 0.68} ${bottom} ${x + w} ${y}`,
    `Q ${x + w * 0.68} ${top} ${x - 4} ${top}`,
    "Z",
  ].join(" ");

  return `<path d="${d}" fill="${FILL_GATE}" />`;
};

export const generateCircuitHTML = (data: CircuitData): string => {
  const { resultType, variableQuantity, circuitVector } = data;
  const solveType: SolveType = resultType === "POS" ? "POS" : "SOP";

  if (
    circuitVector.length === 1 &&
    (circuitVector[0] === "0" || circuitVector[0] === "1")
  ) {
    const constant = circuitVector[0];
    return `
      <div style="padding: 12px;">
        <svg width="420" height="180" viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="404" height="164" rx="16" fill="#fff" stroke="#d9e8cc" stroke-width="1.5" />
          <text x="150" y="98" font-size="30" font-weight="800" fill="#2f4858">F = ${constant}</text>
        </svg>
      </div>
    `;
  }

  const variables = data.variables?.slice(0, variableQuantity) ?? getVariables(variableQuantity);
  const rails = addNegations(variables);
  const railCount = rails.length;
  const terms = circuitVector.map((term) =>
    parseLiterals(term, rails, solveType),
  );

  const stepX = 20;
  const leftPadding = 22;
  const railStartX = leftPadding + 30;
  const railXs = rails.map((_, i) => railStartX + i * stepX);
  const gatesStartX = railStartX + railCount * stepX + 84;

  const rowHeight = Math.max(92, 26 + railCount * 8);
  const rowGap = 26;
  const rowsTop = 72;

  const gateW = 76;
  const gateH = Math.max(34, 18 + railCount * 2.6);

  const rowsCount = Math.max(terms.length, 1);
  const canvasHeight =
    rowsTop + rowsCount * rowHeight + Math.max(0, rowsCount - 1) * rowGap + 34;
  const railsTop = rowsTop - 28;
  const railsBottom = canvasHeight - 20;

  const svgParts: string[] = [];

  rails.forEach((label, idx) => {
    const x = railXs[idx];
    svgParts.push(text(x - 4, railsTop - 10, label, 9.5, 700));
    svgParts.push(line(x, railsTop, x, railsBottom));
  });

  const termOutputs: { x: number; y: number }[] = [];

  terms.forEach((literals, termIndex) => {
    const centerY = rowsTop + termIndex * (rowHeight + rowGap) + rowHeight / 2;
    const termColor = TERM_COLORS[termIndex % TERM_COLORS.length];
    const termLabel = formatCircuitTermLabel(circuitVector[termIndex] ?? "", solveType);
    const termLabelX = gatesStartX - 10;
    const termLabelY = centerY - gateH / 2 - 10;
    const termLabelSize = termLabel.length > 10 ? 8.6 : 10;

    svgParts.push(
      text(termLabelX, termLabelY, termLabel, termLabelSize, 800, termColor, "end"),
    );

    if (literals.length === 0) {
      return;
    }

    if (literals.length === 1) {
      const literal = literals[0];
      const srcX = railXs[literal.railIndex];
      const laneX = gatesStartX - 18;

      svgParts.push(dot(srcX, centerY, 3.2, termColor));
      svgParts.push(line(srcX, centerY, laneX, centerY, 2.5, termColor));

      termOutputs.push({ x: laneX, y: centerY });
      return;
    }

    const gateX = gatesStartX;
    const gateY = centerY;

    svgParts.push(
      solveType === "SOP"
        ? andGate(gateX, gateY, gateW, gateH, termColor)
        : orGate(gateX, gateY, gateW, gateH),
    );

    const pinYs = spreadPins(literals.length, gateY, 10);

    literals.forEach((literal, idx) => {
      const srcX = railXs[literal.railIndex];
      const srcY = pinYs[idx];
      const pinY = pinYs[idx];
      const laneX = Math.max(
        srcX + 10,
        gateX - 64 - idx * 10 - (termIndex % 2) * 6,
      );

      svgParts.push(dot(srcX, srcY, 3.2, termColor));
      svgParts.push(line(srcX, srcY, laneX, srcY, 2.5, termColor));
      if (srcY !== pinY) {
        svgParts.push(line(laneX, srcY, laneX, pinY, 2.5, termColor));
      }
      svgParts.push(line(laneX, pinY, gateX, pinY, 2.5, termColor));
    });

    termOutputs.push({ x: gateX + gateW + 24, y: gateY });
    svgParts.push(
      line(gateX + gateW, gateY, gateX + gateW + 24, gateY, 2.8, termColor),
    );
  });

  const finalCenterY =
    termOutputs.length > 0
      ? termOutputs.reduce((acc, node) => acc + node.y, 0) / termOutputs.length
      : rowsTop + rowHeight / 2;

  if (termOutputs.length > 1) {
    const routedOutputs = termOutputs
      .map((node, idx) => ({ ...node, termIndex: idx }))
      .sort((a, b) => a.y - b.y);
    const lastOutputX = Math.max(...routedOutputs.map((node) => node.x));
    const finalGateX = lastOutputX + 122;
    const outputYs = routedOutputs.map((node) => node.y);
    const outputSpan = Math.max(...outputYs) - Math.min(...outputYs);
    const desiredPinSpacing = Math.max(16, Math.min(24, rowHeight * 0.38));
    const minGateHForPins = (routedOutputs.length - 1) * desiredPinSpacing + 28;
    const finalGateH = Math.max(56, minGateHForPins, outputSpan * 0.62);
    const finalGateW =
      solveType === "POS"
        ? Math.max(96, Math.min(132, finalGateH * 0.58))
        : 80;
    // OR inputs connect better if wires enter slightly inside and are then covered by the gate fill.
    const finalInputX = solveType === "SOP" ? finalGateX + 16 : finalGateX;
    const finalPins = spreadPins(
      routedOutputs.length,
      finalCenterY,
      desiredPinSpacing,
    );
    const centerIdx = (routedOutputs.length - 1) / 2;
    const laneStep = 16;
    const laneStartX = finalInputX - 34;
    const maxMirrorDistance = Math.ceil(centerIdx);
    const laneRanks = routedOutputs.map((_, idx) => {
      const mirrorDistance = Math.round(Math.abs(idx - centerIdx));
      return Math.max(0, maxMirrorDistance - mirrorDistance);
    });
    const rankBuckets = new Map<number, number[]>();
    laneRanks.forEach((rank, idx) => {
      const current = rankBuckets.get(rank) ?? [];
      current.push(idx);
      rankBuckets.set(rank, current);
    });
    const laneOffsetY = new Array(routedOutputs.length).fill(0);
    rankBuckets.forEach((bucket) => {
      if (bucket.length < 2) {
        return;
      }
      const center = (bucket.length - 1) / 2;
      bucket.forEach((idx, pos) => {
        laneOffsetY[idx] = Math.round((pos - center) * 6);
      });
    });

    routedOutputs.forEach((out, idx) => {
      const pinY = finalPins[idx];
      const adjustedPinY = pinY + laneOffsetY[idx];
      const laneRank = laneRanks[idx];
      const laneX = Math.max(out.x + 10, laneStartX - laneRank * laneStep);
      const finalJoinX = finalInputX - 6;
      const termColor = TERM_COLORS[out.termIndex % TERM_COLORS.length];

      svgParts.push(line(out.x, out.y, laneX, out.y, 2.8, termColor));
      if (out.y !== adjustedPinY) {
        svgParts.push(line(laneX, out.y, laneX, adjustedPinY, 2.8, termColor));
      }
      svgParts.push(line(laneX, adjustedPinY, finalJoinX, adjustedPinY, 2.8, termColor));
      if (adjustedPinY !== pinY) {
        svgParts.push(line(finalJoinX, adjustedPinY, finalJoinX, pinY, 2.8, termColor));
      }
      svgParts.push(line(finalJoinX, pinY, finalInputX, pinY, 2.8, termColor));
    });

    svgParts.push(
      solveType === "SOP"
        ? orGate(finalGateX, finalCenterY, finalGateW, finalGateH)
        : andGate(finalGateX, finalCenterY, finalGateW, finalGateH),
    );

    const finalOutX = finalGateX + finalGateW + 54;
    svgParts.push(
      line(finalGateX + finalGateW, finalCenterY, finalOutX, finalCenterY),
    );
    svgParts.push(dot(finalOutX, finalCenterY, 3.6));
    svgParts.push(text(finalOutX + 12, finalCenterY + 4, "F", 12, 900));

    const canvasWidth = finalOutX + 74;
    return `
      <div style="position: relative; padding: 6px; overflow-x: auto;">
        <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
          ${svgParts.join("\n")}
        </svg>
      </div>
    `;
  }

  if (termOutputs.length === 1) {
    const out = termOutputs[0];
    const finalOutX = out.x + 110;
    svgParts.push(line(out.x, out.y, finalOutX, out.y));
    svgParts.push(dot(finalOutX, out.y, 3.6));
    svgParts.push(text(finalOutX + 12, out.y + 4, "F", 12, 900));

    const canvasWidth = finalOutX + 84;
    return `
      <div style="position: relative; padding: 6px; overflow-x: auto;">
        <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
          ${svgParts.join("\n")}
        </svg>
      </div>
    `;
  }

  return `
    <div style="padding: 8px 12px; color: #666; font-family: Arial, sans-serif;">No se pudo generar el circuito.</div>
  `;
};

export const generateCircuitPDF = async (
  data: CircuitData,
): Promise<string> => {
  try {
    const circuitHTML = generateCircuitHTML(data);
    const expression =
      data.resultExpression?.trim() || buildExpressionFallback(data) || "N/A";

    const fullHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Circuito Lógico - Mapas de Karnaugh</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              padding: 0;
              background-color: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #2f4858;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2f4858;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              color: #666;
              margin: 5px 0;
              font-size: 14px;
            }
            .expression {
              margin-top: 10px;
              font-size: 15px;
              color: #2f4858;
              font-weight: 700;
            }
            .circuit-container {
              margin: 20px 0;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background-color: #fafafa;
              min-height: 400px;
            }
            .info {
              margin-top: 30px;
              font-size: 12px;
              color: #888;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Circuito Lógico</h1>
            <p>Mapas de Karnaugh - Generado automáticamente</p>
            <p>Variables: ${data.variableQuantity} | Tipo: ${
              data.resultType === "POS"
                ? "Producto de Sumas (POS)"
                : "Suma de Productos (SOP)"
            }</p>
            <p class="expression">Expresión: ${escapeHtml(expression)}</p>
          </div>

          <div class="circuit-container">
            ${circuitHTML}
          </div>

          <div class="info">
            <p>Fecha de generación: ${new Date().toLocaleDateString(
              "es-ES",
            )}</p>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: fullHTML,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Descargar Circuito PDF",
        UTI: "com.adobe.pdf",
      });
    } else {
      throw new Error("Sharing no está disponible en este dispositivo");
    }

    return uri;
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    throw error;
  }
};

export const generateSessionPDF = async (
  data: SessionPDFData,
): Promise<string> => {
  try {
    const fullHTML = buildSessionHTML(data);

    const { uri } = await Print.printToFileAsync({
      html: fullHTML,
      base64: false,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Exportar sesión completa",
        UTI: "com.adobe.pdf",
      });
    } else {
      throw new Error("Sharing no está disponible en este dispositivo");
    }

    return uri;
  } catch (error) {
    console.error("Error al generar PDF de sesión:", error);
    throw error;
  }
};
