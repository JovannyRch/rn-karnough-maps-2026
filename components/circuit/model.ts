export type SolveType = "SOP" | "POS";

/**
 * "standard" -> AND/OR (SOP) or OR/AND (POS) two-level network.
 * "nand"     -> NAND gates only. Matched form (SOP) is the two-level
 *               NAND-NAND conversion; for POS the terms take complemented
 *               literals and an output inverter restores F.
 * "nor"      -> NOR gates only, symmetric to the above (matched for POS).
 * "mux"      -> single 2^(n-1):1 multiplexer; the last variable drives the
 *               data inputs, the others the select lines.
 * "decoder"  -> n-to-2^n line decoder with an OR gate over the minterms.
 */
export type CircuitVariant = "standard" | "nand" | "nor" | "mux" | "decoder";

export interface Literal {
  name: string;
  negated: boolean;
}

export interface CircuitTerm {
  literals: Literal[];
  raw: string;
  index: number;
}

export interface CircuitModel {
  kind: "empty" | "constant" | "network";
  constant: "0" | "1" | null;
  terms: CircuitTerm[];
  resultType: SolveType;
}

const parseLiteral = (token: string): Literal | null => {
  const clean = token.replace(/[()\s]/g, "");
  if (!clean) {
    return null;
  }

  const negated = clean.endsWith("'");
  const name = negated ? clean.slice(0, -1) : clean;
  if (!name) {
    return null;
  }

  return { name, negated };
};

export const parseCircuitModel = (
  circuitVector: string[],
  resultType: SolveType,
): CircuitModel => {
  const entries = circuitVector.filter(Boolean);

  if (entries.length === 0) {
    return { kind: "empty", constant: null, terms: [], resultType };
  }

  if (entries.length === 1 && (entries[0] === "0" || entries[0] === "1")) {
    return {
      kind: "constant",
      constant: entries[0] as "0" | "1",
      terms: [],
      resultType,
    };
  }

  const literalSeparator = resultType === "SOP" ? "." : "+";

  const terms: CircuitTerm[] = entries
    .map((raw, index) => ({
      raw,
      index,
      literals: raw
        .split(literalSeparator)
        .map(parseLiteral)
        .filter((item): item is Literal => item !== null),
    }))
    .filter((term) => term.literals.length > 0);

  if (terms.length === 0) {
    return { kind: "empty", constant: null, terms: [], resultType };
  }

  return { kind: "network", constant: null, terms, resultType };
};

const PRIME = "′";

export const formatLiteral = (literal: Literal): string =>
  literal.negated ? `${literal.name}${PRIME}` : literal.name;

export const formatTermLabel = (
  term: CircuitTerm,
  resultType: SolveType,
): string => {
  const parts = term.literals.map(formatLiteral);
  if (resultType === "SOP") {
    return parts.join("·");
  }
  return parts.length > 1 ? `(${parts.join("+")})` : parts.join("+");
};

export const literalKey = (literal: Literal): string =>
  literal.negated ? `${literal.name}'` : literal.name;

export const complementKey = (literal: Literal): string =>
  literal.negated ? literal.name : `${literal.name}'`;
