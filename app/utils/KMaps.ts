import { GROUP_COLORS } from "@/constants/groupColors";
import { BoxColor, GroupStepInfo, VectorResultItem } from "../types/types";

type SolveType = "SOP" | "POS";

type SquareValue = number | "X";

type Cell = {
  row: number;
  col: number;
  value: SquareValue;
  colBits: string;
  rowBits: string;
  index: number;
};

type GroupCell = {
  riga: number;
  col: number;
};

interface Implicant {
  pattern: string;
  covers: number[];
}

const VARIABLES = ["A", "B", "C", "D", "E"];

const toBinary = (value: number, width: number) =>
  value.toString(2).padStart(width, "0");

const literalCount = (pattern: string) =>
  pattern.split("").filter((bit) => bit !== "-").length;

const matchesPattern = (pattern: string, minterm: string) => {
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "-") {
      continue;
    }
    if (pattern[i] !== minterm[i]) {
      return false;
    }
  }
  return true;
};

const combinePattern = (a: string, b: string): string | null => {
  let diff = 0;
  let result = "";

  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      result += a[i];
      continue;
    }
    if (a[i] === "-" || b[i] === "-") {
      return null;
    }
    diff += 1;
    result += "-";
  }

  return diff === 1 ? result : null;
};

const isFullyCovered = (cover: Set<number>, targets: number[]) =>
  targets.every((target) => cover.has(target));

const buildPrimeImplicants = (
  variableQuantity: number,
  minterms: number[],
  dontCares: number[],
) => {
  const source = [...new Set([...minterms, ...dontCares])];
  let groups = source.map((value) => ({
    pattern: toBinary(value, variableQuantity),
    raw: [value],
    used: false,
  }));
  const primes: string[] = [];

  while (groups.length > 0) {
    const next: typeof groups = [];
    const seen = new Set<string>();

    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        const combined = combinePattern(groups[i].pattern, groups[j].pattern);
        if (!combined) {
          continue;
        }
        groups[i].used = true;
        groups[j].used = true;
        if (!seen.has(combined)) {
          seen.add(combined);
          next.push({
            pattern: combined,
            raw: [...new Set([...groups[i].raw, ...groups[j].raw])],
            used: false,
          });
        }
      }
    }

    groups.forEach((item) => {
      if (!item.used && !primes.includes(item.pattern)) {
        primes.push(item.pattern);
      }
    });

    groups = next;
  }

  const mintermPatterns = minterms.map((value) =>
    toBinary(value, variableQuantity),
  );

  return primes
    .map((pattern) => ({
      pattern,
      covers: minterms.filter((m, idx) =>
        matchesPattern(pattern, mintermPatterns[idx]),
      ),
    }))
    .filter((item) => item.covers.length > 0);
};

