import { tables } from "./csv-db";
import { DEPARTEMENT_LABELS, departementCode } from "./departements";


export interface Poilu {
  id: string;
  nom: string;
  naissance: number | null;
  naissance_date: string;
  lieu_naissance: string;
  departement_naissance: string;
  deces: string;
  lieu: string;
  departement_deces: string;
  regiment: string;
  section: string;
  metier: string;
  tags: string[];
  monument_aux_morts: string;
  eglise: string;
  livre_or: string;
  classe_service: string;
  bureau_recrutement: string;
  decorations: string[];
  lieu_inhumation: string;
  motif_deces: string;
  photo?: string;
  resume: string;
  sections: [string, string][];
  glossaire?: [string, string][];
}

export interface PoiluSearchFilters {
  name?: string;
  firstName?: string;
  lastName?: string;
    dateNaissanceMin?: number;
  dateNaissanceMax?: number;
    dateNaissanceMinMois?: number | undefined; // 1 à 12, défaut : janvier
  dateNaissanceMaxMois?: number | undefined; // 1 à 12, défaut : décembre
  lieuNaissance?: string;
  departementNaissance?: string;
    dateDecesMin?: number;
  dateDecesMax?: number;
    dateDecesMinMois?: number | undefined; // 1 à 12, défaut : janvier
  dateDecesMaxMois?: number | undefined; // 1 à 12, défaut : décembre
  lieuDeces?: string;
  departementDeces?: string;
  regiment?: string;
  section?: string;
  monumentAuxMorts?: string;
  eglise?: string;
  livreDor?: string;
  classeService?: string;
  bureauRecrutement?: string;
  decorations?: string;
  profession?: string;
  lieuInhumation?: string;
  motifDeces?: string;
  tag?: string;
}

export interface DateRange {
  min: number;
  max: number;
}

