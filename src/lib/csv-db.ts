import bureau from "../../csv/public.bureau.csv?raw";
import cause from "../../csv/public.cause.csv?raw";
import commune from "../../csv/public.commune.csv?raw";
import conflit from "../../csv/public.conflit.csv?raw";
import personne from "../../csv/public.personne.csv?raw";
import regiment from "../../csv/public.regiment.csv?raw";
import section from "../../csv/public.section.csv?raw";

export type Row = Record<string, string>;

// RFC 4180 parser (quoted fields, escaped quotes, newlines inside quotes)
function parseCsv(text: string): Row[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...data] = rows;
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

export const tables: Record<string, Row[]> = {
  bureau: parseCsv(bureau),
  cause: parseCsv(cause),
  commune: parseCsv(commune),
  conflit: parseCsv(conflit),
  personne: parseCsv(personne),
  regiment: parseCsv(regiment),
  section: parseCsv(section),
};

const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/**
 * Query a table. Reserved params: q (text search on all columns), limit, offset, sort (prefix "-" for desc).
 * Any other param is an exact-match filter on a column.
 */
export function queryTable(name: string, params: URLSearchParams) {
  const all = tables[name];
  if (!all) return null;
  const columns = Object.keys(all[0] ?? {});
  let rows = all;

  const q = params.get("q");
  if (q) {
    const needle = norm(q);
    rows = rows.filter((r) => Object.values(r).some((v) => norm(v).includes(needle)));
  }
  for (const [key, value] of params) {
    if (columns.includes(key)) rows = rows.filter((r) => r[key] === value);
  }

  const sort = params.get("sort");
  if (sort) {
    const desc = sort.startsWith("-");
    const col = desc ? sort.slice(1) : sort;
    if (columns.includes(col)) {
      rows = [...rows].sort((a, b) =>
        a[col].localeCompare(b[col], "fr", { numeric: true }) * (desc ? -1 : 1),
      );
    }
  }

  const limit = Math.min(Math.max(parseInt(params.get("limit") ?? "50", 10) || 50, 1), 500);
  const offset = Math.max(parseInt(params.get("offset") ?? "0", 10) || 0, 0);
  return { total: rows.length, limit, offset, data: rows.slice(offset, offset + limit) };
}