const solveExactPatterns = (
  variableQuantity: number,
  minterms: number[],
  dontCares: number[],
): string[][] => {
  if (minterms.length === 0) {
    return [[]];
  }

  const implicants = buildPrimeImplicants(
    variableQuantity,
    minterms,
    dontCares,
  );
  if (implicants.length === 0) {
    return [[]];
  }

  const essential = new Set<number>();
  minterms.forEach((target) => {
    const owners = implicants
      .map((item, index) => ({ index, covers: item.covers.includes(target) }))
      .filter((item) => item.covers);
    if (owners.length === 1) {
      essential.add(owners[0].index);
    }
  });

  const essentialPatterns = [...essential].map(
    (index) => implicants[index].pattern,
  );
  const baseCovered = new Set<number>();
  [...essential].forEach((index) => {
    implicants[index].covers.forEach((value) => baseCovered.add(value));
  });

  const uncovered = minterms.filter((value) => !baseCovered.has(value));
  if (uncovered.length === 0) {
    return [essentialPatterns];
  }

  const candidates = implicants
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => !essential.has(index))
    .filter(({ item }) =>
      item.covers.some((value) => uncovered.includes(value)),
    );

  let bestTerms = Number.POSITIVE_INFINITY;
  let bestLiterals = Number.POSITIVE_INFINITY;
  const bestPatternSets: string[][] = [];

  const recurse = (at: number, picked: number[], covered: Set<number>) => {
    const totalTerms = essentialPatterns.length + picked.length;
    if (totalTerms > bestTerms) {
      return;
    }

    if (isFullyCovered(covered, uncovered)) {
      const patterns = [
        ...essentialPatterns,
        ...picked.map((idx) => candidates[idx].item.pattern),
      ];
      const literalTotal = patterns.reduce(
        (acc, p) => acc + literalCount(p),
        0,
      );

      if (
        totalTerms < bestTerms ||
        (totalTerms === bestTerms && literalTotal < bestLiterals)
      ) {
        bestTerms = totalTerms;
        bestLiterals = literalTotal;
        bestPatternSets.length = 0;
        bestPatternSets.push(patterns);
      } else if (totalTerms === bestTerms && literalTotal === bestLiterals) {
        bestPatternSets.push(patterns);
      }
      return;
    }

    if (at >= candidates.length) {
      return;
    }

    recurse(at + 1, picked, covered);

    const nextCovered = new Set(covered);
    candidates[at].item.covers.forEach((value) => nextCovered.add(value));
    recurse(at + 1, [...picked, at], nextCovered);
  };

  recurse(0, [], new Set<number>());

  if (bestPatternSets.length === 0) {
    return [[]];
  }

  const dedup = new Set<string>();
  const uniquePatternSets: string[][] = [];
  bestPatternSets.forEach((set) => {
    const canonical = [...set].sort().join("|");
    if (!dedup.has(canonical)) {
      dedup.add(canonical);
      uniquePatternSets.push(set);
    }
  });

  return uniquePatternSets;
};

const compareNumberDesc = (a: number, b: number) => b - a;

const getVisualScore = (
  patterns: string[],
  variableQuantity: number,
  cells: Cell[],
  rows: number,
  cols: number,
  targetValue: 0 | 1,
) => {
  let wrapPenalty = 0;
  let areaScore = 0;

  patterns.forEach((pattern) => {
    const covered = cells
      .filter((cell) =>
        matchesPattern(pattern, toBinary(cell.index, variableQuantity)),
      )
      .filter((cell) => cell.value === targetValue || cell.value === "X");

    const hasRowStart = covered.some((cell) => cell.row === 0);
    const hasRowEnd = covered.some((cell) => cell.row === rows - 1);
    const hasColStart = covered.some((cell) => cell.col === 0);
    const hasColEnd = covered.some((cell) => cell.col === cols - 1);

    if (hasRowStart && hasRowEnd) {
      wrapPenalty += 1;
    }
    if (hasColStart && hasColEnd) {
      wrapPenalty += 1;
    }

    const groupSize = covered.length;
    areaScore += groupSize * groupSize;
  });

  return { wrapPenalty, areaScore };
};

export class KMaps {
  squares: (number | string)[][][];
  typeMap: number;
  typeSol: SolveType;
  result: string;
  mathExpression: string;
  borderWidth: number;
  borderRadius: number;
  boxColors: BoxColor[];
  colors: string[];
  vectorResult: VectorResultItem[];
  circuitVector: string[];
  groupsInfo: GroupStepInfo[];
  variableRotation: number;
  variables: string[];

  constructor(
    typeMap: number,
    typeSol: SolveType,
    squares: (number | string)[][][],
    variableRotation: number = 0,
    variables?: string[],
  ) {
    this.typeMap = typeMap;
    this.typeSol = typeSol;
    this.squares = squares;
    this.result = "";
    this.mathExpression = "";
    this.vectorResult = [];
    this.borderWidth = 5;
    this.borderRadius = 10;
    this.boxColors = [];
    this.colors = [...GROUP_COLORS];
    this.circuitVector = [];
    this.groupsInfo = [];
    this.variableRotation =
      ((variableRotation % this.typeMap) + this.typeMap) % this.typeMap;
    const providedVariables = variables?.slice(0, this.typeMap) ?? [];
    if (providedVariables.length === this.typeMap) {
      this.variables = providedVariables;
    } else {
      const baseVariables = VARIABLES.slice(0, this.typeMap);
      this.variables = baseVariables.map(
        (_, index) =>
          baseVariables[(index + this.variableRotation) % this.typeMap],
      );
    }
  }