export const poilus: Poilu[] = [
  {
    id: "camille-bernard",
    nom: "Camille Bernard",
    naissance: 1892,
    naissance_date: "1892",
    lieu_naissance: "Saint-Mard-sur-le-Mont",
    departement_naissance: "Marne",
    deces: "1914-09-10",
    lieu: "Saint-Mard-sur-le-Mont",
    departement_deces: "Marne",
    regiment: "42e RI",
    section: "3e section",
    metier: "Cultivateur",
    tags: ["Marne", "Infanterie", "Mobilisé"],
    monument_aux_morts: "Saint-Mard-sur-le-Mont",
    eglise: "Église Saint-Jean",
    livre_or: "Livre d'or du souvenir 14-18",
    classe_service: "1912",
    bureau_recrutement: "Châlons-en-Champagne",
    decorations: ["Croix de guerre"],
    lieu_inhumation: "Cimetière communal de Saint-Mard-sur-le-Mont",
    motif_deces: "Tué au combat",
    resume: "Fils d'agriculteurs champenois, mort à vingt-deux ans lors de la première bataille de la Marne.",
    sections: [
      ["Une jeunesse à la ferme", "Camille travaille les terres de sa famille près d'Épernay. Il se fiancé en 1913 avec Louise, la fille du voisin."],
      ["La mobilisation", "Appelé dès le 2 août 1914, il rejoint le 42e régiment d'infanterie et participe à la retraite de Belgique."],
      ["La Marne", "Tué le 10 septembre 1914 dans les bois de Saint-Mard, alors que son bataillon tente de contenir l'avancée allemande."]
    ],
    glossaire: [
      ["RI", "Régiment d'infanterie."],
      ["Bataille de la Marne", "Victoire alliée de septembre 1914 qui arrête l'offensive allemande sur Paris."]
    ]
  },
  {
    id: "jules-fournier",
    nom: "Jules Fournier",
    naissance: 1887,
    naissance_date: "1887",
    lieu_naissance: "Liévin",
    departement_naissance: "Pas-de-Calais",
    deces: "1915-09-25",
    lieu: "Givenchy-en-Gohelle",
    departement_deces: "Pas-de-Calais",
    regiment: "58e RI",
    section: "2e compagnie",
    metier: "Mineur",
    tags: ["Artois", "Infanterie", "Syndiqué"],
    monument_aux_morts: "Monument aux morts de Liévin",
    eglise: "Église Saint-Joseph",
    livre_or: "Livre d'or de la ville de Liévin",
    classe_service: "1907",
    bureau_recrutement: "Lens",
    decorations: ["Médaille militaire"],
    lieu_inhumation: "Cimetière militaire de Givenchy-en-Gohelle",
    motif_deces: "Disparu au combat",
    resume: "Mineur du bassin houiller lensois, mort à vingt-huit ans lors de l'offensive d'Artois.",
    sections: [
      ["Sous terre avant le front", "Jules descend dans la fosse de Liévin dès l'âge de quatorze ans. Syndiqué, il milite pour de meilleures conditions."],
      ["L'Artois", "En septembre 1915, son unité participe à l'assaut vers la côte 70, au nord de Lens."],
      ["Disparu", "Son corps n'a jamais été retrouvé. Son nom est inscrit sur le monument aux morts de Liévin."]
    ],
    glossaire: [
      ["Offensive d'Artois", "Grande offensive franco-britannique de mai-juin 1915, relancée en automne."]
    ]
  },
  {
    id: "augustin-morel",
    nom: "Augustin Morel",
    naissance: 1895,
    naissance_date: "1895",
    lieu_naissance: "Paris",
    departement_naissance: "Paris",
    deces: "1916-07-12",
    lieu: "Longueval",
    departement_deces: "Somme",
    regiment: "23e RI",
    section: "1re compagnie",
    metier: "Boulanger",
    tags: ["Somme", "Infanterie", "Parisien"],
    monument_aux_morts: "Monument aux morts du Faubourg Saint-Antoine",
    eglise: "Église Saint-Ambroise",
    livre_or: "Livre d'or de la mairie du 11e arrondissement",
    classe_service: "1915",
    bureau_recrutement: "Paris",
    decorations: ["Croix de guerre"],
    lieu_inhumation: "Nécropole nationale de Longueval",
    motif_deces: "Blessé puis mort des suites du combat",
    resume: "Boulanger du Faubourg Saint-Antoine, tué à vingt-et-un ans dans la bataille de la Somme.",
    sections: [
      ["Le fournil parisien", "Augustin lève la pâte chaque nuit dans la boulangerie familiale. Ses clients apprécient son caractère jovial."],
      ["Juillet 1916", "Son régiment est engagé dans les bois de Trônes, près de Longueval, où les combats sont particulièrement meurtriers."],
      ["Deuil", "Sa mère gardera jusqu'à sa mort le livret militaire et une mèche de cheveux d'Augustin."]
    ],
    glossaire: [
      ["Bataille de la Somme", "Offensive majeure de juillet à novembre 1916 sur le front occidental."]
    ]
  },
  {
    id: "emile-garnier",
    nom: "Émile Garnier",
    naissance: 1889,
    naissance_date: "1889",
    lieu_naissance: "Le Monteil",
    departement_naissance: "Creuse",
    deces: "1917-04-16",
    lieu: "Braye-en-Laonnois",
    departement_deces: "Aisne",
    regiment: "151e RI",
    section: "4e section",
    metier: "Instituteur",
    tags: ["Chemin des Dames", "Infanterie", "Instruction"],
    monument_aux_morts: "Monument aux morts de la Creuse",
    eglise: "Église Saint-Pierre",
    livre_or: "Livre d'or de l'école de la Creuse",
    classe_service: "1909",
    bureau_recrutement: "Guéret",
    decorations: ["Médaille de la Reconnaissance française"],
    lieu_inhumation: "Cimetière de Braye-en-Laonnois",
    motif_deces: "Tué lors de l'offensive Nivelle",
    resume: "Instituteur laïque de la Creuse, mort à vingt-huit ans au début de l'offensive Nivelle.",
    sections: [
      ["La classe", "Émile enseigne dans un village de la Creuse. Il partage son temps entre l'école, la bibliothèque et les réunions de la Ligue des droits de l'homme."],
      ["Le Chemin des Dames", "Le 16 avril 1917, son régiment monte à l'assaut sous un barrage allemand nourri."],
      ["Mémoire", "Ses élèves plantent un marronnier dans la cour de l'école en son honneur."]
    ],
    glossaire: [
      ["Offensive Nivelle", "Offensive française d'avril 1917 sur le Chemin des Dames, vivement contestée par les soldats."]
    ]
  },
  {
    id: "marcel-lefranc",
    nom: "Marcel Lefranc",
    naissance: 1894,
    naissance_date: "1894",
    lieu_naissance: "Roubaix",
    departement_naissance: "Nord",
    deces: "1918-05-27",
    lieu: "Pontavert",
    departement_deces: "Aisne",
    regiment: "6e BCP",
    section: "3e section de chasseurs",
    metier: "Comptable",
    tags: ["Aisne", "Chasseurs", "Volontaire"],
    monument_aux_morts: "Monument aux morts de Roubaix",
    eglise: "Église Saint-Éloi",
    livre_or: "Livre d'or du bataillon de chasseurs",
    classe_service: "1914",
    bureau_recrutement: "Lille",
    decorations: ["Croix de guerre"],
    lieu_inhumation: "Cimetière de Pontavert",
    motif_deces: "Tué lors d'une contre-offensive allemande",
    resume: "Comptable lillois engagé volontaire, tué à vingt-quatre ans quelques mois avant l'armistice.",
    sections: [
      ["Le bureau", "Marcel tient les comptes d'une filature de Roubaix. Il rêve de devenir avoué après la guerre."],
      ["Chasseur", "Engagé en 1914, il sert dans un bataillon de chasseurs à pied et est blessé une première fois en 1916."],
      ["Mai 1918", "Il tombe lors de l'offensive allemande sur l'Aisne, alors que son unité tente de protéger le passage de la Vesle."]
    ],
    glossaire: [
      ["BCP", "Bataillon de chasseurs à pied."]
    ]
  },
  {
    id: "antoine-duval",
    nom: "Antoine Duval",
    naissance: 1890,
    naissance_date: "1890",
    lieu_naissance: "Bernay",
    departement_naissance: "Eure",
    deces: "1918-10-23",
    lieu: "Romagne-sous-Montfaucon",
    departement_deces: "Meuse",
    regiment: "128e RI",
    section: "2e compagnie",
    metier: "Charpentier",
    tags: ["Meuse", "Infanterie", "Normand"],
    monument_aux_morts: "Monument aux morts de l'Eure",
    eglise: "Église Saint-Étienne",
    livre_or: "Livre d'or du régiment de l'Eure",
    classe_service: "1910",
    bureau_recrutement: "Évreux",
    decorations: ["Médaille militaire"],
    lieu_inhumation: "Nécropole de Romagne-sous-Montfaucon",
    motif_deces: "Mort des suites d'un éclat d'obus",
    resume: "Charpentier normand, mort à vingt-huit ans dans les dernières semaines de la guerre, à l'ouest de Verdun.",
    sections: [
      ["Les charpentes", "Antoine travaille avec son père dans l'Eure. Il aime dessiner les plans des églises du pays d'Ouche."],
      ["La Meuse", "Mobilisé en 1914, il passe quatre ans dans les secteurs de Verdun et de l'Argonne."],
      ["Octobre 1918", "Tué par un éclat d'obus alors que son régiment avance vers la ligne Hindenburg, à quelques jours de la fin des combats."]
    ],
    glossaire: [
      ["Argonne", "Forêt et plateau de l'est de la France, théâtre de combats acharnés de 1914 à 1918."]
    ]
  }
];

