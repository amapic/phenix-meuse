import { createFileRoute } from "@tanstack/react-router";
import { queryTable, tables } from "../../lib/csv-db";

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "access-control-allow-origin": "*" },
  });

export const Route = createFileRoute("/api/$table")({
  server: {
    handlers: {
      GET: ({ request, params }) => {
        const result = queryTable(params.table, new URL(request.url).searchParams);
        if (!result) {
          return json({ error: `Table inconnue: ${params.table}`, tables: Object.keys(tables) }, 404);
        }
        return json(result);
      },
    },
  },
});