  private getDimensions() {
    if (this.typeMap === 5) {
      return { rows: 4, cols: 8 };
    }
    if (this.typeMap === 4) {
      return { rows: 4, cols: 4 };
    }
    if (this.typeMap === 3) {
      return { rows: 2, cols: 4 };
    }
    return { rows: 2, cols: 2 };
  }

  private readCells(): Cell[] {
    const { rows, cols } = this.getDimensions();
    const cells: Cell[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const rawValue = this.squares[row][col][0];
        const value = rawValue === "X" ? "X" : Number(rawValue);
        const colBits = String(this.squares[row][col][1]);
        const rowBits = String(this.squares[row][col][2]);
        const index = parseInt(`${colBits}${rowBits}`, 2);

        cells.push({ row, col, value, colBits, rowBits, index });
      }
    }

    return cells;
  }

  private patternToTerms(pattern: string) {
    const plain: string[] = [];
    const math: string[] = [];
    const circuit: string[] = [];

    for (let i = 0; i < pattern.length; i++) {
      const bit = pattern[i];
      if (bit === "-") {
        continue;
      }

      const variable = this.variables[i] ?? VARIABLES[i];
      const shouldNegate = this.typeSol === "SOP" ? bit === "0" : bit === "1";

      plain.push(shouldNegate ? `${variable}'` : variable);
      math.push(shouldNegate ? `${variable}\u0305` : variable);
      circuit.push(shouldNegate ? `${variable}'` : variable);
    }

    if (plain.length === 0) {
      if (this.typeSol === "SOP") {
        return { plain: "1", math: "1", circuit: "1" };
      }
      return { plain: "0", math: "0", circuit: "0" };
    }

    if (this.typeSol === "SOP") {
      return {
        plain: plain.join(""),
        math: math.join(""),
        circuit: circuit.join("."),
      };
    }

    return {
      plain: `(${plain.join(" + ")})`,
      math: `(${math.join(" + ")})`,
      circuit: circuit.join("+"),
    };
  }

  private buildGroupsFromPatterns(patterns: string[], cells: Cell[]) {
    const targetValue = this.typeSol === "SOP" ? 1 : 0;

    return patterns
      .map((pattern, patternIndex) => {
        const covered = cells
          .filter((cell) =>
            matchesPattern(pattern, toBinary(cell.index, this.typeMap)),
          )
          .filter((cell) => cell.value === targetValue || cell.value === "X")
          .map((cell) => ({ riga: cell.row, col: cell.col }));

        const keySet = new Set<string>();
        const uniqueCovered: GroupCell[] = [];
        covered.forEach((item) => {
          const key = `${item.riga}-${item.col}`;
          if (!keySet.has(key)) {
            keySet.add(key);
            uniqueCovered.push(item);
          }
        });

        const coversAnyTarget = uniqueCovered.some((item) => {
          const found = cells.find(
            (cell) => cell.row === item.riga && cell.col === item.col,
          );
          return found?.value === targetValue;
        });

        return { patternIndex, cells: coversAnyTarget ? uniqueCovered : [] };
      })
      .filter((group) => group.cells.length > 0);
  }

  private setConstantResult(constant: "0" | "1") {
    this.result = constant;
    this.mathExpression = constant;
    this.circuitVector = [constant];
    this.groupsInfo = [];
    this.vectorResult = [
      {
        value: constant,
        groupIndex: 0,
        style: {
          color: this.colors[0],
        },
      },
    ];
    this.boxColors = [];
  }

  Algorithm() {
    const cells = this.readCells();
    const { rows, cols } = this.getDimensions();
    const targetValue = this.typeSol === "SOP" ? 1 : 0;

    const minterms = cells
      .filter((cell) => cell.value === targetValue)
      .map((cell) => cell.index);

    const dontCares = cells
      .filter((cell) => cell.value === "X")
      .map((cell) => cell.index);

    if (minterms.length === 0) {
      this.setConstantResult(this.typeSol === "SOP" ? "0" : "1");
      return;
    }

    const maxCells = 2 ** this.typeMap;
    if (minterms.length + dontCares.length === maxCells) {
      this.setConstantResult(this.typeSol === "SOP" ? "1" : "0");
      return;
    }

    const bestPatternCandidates = solveExactPatterns(
      this.typeMap,
      [...new Set(minterms)],
      [...new Set(dontCares)],
    );

    if (
      bestPatternCandidates.length === 0 ||
      bestPatternCandidates[0].length === 0
    ) {
      this.setConstantResult(this.typeSol === "SOP" ? "0" : "1");
      return;
    }

    const normalizedCandidates = bestPatternCandidates.map((candidate) =>
      [...candidate].sort((a, b) => {
        const literalDiff = literalCount(a) - literalCount(b);
        if (literalDiff !== 0) {
          return literalDiff;
        }
        return a.localeCompare(b);
      }),
    );

    const sortedCandidates = [...normalizedCandidates].sort((a, b) => {
      const scoreA = getVisualScore(
        a,
        this.typeMap,
        cells,
        rows,
        cols,
        targetValue as 0 | 1,
      );
      const scoreB = getVisualScore(
        b,
        this.typeMap,
        cells,
        rows,
        cols,
        targetValue as 0 | 1,
      );

      if (scoreA.wrapPenalty !== scoreB.wrapPenalty) {
        return scoreA.wrapPenalty - scoreB.wrapPenalty;
      }
      if (scoreA.areaScore !== scoreB.areaScore) {
        return compareNumberDesc(scoreA.areaScore, scoreB.areaScore);
      }
      return a.join("|").localeCompare(b.join("|"));
    });

    const sortedPatterns = sortedCandidates[0];

    const termData = sortedPatterns.map((pattern) =>
      this.patternToTerms(pattern),
    );

    this.result = termData
      .map((term) => term.plain)
      .join(this.typeSol === "SOP" ? " + " : " · ");

    this.mathExpression = termData
      .map((term) => term.math)
      .join(this.typeSol === "SOP" ? " + " : " · ");

    this.circuitVector = termData.map((term) => term.circuit);

    this.vectorResult = [];
    termData.forEach((term, index) => {
      this.vectorResult.push({
        value: term.math,
        groupIndex: index,
        style: {
          color: this.colors[index % this.colors.length],
        },
      });

      if (index < termData.length - 1) {
        this.vectorResult.push({
          value: this.typeSol === "SOP" ? " + " : " · ",
          style: {
            color: "black",
          },
        });
      }
    });

    const groups = this.buildGroupsFromPatterns(sortedPatterns, cells);
    const groupCells = groups.map((group) => group.cells);

    this.groupsInfo = groups.map((group, index) => {
      const pattern = sortedPatterns[group.patternIndex] ?? "";
      const term = termData[group.patternIndex];
      const fixedLiterals: string[] = [];
      const eliminatedVariables: string[] = [];

      for (let i = 0; i < pattern.length; i++) {
        const variable = this.variables[i] ?? VARIABLES[i];
        if (pattern[i] === "-") {
          eliminatedVariables.push(variable);
          continue;
        }

        const negated =
          this.typeSol === "SOP" ? pattern[i] === "0" : pattern[i] === "1";
        fixedLiterals.push(negated ? `${variable}'` : variable);
      }

      return {
        groupIndex: index,
        termPlain: term?.plain ?? "",
        termMath: term?.math ?? "",
        cellCount: group.cells.length,
        fixedLiterals,
        eliminatedVariables,
      };
    });

    this.drawGroup(groupCells, groupCells);
  }

  drawGroup(temp: GroupCell[][], groups: GroupCell[][]) {
    let c = -1;

    this.boxColors = [];

    for (let i = 0; i < temp.length; i++) {
      if (
        temp[i].length > 0 &&
        groups[i].length !== Math.pow(2, this.typeMap)
      ) {
        c++;
        let j = 0;
        const FirstElCol = groups[i][0].col;
        const FirstElRig = groups[i][0].riga;
        while (j < groups[i].length) {
          const col = groups[i][j].col;
          const row = groups[i][j].riga;

          let element: any = {
            borderColor: this.colors[c % this.colors.length],
          };

          const destra = this.checkElInGroups(j, groups[i], "destra");
          const sotto = this.checkElInGroups(j, groups[i], "sotto");
          const sinistra = this.checkElInGroups(j, groups[i], "sinistra");
          const sopra = this.checkElInGroups(j, groups[i], "sopra");

          if (destra) {
            if (sotto) {
              if (sinistra) {
                if (groups[i][j].col === FirstElCol) {
                  element = this.addBorder(element, "topLeft");
                } else if (
                  j === groups[i].length / 2 - 1 ||
                  j === groups[i].length - 1
                ) {
                  element = this.addBorder(element, "topRight");
                } else {
                  element = this.addBorder(element, "top");
                }
              } else if (sopra) {
                if (j === groups[i].length - 2 || j === groups[i].length - 1) {
                  element = this.addBorder(element, "bottomLeft");
                } else if (groups[i][j].riga === FirstElRig) {
                  element = this.addBorder(element, "topLeft");
                } else {
                  element = this.addBorder(element, "left");
                }
              } else {
                element = this.addBorder(element, "topLeft");
              }
            } else if (sopra) {
              if (sinistra) {
                if (groups[i][j].col === FirstElCol) {
                  element = this.addBorder(element, "bottomLeft");
                } else if (
                  j === groups[i].length - 1 ||
                  j === groups[i].length / 2 - 1
                ) {
                  element = this.addBorder(element, "bottomRight");
                } else {
                  element = this.addBorder(element, "bottom");
                }
              } else {
                element = this.addBorder(element, "bottomLeft");
              }
            } else if (sinistra) {
              if (j === 0) {
                element = this.addBorder(element, "closedLeft");
              } else if (j === groups[i].length - 1) {
                element = this.addBorder(element, "closedRight");
              } else {
                element = this.addBorder(element, "top-bottom");
              }
            } else {
              element = this.addBorder(element, "closedLeft");
            }
          } else if (sopra) {
            if (sinistra) {
              if (sotto) {
                if (groups[i][j].riga === FirstElRig) {
                  element = this.addBorder(element, "topRight");
                } else if (
                  j === groups[i].length - 1 ||
                  j === groups[i].length - 2
                ) {
                  element = this.addBorder(element, "bottomRight");
                } else {
                  element = this.addBorder(element, "right");
                }
              } else {
                element = this.addBorder(element, "bottomRight");
              }
            } else if (sotto) {
              if (j === 0) {
                element = this.addBorder(element, "closedTop");
              } else if (j === groups[i].length - 1) {
                element = this.addBorder(element, "closedBottom");
              } else {
                element = this.addBorder(element, "right-left");
              }
            } else {
              element = this.addBorder(element, "closedBottom");
            }
          } else if (sinistra) {
            if (sotto) {
              element = this.addBorder(element, "topRight");
            } else {
              element = this.addBorder(element, "closedRight");
            }
          } else if (sotto) {
            element = this.addBorder(element, "closedTop");
          } else {
            element = this.addBorder(element, "monoGroup");
          }
          j++;

          this.boxColors.push({
            row,
            column: col,
            groupIndex: c,
            style: element,
          });
        }
      }
    }
  }

  checkElInGroups(j: number, groups: GroupCell[], lato: string) {
    const matrix = this.squares;
    let r = matrix.length;
    let c = matrix[0].length;
    if (this.typeMap === 3) {
      r = 2;
      c = 4;
    }
    for (let k = 0; k < groups.length; k++) {
      if (
        lato === "destra" &&
        groups[k].col === (groups[j].col + 1) % c &&
        groups[k].riga === groups[j].riga % r
      ) {
        return true;
      }
      if (
        lato === "sotto" &&
        groups[k].col === groups[j].col % c &&
        groups[k].riga === (groups[j].riga + 1) % r
      ) {
        return true;
      }
      if (lato === "sinistra") {
        let col = groups[j].col - 1;
        if (col < 0) {
          col = c - 1;
        }
        if (
          groups[k].col === col % c &&
          groups[k].riga === groups[j].riga % r
        ) {
          return true;
        }
      }
      if (lato === "sopra") {
        let riga = groups[j].riga - 1;
        if (riga < 0) {
          riga = r - 1;
        }
        if (
          groups[k].col === groups[j].col % c &&
          groups[k].riga === riga % r
        ) {
          return true;
        }
      }
    }
    return false;
  }

  addBorder(
    element: object,
    position:
      | "top"
      | "right"
      | "bottom"
      | "left"
      | "topRight"
      | "topLeft"
      | "bottomRight"
      | "bottomLeft"
      | "closedLeft"
      | "closedRight"
      | "closedTop"
      | "closedBottom"
      | "top-bottom"
      | "right-left"
      | "monoGroup",
  ) {
    switch (position) {
      case "top":
        return { ...element, borderTopWidth: this.borderWidth };
      case "right":
        return { ...element, borderRightWidth: this.borderWidth };
      case "bottom":
        return { ...element, borderBottomWidth: this.borderWidth };
      case "left":
        return { ...element, borderLeftWidth: this.borderWidth };
      case "topRight":
        return {
          ...element,
          borderTopWidth: this.borderWidth,
          borderRightWidth: this.borderWidth,
          borderTopRightRadius: this.borderRadius,
        };
      case "topLeft":
        return {
          ...element,
          borderTopWidth: this.borderWidth,
          borderLeftWidth: this.borderWidth,
          borderTopLeftRadius: this.borderRadius,
        };
      case "bottomRight":
        return {
          ...element,
          borderBottomWidth: this.borderWidth,
          borderRightWidth: this.borderWidth,
          borderBottomRightRadius: this.borderRadius,
        };
      case "bottomLeft":
        return {
          ...element,
          borderBottomWidth: this.borderWidth,
          borderLeftWidth: this.borderWidth,
          borderBottomLeftRadius: this.borderRadius,
        };
      case "closedLeft":
        return {
          ...element,
          borderLeftWidth: this.borderWidth,
          borderTopWidth: this.borderWidth,
          borderBottomWidth: this.borderWidth,
          borderBottomLeftRadius: this.borderRadius,
          borderTopLeftRadius: this.borderRadius,
        };
      case "closedRight":
        return {
          ...element,
          borderRightWidth: this.borderWidth,
          borderTopWidth: this.borderWidth,
          borderBottomWidth: this.borderWidth,
          borderBottomRightRadius: this.borderRadius,
          borderTopRightRadius: this.borderRadius,
        };
      case "closedTop":
        return {
          ...element,
          borderTopWidth: this.borderWidth,
          borderLeftWidth: this.borderWidth,
          borderRightWidth: this.borderWidth,
          borderTopRightRadius: this.borderRadius,
          borderTopLeftRadius: this.borderRadius,
        };
      case "closedBottom":
        return {
          ...element,
          borderBottomWidth: this.borderWidth,
          borderLeftWidth: this.borderWidth,
          borderRightWidth: this.borderWidth,
          borderBottomRightRadius: this.borderRadius,
          borderBottomLeftRadius: this.borderRadius,
        };
      case "top-bottom":
        return {
          ...element,
          borderTopWidth: this.borderWidth,
          borderBottomWidth: this.borderWidth,
        };
      case "right-left":
        return {
          ...element,
          borderRightWidth: this.borderWidth,
          borderLeftWidth: this.borderWidth,
        };
      case "monoGroup":
        return {
          ...element,
          borderWidth: this.borderWidth,
          borderRadius: this.borderRadius,
        };
      default:
        return element;
    }
  }

  getCircuitResult() {
    return this.result;
  }

  getMathExpression() {
    return this.mathExpression;
  }

  getBoxColors() {
    return this.boxColors;
  }

  getVectorResult() {
    return this.vectorResult;
  }

  getCircuitVector() {
    return this.circuitVector;
  }

  getGroupsInfo() {
    return this.groupsInfo;
  }
}