export function getPoiluById(id: string): Poilu | undefined {
  return poilus.find(p => p.id === id);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  poilus.forEach(p => {
    p.tags.forEach(tag => {
      if (tag !== p.metier) tags.add(tag);
    });
  });
  return Array.from(tags).sort();
}

export function getFilteredTags(searchQuery: string): string[] {
  const allTags = getAllTags();
  const query = searchQuery.toLowerCase();
  return allTags.filter(tag => tag.toLowerCase().startsWith(query));
}

// export function getFilterOptions() {
//   return {
//     names: poilus.map((poilu) => poilu.nom).sort((a, b) => a.localeCompare(b)),
//     datesNaissance: Array.from(new Set(poilus.map((poilu) => poilu.naissance_date).filter(Boolean))).sort(),
//     lieuxNaissance: Array.from(new Set(poilus.map((poilu) => poilu.lieu_naissance).filter(Boolean))).sort(),
//     departementsNaissance: Array.from(new Set(poilus.map((poilu) => poilu.departement_naissance).filter(Boolean))).sort(),
//     datesDeces: Array.from(new Set(poilus.map((poilu) => poilu.deces).filter(Boolean))).sort(),
//     lieuxDeces: Array.from(new Set(poilus.map((poilu) => poilu.lieu).filter(Boolean))).sort(),
//     departementsDeces: Array.from(new Set(poilus.map((poilu) => poilu.departement_deces).filter(Boolean))).sort(),
//     regiments: Array.from(new Set(poilus.map((poilu) => poilu.regiment).filter(Boolean))).sort(),
//     sections: Array.from(new Set(poilus.map((poilu) => poilu.section).filter(Boolean))).sort(),
//     monuments: Array.from(new Set(poilus.map((poilu) => poilu.monument_aux_morts).filter(Boolean))).sort(),
//     eglises: Array.from(new Set(poilus.map((poilu) => poilu.eglise).filter(Boolean))).sort(),
//     livresOr: Array.from(new Set(poilus.map((poilu) => poilu.livre_or).filter(Boolean))).sort(),
//     classesService: Array.from(new Set(poilus.map((poilu) => poilu.classe_service).filter(Boolean))).sort(),
//     bureauxRecrutement: Array.from(new Set(poilus.map((poilu) => poilu.bureau_recrutement).filter(Boolean))).sort(),
//     decorations: Array.from(new Set(poilus.flatMap((poilu) => poilu.decorations).filter(Boolean))).sort(),
//     professions: Array.from(new Set(poilus.map((poilu) => poilu.metier).filter(Boolean))).sort(),
//     lieuxInhumation: Array.from(new Set(poilus.map((poilu) => poilu.lieu_inhumation).filter(Boolean))).sort(),
//     motifsDeces: Array.from(new Set(poilus.map((poilu) => poilu.motif_deces).filter(Boolean))).sort(),
//   };
// }

