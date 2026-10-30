import express from "express";
import cors from "cors";
import { pool, config } from "./db.js";

const app = express();
app.use(
  cors({
    origin: config.corsOrigin === "*" ? "*" : config.corsOrigin.split(",").map((s) => s.trim()),
  }),
);

// Jointures vers les tables de référence ; le résultat est mis au format attendu par le front.
const SELECT_POILU = `
  SELECT
    p.id::text                         AS id,
    p.nom                              AS nom_famille,
    p.prenom                           AS prenom,
    p.date_naissance::text             AS date_naissance,
    p.dpt_naissance::text              AS departement_naissance,
    p.classe::text                     AS classe,
    p.date_deces::text                 AS date_deces,
    p.biographie                       AS biographie,
    p.portrait                         AS portrait,
    cn.libelle                         AS lieu_naissance,
    cd.libelle                         AS lieu_deces,
    ci.libelle                         AS lieu_inhumation,
    b.libelle                          AS bureau,
    r.libelle                          AS regiment,
    s.libelle                          AS section,
    ca.libelle                         AS cause,
    co.libelle                         AS conflit
  FROM personne p
  LEFT JOIN commune  cn ON cn.id = p.commune_naissance_id
  LEFT JOIN commune  cd ON cd.id = p.lieu_deces_id
  LEFT JOIN commune  ci ON ci.id = p.lieu_inhumation_id
  LEFT JOIN bureau   b  ON b.id  = p.bureau_id
  LEFT JOIN regiment r  ON r.id  = p.regiment_id
  LEFT JOIN section  s  ON s.id  = p.section_id
  LEFT JOIN cause    ca ON ca.id = p.cause_id
  LEFT JOIN conflit  co ON co.id = p.conflit_id
`;

