import { createFileRoute } from "@tanstack/react-router";
import { tables } from "../../lib/csv-db";

export const Route = createFileRoute("/api/")({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          {
            tables: Object.fromEntries(
              Object.entries(tables).map(([name, rows]) => [
                name,
                { count: rows.length, columns: Object.keys(rows[0] ?? {}) },
              ]),
            ),
            usage: "/api/{table}?q=texte&{colonne}=valeur&sort=-colonne&limit=50&offset=0",
          },
          { headers: { "access-control-allow-origin": "*" } },
        ),
    },
  },
});
