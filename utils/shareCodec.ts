import * as ExpoLinking from "expo-linking";

export type SharedSolveType = "SOP" | "POS";

export interface SharePayloadV1 {
  v: 1;
  n: number;
  t: SharedSolveType;
  vals: string;
  rot: number;
  vars?: string[];
}

const SHARE_WEB_BASE_URL = "https://appsdemate.lat/km";

const BASE64_URL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const utf8ToBase64Url = (value: string) => {
  const bytes = textEncoder.encode(value);
  let output = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    const triplet = (b0 << 16) | (b1 << 8) | b2;

    output += BASE64_URL_CHARS[(triplet >> 18) & 0x3f];
    output += BASE64_URL_CHARS[(triplet >> 12) & 0x3f];
    output += i + 1 < bytes.length ? BASE64_URL_CHARS[(triplet >> 6) & 0x3f] : "";
    output += i + 2 < bytes.length ? BASE64_URL_CHARS[triplet & 0x3f] : "";
  }

  return output;
};

// String.prototype.indexOf("") returns 0, so out-of-range characters must
// map to -1 explicitly or absent trailing chars decode as spurious bytes.
const charIndex = (char: string | undefined) =>
  char ? BASE64_URL_CHARS.indexOf(char) : -1;

const base64UrlToUtf8 = (value: string) => {
  const clean = value.replace(/[^A-Za-z0-9\-_]/g, "");
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i += 4) {
    const c0 = charIndex(clean[i]);
    const c1 = charIndex(clean[i + 1]);
    const c2 = charIndex(clean[i + 2]);
    const c3 = charIndex(clean[i + 3]);

    if (c0 < 0 || c1 < 0) {
      throw new Error("Invalid Base64URL code");
    }

    const n2 = c2 < 0 ? 0 : c2;
    const n3 = c3 < 0 ? 0 : c3;
    const triplet = (c0 << 18) | (c1 << 12) | (n2 << 6) | n3;

    bytes.push((triplet >> 16) & 0xff);
    if (c2 >= 0) bytes.push((triplet >> 8) & 0xff);
    if (c3 >= 0) bytes.push(triplet & 0xff);
  }

  return textDecoder.decode(new Uint8Array(bytes));
};

const normalizeVariables = (variables: string[] | undefined, quantity: number) => {
  if (!variables || variables.length < quantity) {
    return undefined;
  }

  const normalized = variables
    .slice(0, quantity)
    .map((item, index) => {
      const next = item
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, "")
        .slice(0, 3);

      return next || String.fromCharCode(65 + index);
    });

  const dedup = new Set(normalized);
  return dedup.size === normalized.length ? normalized : undefined;
};

export const encodeSharePayload = (payload: SharePayloadV1) =>
  utf8ToBase64Url(JSON.stringify(payload));

export const decodeSharePayload = (code: string): SharePayloadV1 => {
  const raw = base64UrlToUtf8(code.trim());
  const parsed = JSON.parse(raw) as Partial<SharePayloadV1>;

  if (parsed.v !== 1) {
    throw new Error("Unsupported share code version");
  }

  const n = Number(parsed.n);
  if (!Number.isInteger(n) || n < 2 || n > 5) {
    throw new Error("Invalid variable quantity");
  }

  const t = parsed.t === "POS" ? "POS" : parsed.t === "SOP" ? "SOP" : null;
  if (!t) {
    throw new Error("Invalid solve type");
  }

  const vals = String(parsed.vals ?? "").trim().toUpperCase();
  if (!new RegExp(`^[01X]{${2 ** n}}$`).test(vals)) {
    throw new Error("Invalid values payload");
  }

  const rotRaw = Number(parsed.rot);
  const rot = Number.isInteger(rotRaw) ? ((rotRaw % n) + n) % n : 0;
  const vars = normalizeVariables(parsed.vars, n);

  return {
    v: 1,
    n,
    t,
    vals,
    rot,
    vars,
  };
};

export const extractShareCode = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  if (!trimmed.includes("://")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get("d");
    if (fromQuery?.trim()) {
      return fromQuery.trim();
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0].toLowerCase() === "km") {
      return parts[1];
    }
  } catch {
    const parsed = ExpoLinking.parse(trimmed);
    const fromQuery = parsed.queryParams?.d;
    if (typeof fromQuery === "string" && fromQuery.trim()) {
      return fromQuery.trim();
    }

    if (typeof parsed.path === "string") {
      const pathParts = parsed.path.split("/").filter(Boolean);
      if (pathParts.length >= 2 && pathParts[0].toLowerCase() === "km") {
        return pathParts[1];
      }
    }
  }

  return "";
};

export const buildShareUrl = (code: string) =>
  `${SHARE_WEB_BASE_URL}/${encodeURIComponent(code)}`;
