import { DUO } from "@/constants/duoTheme";
import { Fragment, ReactNode, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Path,
  Polygon,
  Text as SvgText,
} from "react-native-svg";

type SolveType = "SOP" | "POS";

type Literal = {
  variable: string;
  negated: boolean;
};

type Term = {
  literals: Literal[];
  raw: string;
  constant?: "0" | "1";
};

interface CircuitCanvasProps {
  resultType: SolveType;
  variableQuantity: number;
  circuitVector: string[];
}

const VARIABLE_NAMES = ["A", "B", "C", "D"];
const STROKE = "#2F4858";
const BG = "#F7FBF2";

const parseLiteral = (token: string): Literal | null => {
  const clean = token.replace(/[()\s]/g, "");
  if (!clean) {
    return null;
  }

  const match = clean.match(/^([A-D])('?)/i);
  if (!match) {
    return null;
  }

  return {
    variable: match[1].toUpperCase(),
    negated: match[2] === "'",
  };
};

const parseTerms = (circuitVector: string[], resultType: SolveType): Term[] => {
  const termSeparator = resultType === "SOP" ? "." : "+";

  return circuitVector
    .filter(Boolean)
    .map((rawTerm) => {
      if (rawTerm === "1" || rawTerm === "0") {
        return { literals: [], raw: rawTerm, constant: rawTerm as "0" | "1" };
      }

      const literals = rawTerm
        .split(termSeparator)
        .map((token) => parseLiteral(token))
        .filter((item): item is Literal => item !== null);

      return { literals, raw: rawTerm };
    })
    .filter((term) => term.literals.length > 0 || term.constant !== undefined);
};

const drawLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  key: string,
) => (
  <Line
    key={key}
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    stroke={STROKE}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const getInputPinYs = (count: number, centerY: number, spacing: number) => {
  if (count <= 1) {
    return [centerY];
  }

  const total = (count - 1) * spacing;
  const start = centerY - total / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
};

const drawAndGate = (
  x: number,
  y: number,
  w: number,
  h: number,
  key: string,
) => {
  const top = y - h / 2;
  const bottom = y + h / 2;
  const radius = h / 2;
  const arcStartX = x + w - radius;
  const d = [
    `M ${x} ${top}`,
    `L ${arcStartX} ${top}`,
    `Q ${x + w} ${y} ${arcStartX} ${bottom}`,
    `L ${x} ${bottom}`,
    "Z",
  ].join(" ");

  return (
    <Fragment key={key}>
      <Path d={d} fill={BG} stroke={STROKE} strokeWidth={2} />
      <SvgText x={x + 9} y={y + 4} fontSize={10} fontWeight="900" fill={STROKE}>
        AND
      </SvgText>
    </Fragment>
  );
};

const drawOrGate = (
  x: number,
  y: number,
  w: number,
  h: number,
  key: string,
) => {
  const top = y - h / 2;
  const bottom = y + h / 2;
  const d = [
    `M ${x - 4} ${top}`,
    `Q ${x + w * 0.3} ${y} ${x - 4} ${bottom}`,
    `Q ${x + w * 0.68} ${bottom} ${x + w} ${y}`,
    `Q ${x + w * 0.68} ${top} ${x - 4} ${top}`,
    "Z",
  ].join(" ");

  return (
    <Fragment key={key}>
      <Path d={d} fill={BG} stroke={STROKE} strokeWidth={2} />
      <SvgText
        x={x + 14}
        y={y + 4}
        fontSize={10}
        fontWeight="900"
        fill={STROKE}
      >
        OR
      </SvgText>
    </Fragment>
  );
};

const drawNotGate = (x: number, y: number, key: string) => (
  <Fragment key={key}>
    <Polygon
      points={`${x},${y - 7} ${x},${y + 7} ${x + 14},${y}`}
      fill={BG}
      stroke={STROKE}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle
      cx={x + 18}
      cy={y}
      r={3}
      fill={BG}
      stroke={STROKE}
      strokeWidth={2}
    />
  </Fragment>
);

export default function CircuitCanvas({
  resultType,
  variableQuantity,
  circuitVector,
}: CircuitCanvasProps) {
  const terms = useMemo(
    () => parseTerms(circuitVector, resultType),
    [circuitVector, resultType],
  );

  const content = useMemo(() => {
    const variables = VARIABLE_NAMES.slice(0, variableQuantity);

    const inputStartY = 26;
    const inputGroupGap = 54;
    const polarityGap = 22;
    const railsStartX = 56;
    const railsEndX = 220;

    const gateX = 300;
    const gateWidth = 56;
    const gateHeight = 36;

    const finalGateX = gateX + gateWidth + 122;
    const finalGateWidth = 56;
    const finalOutX = finalGateX + finalGateWidth + 64;

    const termsStartY = 38;
    const termGapY = 74;

    if (terms.length === 1 && terms[0].constant) {
      return {
        width: 420,
        height: 180,
        nodes: (
          <>
            <Path
              d="M 20 18 H 400 A 16 16 0 0 1 416 34 V 142 A 16 16 0 0 1 400 158 H 20 A 16 16 0 0 1 4 142 V 34 A 16 16 0 0 1 20 18 Z"
              fill="#FFFFFF"
              stroke="#D9E8CC"
              strokeWidth={1.5}
            />
            <SvgText x={72} y={94} fontSize={22} fontWeight="800" fill={STROKE}>
              {`F = ${terms[0].constant}`}
            </SvgText>
          </>
        ),
      };
    }

    const termNodes = terms.map((term, index) => ({
      ...term,
      y: termsStartY + index * termGapY,
    }));

    const hasFinalGate = termNodes.length > 1;
    const finalGateY =
      termNodes.length > 0
        ? termNodes.reduce((acc, node) => acc + node.y, 0) / termNodes.length
        : termsStartY;
    const outputY = hasFinalGate
      ? finalGateY
      : (termNodes[0]?.y ?? termsStartY);

    const positiveVariablesInUse = new Set(
      termNodes
        .flatMap((term) => term.literals)
        .filter((literal) => !literal.negated)
        .map((literal) => literal.variable),
    );
    const negatedVariablesInUse = new Set(
      termNodes
        .flatMap((term) => term.literals)
        .filter((literal) => literal.negated)
        .map((literal) => literal.variable),
    );

    const railYByLiteral = new Map<string, number>();
    variables.forEach((variable, index) => {
      const posY = inputStartY + index * inputGroupGap;
      const negY = posY + polarityGap;
      if (positiveVariablesInUse.has(variable)) {
        railYByLiteral.set(variable, posY);
      }
      if (negatedVariablesInUse.has(variable)) {
        railYByLiteral.set(`${variable}'`, negY);
      }
    });

    const height = Math.max(
      inputStartY + variableQuantity * inputGroupGap + 28,
      termsStartY + Math.max(1, termNodes.length) * termGapY,
    );
    const width = finalOutX + 70;

    const wires: ReactNode[] = [];
    const labels: ReactNode[] = [];
    const gates: ReactNode[] = [];
    const termOutputs: { x: number; y: number }[] = [];

    variables.forEach((variable, index) => {
      const posY = inputStartY + index * inputGroupGap;
      const negY = posY + polarityGap;
      const hasPositive = positiveVariablesInUse.has(variable);
      const hasNegated = negatedVariablesInUse.has(variable);
      const hasAny = hasPositive || hasNegated;

      labels.push(
        <SvgText
          key={`lbl-pos-${variable}`}
          x={16}
          y={posY + 4}
          fontSize={12}
          fontWeight="800"
          fill={STROKE}
        >
          {variable}
        </SvgText>,
      );

      if (!hasAny) {
        return;
      }

      if (hasNegated) {
        labels.push(
          <SvgText
            key={`lbl-neg-${variable}`}
            x={14}
            y={negY + 4}
            fontSize={12}
            fontWeight="800"
            fill={STROKE}
          >
            {`${variable}'`}
          </SvgText>,
        );
      }

      const notX = railsStartX + 28;
      const notInputX = notX;
      const notOutputX = notX + 21;

      if (hasPositive) {
        wires.push(
          drawLine(railsStartX, posY, railsEndX, posY, `wire-pos-${variable}`),
        );
      }

      if (hasNegated) {
        if (!hasPositive) {
          wires.push(
            drawLine(
              railsStartX,
              posY,
              notInputX,
              posY,
              `wire-feed-${variable}`,
            ),
          );
        }

        wires.push(
          drawLine(
            notOutputX,
            posY,
            notOutputX,
            negY,
            `wire-not-drop-${variable}`,
          ),
          drawLine(notOutputX, negY, railsEndX, negY, `wire-neg-${variable}`),
        );

        gates.push(drawNotGate(notX, posY, `not-${variable}`));
      }
    });

    termNodes.forEach((termNode, termIndex) => {
      const gateCenterY = termNode.y;
      const hasInnerGate = termNode.literals.length > 1;

      if (hasInnerGate) {
        gates.push(
          resultType === "SOP"
            ? drawAndGate(
                gateX,
                gateCenterY,
                gateWidth,
                gateHeight,
                `inner-and-${termIndex}`,
              )
            : drawOrGate(
                gateX,
                gateCenterY,
                gateWidth,
                gateHeight,
                `inner-or-${termIndex}`,
              ),
        );

        const pinYs = getInputPinYs(termNode.literals.length, gateCenterY, 10);
        termNode.literals.forEach((literal, literalIndex) => {
          const key = `${literal.variable}${literal.negated ? "'" : ""}`;
          const fromY = railYByLiteral.get(key);
          if (fromY === undefined) {
            return;
          }

          const pinY = pinYs[literalIndex];
          const junctionX =
            gateX - 68 - literalIndex * 12 - (termIndex % 2) * 6;

          wires.push(
            drawLine(
              railsEndX,
              fromY,
              junctionX,
              fromY,
              `tap-in-h1-${termIndex}-${literalIndex}`,
            ),
          );
          if (fromY !== pinY) {
            wires.push(
              drawLine(
                junctionX,
                fromY,
                junctionX,
                pinY,
                `tap-in-v-${termIndex}-${literalIndex}`,
              ),
            );
          }
          wires.push(
            drawLine(
              junctionX,
              pinY,
              gateX,
              pinY,
              `tap-in-h2-${termIndex}-${literalIndex}`,
            ),
          );
        });

        const output = { x: gateX + gateWidth, y: gateCenterY };
        termOutputs.push(output);
        if (!hasFinalGate) {
          wires.push(
            drawLine(
              output.x,
              output.y,
              finalOutX,
              output.y,
              `single-out-${termIndex}`,
            ),
          );
        }
        return;
      }

      const literal = termNode.literals[0];
      if (!literal) {
        return;
      }

      const key = `${literal.variable}${literal.negated ? "'" : ""}`;
      const fromY = railYByLiteral.get(key);
      if (fromY === undefined) {
        return;
      }

      const termOutX = gateX - 12 - (termIndex % 2) * 8;
      const junctionX = gateX - 60 - (termIndex % 2) * 10;

      wires.push(
        drawLine(
          railsEndX,
          fromY,
          junctionX,
          fromY,
          `single-in-h1-${termIndex}`,
        ),
      );
      if (fromY !== gateCenterY) {
        wires.push(
          drawLine(
            junctionX,
            fromY,
            junctionX,
            gateCenterY,
            `single-in-v-${termIndex}`,
          ),
        );
      }
      wires.push(
        drawLine(
          junctionX,
          gateCenterY,
          termOutX,
          gateCenterY,
          `single-in-h2-${termIndex}`,
        ),
      );

      termOutputs.push({ x: termOutX, y: gateCenterY });

      if (!hasFinalGate) {
        wires.push(
          drawLine(
            termOutX,
            gateCenterY,
            finalOutX,
            gateCenterY,
            `single-direct-${termIndex}`,
          ),
        );
      }
    });

    if (hasFinalGate) {
      const pinYs = getInputPinYs(termOutputs.length, finalGateY, 10);

      termOutputs.forEach((output, index) => {
        const pinY = pinYs[index];
        const junctionX = finalGateX - 42 - (index % 2) * 6;

        wires.push(
          drawLine(
            output.x,
            output.y,
            junctionX,
            output.y,
            `final-h1-${index}`,
          ),
        );
        if (output.y !== pinY) {
          wires.push(
            drawLine(junctionX, output.y, junctionX, pinY, `final-v-${index}`),
          );
        }
        wires.push(
          drawLine(junctionX, pinY, finalGateX, pinY, `final-h2-${index}`),
        );
      });

      gates.push(
        resultType === "SOP"
          ? drawOrGate(finalGateX, finalGateY, finalGateWidth, 38, "final-or")
          : drawAndGate(
              finalGateX,
              finalGateY,
              finalGateWidth,
              38,
              "final-and",
            ),
      );

      wires.push(
        drawLine(
          finalGateX + finalGateWidth,
          finalGateY,
          finalOutX,
          finalGateY,
          "final-out",
        ),
      );
    }

    return {
      width,
      height,
      nodes: (
        <>
          {wires}
          {gates}
          {labels}
          <Circle cx={finalOutX} cy={outputY} r={4} fill={STROKE} />
          <SvgText
            x={finalOutX + 10}
            y={outputY + 4}
            fontSize={12}
            fontWeight="900"
            fill={STROKE}
          >
            F
          </SvgText>
        </>
      ),
    };
  }, [terms, resultType, variableQuantity]);

  if (terms.length === 0) {
    return <View style={styles.emptyState} />;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View
        style={[
          styles.canvasWrap,
          { width: content.width, height: content.height },
        ]}
      >
        <Svg width={content.width} height={content.height}>
          {content.nodes}
        </Svg>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  canvasWrap: {
    backgroundColor: DUO.card,
  },
  emptyState: {
    minHeight: 220,
    backgroundColor: DUO.card,
  },
});