export function getFilterOptions() {
  const naissanceYears = poilus
    .map((p) => parseInt(p.naissance_date, 10))
    .filter((year): year is number => Number.isFinite(year));

  const decesYears = poilus
    .map((p) => parseInt(p.deces.split("-")[0], 10))
    .filter((year): year is number => Number.isFinite(year));

  const regimentLabels = Array.from(
    new Set((tables.regiment ?? []).map((row) => row.libelle).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const sectionLabels = Array.from(
    new Set((tables.section ?? []).map((row) => row.libelle).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const motifDecesLabels = Array.from(
    new Set((tables.cause ?? []).map((row) => row.libelle).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const firstNames = Array.from(
    new Set(poilus.map((poilu) => poilu.nom.split(/\s+/)[0]).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const lastNames = Array.from(
    new Set(
      poilus
        .map((poilu) => {
          const parts = poilu.nom.split(/\s+/).filter(Boolean);
          return parts.slice(1).join(" ");
        })
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const lieuxNaissance = Array.from(
    new Set(poilus.map((poilu) => poilu.lieu_naissance).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

    // Liste complète des départements (référentiel), au format « Nom (code) »
  const departementsNaissance = DEPARTEMENT_LABELS;


  const lieuxDeces = Array.from(
    new Set(poilus.map((poilu) => poilu.lieu).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

    const departementsDeces = DEPARTEMENT_LABELS;


  const monuments = Array.from(
    new Set(poilus.map((poilu) => poilu.monument_aux_morts).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const eglises = Array.from(
    new Set(poilus.map((poilu) => poilu.eglise).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const livresOr = Array.from(
    new Set(poilus.map((poilu) => poilu.livre_or).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const classesService = Array.from(
    new Set(poilus.map((poilu) => poilu.classe_service).filter(Boolean))
  ).sort((a, b) => Number(a) - Number(b));

  const bureauxRecrutement = Array.from(
    new Set(poilus.map((poilu) => poilu.bureau_recrutement).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const decorations = Array.from(
    new Set(poilus.flatMap((poilu) => poilu.decorations).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const professions = Array.from(
    new Set(poilus.map((poilu) => poilu.metier).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  const lieuxInhumation = Array.from(
    new Set(poilus.map((poilu) => poilu.lieu_inhumation).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));

  return {
    names: firstNames,
    firstNames,
    lastNames,
    naissanceRange: {
      min: Math.min(...naissanceYears),
      max: Math.max(...naissanceYears),
    },
    decesRange: {
      min: Math.min(...decesYears),
      max: Math.max(...decesYears),
    },
    lieuxNaissance,
    departementsNaissance,
    datesDeces: ["1914", "1915", "1916", "1917", "1918"],
    lieuxDeces,
    departementsDeces,
    regiments: regimentLabels,
    sections: sectionLabels,
    monuments,
    eglises,
    livresOr,
    classesService,
    bureauxRecrutement,
    decorations,
    professions,
    lieuxInhumation,
    motifsDeces: motifDecesLabels,
  };
}

// Par défaut : même machine que la page, port 3001 (API lancée avec `node server.js`).
const API_URL =
  import.meta.env["VITE_POILUS_API_URL"] ??
  (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:3001` : "");

// Champs absents de la base (voir MANQUANT_BASE.md) : valeurs vides par défaut.
function fromApi(raw: Partial<Poilu> & Pick<Poilu, "id" | "nom">): Poilu {
  return {
    naissance: null,
    naissance_date: "",
    lieu_naissance: "",
    departement_naissance: "",
    deces: "",
    lieu: "",
    departement_deces: "",
    regiment: "",
    section: "",
    metier: "",
    tags: [],
    monument_aux_morts: "",
    eglise: "",
    livre_or: "",
    classe_service: "",
    bureau_recrutement: "",
    decorations: [],
    lieu_inhumation: "",
    motif_deces: "",
    resume: "",
    sections: [],
    ...raw,
  };
}

export async function fetchPoilus(params: { anneeDeces?: string | undefined } = {}): Promise<Poilu[]> {
    const qs = new URLSearchParams({ limit: "1000" });
  if (params.anneeDeces) qs.set("annee_deces", params.anneeDeces);
  let res: Response;
  try {
    res = await fetch(`${API_URL}/poilus?${qs}`);
  } catch {
    // Erreur réseau (serveur arrêté, mauvaise URL, mixed content http/https, CORS)
    throw new Error(`requête refusée vers ${API_URL || "(URL vide)"}`);
  }
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()).map(fromApi);
}

export async function fetchPoiluById(id: string): Promise<Poilu | null> {
  const res = await fetch(`${API_URL}/poilus/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}`);
  return fromApi(await res.json());
}

// Découpe une date (« 1916-09-18 », « 1916-09 », « 1916 » ou « 18/09/1916 ») en année et mois.
function parseYearMonth(value: string): { year: number; month: number | undefined } | null {
  const iso = value.match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (iso) return { year: Number(iso[1]), month: iso[2] ? Number(iso[2]) : undefined };
  const fr = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (fr) return { year: Number(fr[3]), month: Number(fr[2]) };
  return null;
}

// Compare une date à une plage « mois/année de début » -> « mois/année de fin ».
// Les bornes sont converties en nombre de mois (année × 12 + mois).
// Si la fiche n'a que l'année, seule l'année est comparée.
function matchesDateRange(
  value: string,
  minYear?: number,
  maxYear?: number,
  minMonth?: number,
  maxMonth?: number,
): boolean {
  if (minYear === undefined && maxYear === undefined) return true;
  const parsed = parseYearMonth(value);
  if (!parsed) return false;

  if (parsed.month === undefined) {
    return (minYear === undefined || parsed.year >= minYear) && (maxYear === undefined || parsed.year <= maxYear);
  }

  const index = parsed.year * 12 + parsed.month - 1;
  const lower = minYear === undefined ? -Infinity : minYear * 12 + (minMonth ?? 1) - 1;
  const upper = maxYear === undefined ? Infinity : maxYear * 12 + (maxMonth ?? 12) - 1;
  return index >= lower && index <= upper;
}

export function searchPoilus(
  query: string,
  tag?: string,
  filters?: PoiluSearchFilters,
  source: Poilu[] = poilus,
): Poilu[] {
  const q = query.toLowerCase();

  return source.filter((p) => {
    const fields = [p.nom, p.regiment, p.lieu, p.metier, p.departement_deces, p.lieu_naissance, p.departement_naissance];
    const matchesQuery = !q || fields.some((field) => field.toLowerCase().startsWith(q));
    const filterTag = tag || filters?.tag;
    const matchesTag = !filterTag || p.tags.includes(filterTag);

    const nameParts = p.nom.trim().split(/\s+/).filter(Boolean);
    const firstNameValue = nameParts[0] ?? "";
    const lastNameValue = nameParts.slice(1).join(" ");
    const matchesName = !filters?.name || p.nom.toLowerCase().startsWith(filters.name.toLowerCase());
    const matchesFirstName = !filters?.firstName || firstNameValue.toLowerCase().startsWith(filters.firstName.toLowerCase());
    const matchesLastName = !filters?.lastName || lastNameValue.toLowerCase().startsWith(filters.lastName.toLowerCase());
    const hasSplitNameFilter = Boolean(filters?.firstName || filters?.lastName);
    const matchesSplitName = !hasSplitNameFilter || (matchesFirstName && matchesLastName);

        const matchesDateNaissance = matchesDateRange(
      p.naissance_date,
      filters?.dateNaissanceMin,
      filters?.dateNaissanceMax,
      filters?.dateNaissanceMinMois,
      filters?.dateNaissanceMaxMois,
    );

    
    const matchesLieuNaissance = !filters?.lieuNaissance || p.lieu_naissance.toLowerCase() === filters.lieuNaissance.toLowerCase();
    const matchesDepartementNaissance = !filters?.departementNaissance || departementCode(p.departement_naissance) === departementCode(filters.departementNaissance);
    
        const matchesDateDeces = matchesDateRange(
      p.deces,
      filters?.dateDecesMin,
      filters?.dateDecesMax,
      filters?.dateDecesMinMois,
      filters?.dateDecesMaxMois,
    );

    
    const matchesLieuDeces = !filters?.lieuDeces || p.lieu.toLowerCase() === filters.lieuDeces.toLowerCase();
    const matchesDepartementDeces = !filters?.departementDeces || departementCode(p.departement_deces) === departementCode(filters.departementDeces);
    const matchesRegiment = !filters?.regiment || p.regiment.toLowerCase() === filters.regiment.toLowerCase();
    const matchesSection = !filters?.section || p.section.toLowerCase() === filters.section.toLowerCase();
    const matchesMonument = !filters?.monumentAuxMorts || p.monument_aux_morts.toLowerCase() === filters.monumentAuxMorts.toLowerCase();
    const matchesEglise = !filters?.eglise || p.eglise.toLowerCase() === filters.eglise.toLowerCase();
    const matchesLivreDor = !filters?.livreDor || p.livre_or.toLowerCase() === filters.livreDor.toLowerCase();
    const matchesClasseService = !filters?.classeService || p.classe_service === filters.classeService;
    const matchesBureau = !filters?.bureauRecrutement || p.bureau_recrutement.toLowerCase() === filters.bureauRecrutement.toLowerCase();
    const matchesDecorations = !filters?.decorations || p.decorations.some((value) => value.toLowerCase() === filters.decorations?.toLowerCase());
    const matchesProfession = !filters?.profession || p.metier.toLowerCase() === filters.profession.toLowerCase();
    const matchesLieuInhumation = !filters?.lieuInhumation || p.lieu_inhumation.toLowerCase() === filters.lieuInhumation.toLowerCase();
    const matchesMotifDeces = !filters?.motifDeces || p.motif_deces.toLowerCase() === filters.motifDeces.toLowerCase();

    return matchesQuery && matchesTag && matchesName && matchesSplitName && matchesDateNaissance && matchesLieuNaissance && matchesDepartementNaissance && matchesDateDeces && matchesLieuDeces && matchesDepartementDeces && matchesRegiment && matchesSection && matchesMonument && matchesEglise && matchesLivreDor && matchesClasseService && matchesBureau && matchesDecorations && matchesProfession && matchesLieuInhumation && matchesMotifDeces;
  }).sort((a, b) => a.nom.localeCompare(b.nom));
}