function toPoilu(r) {
  const nom = [r.prenom, r.nom_famille].filter(Boolean).join(" ");
  const year = r.date_naissance ? Number(r.date_naissance.slice(0, 4)) : null;
  return {
    id: r.id,
    nom,
    naissance: year,
    naissance_date: r.date_naissance ?? "",
    lieu_naissance: r.lieu_naissance ?? "",
    departement_naissance: r.departement_naissance ?? "",
    deces: r.date_deces ?? "",
    lieu: r.lieu_deces ?? "",
    regiment: r.regiment ?? "",
    section: r.section ?? "",
    classe_service: r.classe ?? "",
    bureau_recrutement: r.bureau ?? "",
    lieu_inhumation: r.lieu_inhumation ?? "",
    motif_deces: r.cause ?? "",
    conflit: r.conflit ?? "",
    photo: r.portrait || undefined,
    resume: r.biographie ?? "",
    sections: r.biographie ? [["Biographie", r.biographie]] : [],
  };
}

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT count(*) AS cn FROM personne");
    res.json({ ok: true, personnes: Number(result.rows[0].cn) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /poilus?q=texte&limit=500&offset=0
app.get("/poilus", async (req, res) => {
  try {
    const q = (req.query.q ?? "").toString().trim();
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 500, 1), 1000);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const params = [];
    const conditions = [];
    if (q) {
      // Commence par : on échappe % et _ pour qu'ils soient pris littéralement
      params.push(`${q.replace(/[\\%_]/g, "\\$&")}%`);
      conditions.push(
        `(p.prenom ILIKE $${params.length} OR p.nom ILIKE $${params.length} OR concat_ws(' ', p.prenom, p.nom) ILIKE $${params.length} OR r.libelle ILIKE $${params.length} OR cn.libelle ILIKE $${params.length} OR cd.libelle ILIKE $${params.length} OR ca.libelle ILIKE $${params.length})`,
      );
    }
    // Année de décès (aaaa) : fonctionne que la date soit stockée en 1916-09-18 ou 18/09/1916
    const annee = (req.query.annee_deces ?? "").toString().trim();
    if (/^\d{4}$/.test(annee)) {
      params.push(annee);
      conditions.push(`substring(p.date_deces::text from '\\d{4}') = $${params.length}`);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    params.push(limit, offset);

    const result = await pool.query(
      `${SELECT_POILU} ${where} ORDER BY p.nom, p.prenom, p.id LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );
    res.json(result.rows.map(toPoilu));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listes et plages utilisées par les filtres de la page poilus.
// Déclarée AVANT GET /poilus/:id, sinon « options » serait pris pour un identifiant.
const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

function sortUnique(values) {
  return [...new Set(values.filter((v) => v !== null && v !== undefined && String(v).trim() !== "").map(String))].sort(collator.compare);
}

async function distinctValues(sql) {
  const result = await pool.query(sql);
  return sortUnique(result.rows.map((r) => r.value));
}

// GET /poilus/options
app.get("/poilus/options", async (_req, res) => {
  try {
    const [
      lieuxNaissance,
      lieuxDeces,
      lieuxInhumation,
      regiments,
      sections,
      bureauxRecrutement,
      motifsDeces,
      classesService,
      namesResult,
      yearsResult,
    ] = await Promise.all([
      distinctValues(`SELECT cn.libelle AS value FROM personne p JOIN commune cn ON cn.id = p.commune_naissance_id`),
      distinctValues(`SELECT cd.libelle AS value FROM personne p JOIN commune cd ON cd.id = p.lieu_deces_id`),
      distinctValues(`SELECT ci.libelle AS value FROM personne p JOIN commune ci ON ci.id = p.lieu_inhumation_id`),
      distinctValues(`SELECT r.libelle AS value FROM personne p JOIN regiment r ON r.id = p.regiment_id`),
      distinctValues(`SELECT s.libelle AS value FROM personne p JOIN section s ON s.id = p.section_id`),
      distinctValues(`SELECT b.libelle AS value FROM personne p JOIN bureau b ON b.id = p.bureau_id`),
      distinctValues(`SELECT ca.libelle AS value FROM personne p JOIN cause ca ON ca.id = p.cause_id`),
      distinctValues(`SELECT p.classe::text AS value FROM personne p WHERE p.classe IS NOT NULL`),
      pool.query(`SELECT prenom, nom FROM personne`),
      pool.query(`
        SELECT
          min(substring(date_naissance::text from '\\d{4}')::int) AS naissance_min,
          max(substring(date_naissance::text from '\\d{4}')::int) AS naissance_max,
          min(substring(date_deces::text from '\\d{4}')::int)    AS deces_min,
          max(substring(date_deces::text from '\\d{4}')::int)    AS deces_max
        FROM personne
      `),
    ]);

    // Prénom = premier mot de « prénom nom » ; nom = le reste (même découpage que le front)
    const firstNames = [];
    const lastNames = [];
    for (const r of namesResult.rows) {
      const parts = [r.prenom, r.nom].filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean);
      if (parts[0]) firstNames.push(parts[0]);
      if (parts.length > 1) lastNames.push(parts.slice(1).join(" "));
    }

    const y = yearsResult.rows[0] ?? {};
    const currentYear = new Date().getFullYear();

    res.json({
      firstNames: sortUnique(firstNames),
      lastNames: sortUnique(lastNames),
      naissanceRange: { min: y.naissance_min ?? 1850, max: y.naissance_max ?? currentYear },
      decesRange: { min: y.deces_min ?? 1914, max: y.deces_max ?? 1918 },
      lieuxNaissance,
      lieuxDeces,
      lieuxInhumation,
      regiments,
      sections,
      bureauxRecrutement,
      motifsDeces,
      classesService,
      // Pas de donnée en base pour ces listes : vides (les départements sont fournis par le front)
      departementsNaissance: [],
      departementsDeces: [],
      monuments: [],
      eglises: [],
      livresOr: [],
      decorations: [],
      professions: [],
      tags: [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /poilus/:id
app.get("/poilus/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(404).json({ error: "Introuvable" });
    const result = await pool.query(`${SELECT_POILU} WHERE p.id = $1`, [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Introuvable" });
    res.json(toPoilu(result.rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.port, () => {
  console.log(`API en cours d'exécution sur http://localhost:${config.port}`);
});
