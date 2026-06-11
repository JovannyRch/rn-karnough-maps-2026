/**
 * Boolean expression parser for the "expression -> map" input.
 *
 * Grammar (whitespace ignored, case-insensitive):
 *   expr   := term ('+' term)*                  OR
 *   term   := factor (('.' factor) | factor)*   AND, '.' optional (adjacency)
 *   factor := atom ("'")*                       postfix negation
 *   atom   := VARIABLE | '0' | '1' | '(' expr ')'
 *
 * Variables are matched against the caller-provided names (longest first),
 * so multi-character names like "B2" tokenize correctly. '·', '*' and '&'
 * are accepted as AND; '′' as prime.
 */

type Env = Record<string, 0 | 1>;
type EvalNode = (env: Env) => 0 | 1;

export type ExpressionParseError =
  | { kind: "empty" }
  | { kind: "syntax" }
  | { kind: "unknownToken"; token: string };

export type ExpressionParseResult =
  | { ok: true; evaluate: EvalNode }
  | { ok: false; error: ExpressionParseError };

type Token =
  | { type: "var"; name: string }
  | { type: "const"; value: 0 | 1 }
  | { type: "plus" }
  | { type: "and" }
  | { type: "prime" }
  | { type: "open" }
  | { type: "close" };

const tokenize = (
  input: string,
  variableNames: string[],
): Token[] | { token: string } => {
  const normalized = input
    .replace(/′/g, "'")
    .replace(/[·*&]/g, ".")
    .replace(/\s+/g, "")
    .toUpperCase();

  const names = [...variableNames]
    .map((name) => name.toUpperCase())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  const tokens: Token[] = [];
  let i = 0;

  while (i < normalized.length) {
    const ch = normalized[i];

    if (ch === "+") {
      tokens.push({ type: "plus" });
      i += 1;
      continue;
    }
    if (ch === ".") {
      tokens.push({ type: "and" });
      i += 1;
      continue;
    }
    if (ch === "'") {
      tokens.push({ type: "prime" });
      i += 1;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "open" });
      i += 1;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "close" });
      i += 1;
      continue;
    }

    const variable = names.find((name) => normalized.startsWith(name, i));
    if (variable) {
      tokens.push({ type: "var", name: variable });
      i += variable.length;
      continue;
    }

    if (ch === "0" || ch === "1") {
      tokens.push({ type: "const", value: ch === "1" ? 1 : 0 });
      i += 1;
      continue;
    }

    const run = normalized.slice(i).match(/^[A-Z0-9_]+/);
    return { token: run ? run[0] : ch };
  }

  return tokens;
};

export const parseExpression = (
  input: string,
  variableNames: string[],
): ExpressionParseResult => {
  const tokens = tokenize(input, variableNames);
  if (!Array.isArray(tokens)) {
    return { ok: false, error: { kind: "unknownToken", token: tokens.token } };
  }
  if (tokens.length === 0) {
    return { ok: false, error: { kind: "empty" } };
  }

  let pos = 0;
  const peek = () => tokens[pos];

  const startsAtom = (token: Token | undefined): boolean =>
    token !== undefined &&
    (token.type === "var" || token.type === "const" || token.type === "open");

  const parseAtom = (): EvalNode | null => {
    const token = peek();
    if (!token) {
      return null;
    }

    if (token.type === "var") {
      pos += 1;
      const name = token.name;
      return (env) => env[name] ?? 0;
    }
    if (token.type === "const") {
      pos += 1;
      const value = token.value;
      return () => value;
    }
    if (token.type === "open") {
      pos += 1;
      const inner = parseExpr();
      if (!inner || peek()?.type !== "close") {
        return null;
      }
      pos += 1;
      return inner;
    }
    return null;
  };

  const parseFactor = (): EvalNode | null => {
    let node = parseAtom();
    if (!node) {
      return null;
    }
    while (peek()?.type === "prime") {
      pos += 1;
      const inner: EvalNode = node;
      node = (env) => (inner(env) === 1 ? 0 : 1);
    }
    return node;
  };

  const parseTerm = (): EvalNode | null => {
    let node = parseFactor();
    if (!node) {
      return null;
    }

    for (;;) {
      if (peek()?.type === "and") {
        pos += 1;
        const right = parseFactor();
        if (!right) {
          return null;
        }
        const left: EvalNode = node;
        node = (env) => (left(env) === 1 && right(env) === 1 ? 1 : 0);
        continue;
      }

      if (startsAtom(peek())) {
        const right = parseFactor();
        if (!right) {
          return null;
        }
        const left: EvalNode = node;
        node = (env) => (left(env) === 1 && right(env) === 1 ? 1 : 0);
        continue;
      }

      return node;
    }
  };

  const parseExpr = (): EvalNode | null => {
    let node = parseTerm();
    if (!node) {
      return null;
    }
    while (peek()?.type === "plus") {
      pos += 1;
      const right = parseTerm();
      if (!right) {
        return null;
      }
      const left: EvalNode = node;
      node = (env) => (left(env) === 1 || right(env) === 1 ? 1 : 0);
    }
    return node;
  };

  const root = parseExpr();
  if (!root || pos !== tokens.length) {
    return { ok: false, error: { kind: "syntax" } };
  }

  return { ok: true, evaluate: root };
};

export type ExpressionToValuesResult =
  | { ok: true; values: string[] }
  | { ok: false; error: ExpressionParseError };

/**
 * Evaluate an expression over every cell and return the values array in the
 * store's canonical (unrotated) minterm order. Display position i holds the
 * canonical variable (i + rotation) % n — the inverse of the mapping in
 * rotationMapping.toCanonicalIndex.
 */
export const expressionToValues = (
  input: string,
  variables: string[],
  variableQuantity: number,
  variableRotation: number,
): ExpressionToValuesResult => {
  const n = variableQuantity;
  const activeVariables = variables.slice(0, n);
  const parsed = parseExpression(input, activeVariables);
  if (!parsed.ok) {
    return parsed;
  }

  const rotation = ((variableRotation % n) + n) % n;
  const values = Array.from({ length: 2 ** n }, (_, m) => {
    const env: Env = {};
    activeVariables.forEach((name, i) => {
      const canonicalPos = (i + rotation) % n;
      env[name.toUpperCase()] = ((m >> (n - 1 - canonicalPos)) & 1) as 0 | 1;
    });
    return String(parsed.evaluate(env));
  });

  return { ok: true, values };
};
