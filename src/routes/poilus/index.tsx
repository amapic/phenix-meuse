import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, type KeyboardEvent } from "react";
import { Slider } from "@/components/ui/slider";
import {
  fetchPoilus,
  getFilterOptions,
  getAllTags,
  searchPoilus,
  type Poilu,
  type PoiluSearchFilters,
} from "../../lib/poilus";
// #coucou
export const Route = createFileRoute("/poilus/")({
  head: () => ({
    meta: [
      {
        title: "Annuaire des Poilus — Mémoire en Meuse",
      },
      {
        name: "description",
        content:
          "Découvrez les biographies de soldats tombés en Meuse pendant la Première Guerre mondiale. Retrouvez leurs parcours et le lieu où ils reposent.",
      },
    ],
  }),
  component: PoilusPage,
});

function PlaceholderAvatar({ name }: { name: string }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }

  return (
    <div
      className="h-full w-full flex items-center justify-center text-sm font-mono text-white"
      style={{
        background: `linear-gradient(135deg, hsl(${h}, 60%, 45%), hsl(${h}, 60%, 35%))`,
      }}
    >
      {name.charAt(0)}
    </div>
  );
}

function PoiluCard({ poilu }: { poilu: Poilu }) {
  return (
    <a
      href={`/poilus/${poilu.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="h-48 w-full overflow-hidden bg-muted">
        {poilu.photo ? (
          <img
            src={poilu.photo}
            alt={`Portrait de ${poilu.nom}`}
            className="h-full w-full object-cover grayscale sepia-[.25] transition-all group-hover:grayscale-0"
          />
        ) : (
          <PlaceholderAvatar name={poilu.nom} />
        )}
      </div>
      <div className="flex-1 p-4">
        <p className="font-display font-semibold text-foreground">{poilu.nom}</p>
        <p className="text-xs text-muted">
          {poilu.naissance} – {poilu.deces.split("-")[0]}
        </p>
      </div>
    </a>
  );
}

function Monogram() {
  return (
    <div className="grid size-8 place-items-center rounded-full bg-primary/90">
      <span className="font-mono text-[10px] tracking-widest text-primary-foreground">M</span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Tous</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type SuggestionItem = { key: string; label: string };

function SuggestionList({
  items,
  activeIndex,
  onSelect,
  onHover,
}: {
  items: SuggestionItem[];
  activeIndex: number;
  onSelect: (key: string) => void;
  onHover?: (index: number) => void;
}) {
  return (
    <ul
      role="listbox"
      className="max-h-64 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg shadow-black/5"
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        return (
          <li key={item.key} role="option" aria-selected={isActive}>
            <button
              type="button"
              onMouseDown={(event) => {
                // Evite de perdre le focus du champ avant la sélection
                event.preventDefault();
                onSelect(item.key);
              }}
              onMouseEnter={() => onHover?.(index)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// Valeurs proposées sous la chip, selon le champ choisi
function getFieldValueOptions(
  field: string,
  options: ReturnType<typeof getFilterOptions> & { tags?: string[] },
): string[] {
  const lists: Record<string, readonly unknown[] | undefined> = {
    "Prénom": options.firstNames,
    "Nom": options.lastNames,
    "Lieu de naissance": options.lieuxNaissance,
    "Département de naissance": options.departementsNaissance,
    "Lieu de décès": options.lieuxDeces,
    "Département de décès": options.departementsDeces,
    "Régiment": options.regiments,
    "Compagnie / section": options.sections,
    "Monument aux morts": options.monuments,
    "Église": options.eglises,
    "Livre d'or": options.livresOr,
    "Classe du service militaire": options.classesService,
    "Bureau de recrutement": options.bureauxRecrutement,
    "Décoration(s)": options.decorations,
    "Profession": options.professions,
    "Lieu d'inhumation": options.lieuxInhumation,
        "Motif du décès": options.motifsDeces,

  };
  return (lists[field] ?? []).filter((option): option is string => typeof option === "string");
}

function getAutocompletePlaceholder(label: string) {
  const examples: Record<string, string> = {
    "Prénom": "Ex : Jean, Louis",
    "Nom": "Ex : Martin, Dubois",
    "Lieu de naissance": "Ex : Lyon, Paris",
    "Département de naissance": "Ex : Meuse, Nord",
    "Lieu de décès": "Ex : Verdun, Saint-Mihiel",
    "Département de décès": "Ex : Meuse, Moselle",
    "Monument aux morts": "Ex : Place de la mairie",
    "Église": "Ex : Église Saint-Martin",
    "Livre d'or": "Ex : Livre d'or 14-18",
    "Classe du service militaire": "Ex : 1914, 1915",
    "Bureau de recrutement": "Ex : Verdun, Bar-le-Duc",
    "Décoration(s)": "Ex : Croix de guerre, Médaille militaire",
    "Profession": "Ex : Menuisier, Agriculteur",
    "Lieu d'inhumation": "Ex : Nécropole nationale",
        "Motif du décès": "Ex : Tué au combat, Blessé",

  };

  return examples[label] ?? `Ex : ${label}`;
}

function FreeAutocompleteField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const query = inputValue.trim().toLowerCase();
  const matches = options.filter((option) => option.toLowerCase().startsWith(query)).slice(0, 8);

  const commit = (next: string) => {
    onChange(next);
    setInputValue(next);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) => Math.min(prev + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const picked = open && activeIndex >= 0 ? matches[activeIndex] : undefined;
      const next = (picked ?? inputValue).trim();
      if (!next) return;
      commit(next);
    }
  };

  const handleBlur = () => {
    setOpen(false);
    setActiveIndex(-1);
    const trimmed = inputValue.trim();
    if (trimmed) {
      onChange(trimmed);
      setInputValue(trimmed);
    }
  };

  return (
    <div className="block space-y-2">
      <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          placeholder={getAutocompletePlaceholder(label)}
          onChange={(event) => {
            setInputValue(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label={label}
          aria-expanded={open && matches.length > 0}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {open && matches.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1">
            <SuggestionList
              items={matches.map((option) => ({ key: option, label: option }))}
              activeIndex={activeIndex}
              onSelect={commit}
              onHover={setActiveIndex}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRangeSlider({
  label,
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const handleValueChange = (values: number[]) => {
    const safeValues = values.length >= 2 ? values.slice(0, 2) : [valueMin, valueMax];
    const [nextMin, nextMax] = safeValues
      .map((value) => (Number.isFinite(value) ? value : 0))
      .sort((a, b) => a - b);

    onChange(nextMin, nextMax);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
          {valueMin} – {valueMax}
        </span>
      </div>

      <Slider
        value={[valueMin, valueMax]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleValueChange}
        aria-label={label}
        className="py-1"
      />

      
    </div>
  );
}

const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

// Mois de début et de fin, placés sous leur année respective du curseur au-dessus
function MonthRangeSelects({
  label,
  startYear,
  endYear,
  startMonth,
  endMonth,
  onChange,
}: {
  label: string;





    startYear: number;
  endYear: number;
  startMonth: number | undefined;
  endMonth: number | undefined;
  onChange: (startMonth: number | undefined, endMonth: number | undefined) => void;
}) {
  const selectClass =
    "w-full rounded-lg border border-border bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  return (
    <div className="grid grid-cols-2 gap-x-6">
      <div className="space-y-1.5 rounded-lg border border-border p-2.5">
        <p className="flex items-baseline justify-between text-[11px] text-muted">
          <span>De {startYear}</span>
          <span className="text-[9px] uppercase tracking-[0.16em]">mois</span>
        </p>
        <select
          aria-label={`${label} : mois de début`}
          value={startMonth ?? ""}
          onChange={(event) =>
            onChange(event.target.value ? Number(event.target.value) : undefined, endMonth)
          }
          className={selectClass}
        >
          <option value="">Janvier</option>
          {MONTHS.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5 rounded-lg border border-border p-2.5">
        <p className="flex items-baseline justify-between text-[11px] text-muted">
          <span>À {endYear}</span>
          <span className="text-[9px] uppercase tracking-[0.16em]">mois</span>
        </p>
        <select
          aria-label={`${label} : mois de fin`}
          value={endMonth ?? ""}
          onChange={(event) =>
            onChange(startMonth, event.target.value ? Number(event.target.value) : undefined)
          }
          className={selectClass}
        >
          <option value="">Décembre</option>
          {MONTHS.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-border pb-1 font-display text-sm font-semibold text-primary">
      {children}
    </h3>
  );
}

const EMPTY_FILTERS: PoiluSearchFilters = {};

type SearchChip = {
  id: string;
  field: string;
  value: string;
  label: string;
};

function getChipSuggestions(value: string, options: ReturnType<typeof getFilterOptions> & { tags?: string[] }) {
  const normalized = value.trim();
  if (!normalized) return ["Recherche libre"];

  const lower = normalized.toLowerCase();
  const suggestions = new Set<string>();

  if (/^\d{4}$/.test(normalized)) {
    suggestions.add("Date de naissance");
    suggestions.add("Date de décès");
  }

  if (options.firstNames.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Prénom");
  }

  if (options.lastNames.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Nom");
  }

  if (options.lieuxNaissance.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Lieu de naissance");
  }

  if (options.lieuxDeces.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Lieu de décès");
  }

  if (options.regiments.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Régiment");
  }

  if (options.sections.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Compagnie / section");
  }

  if (options.professions.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Profession");
  }

  if (options.motifsDeces.some((option) => option.toLowerCase() === lower)) {
    suggestions.add("Motif du décès");
  }

  

  return suggestions.size > 0 ? Array.from(suggestions) : ["Recherche libre"];
}



function getSearchSuggestions(query: string, options: ReturnType<typeof getFilterOptions> & { tags?: string[] }): string[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  // Liste des noms de catégories disponibles
  const categoryNames = [
    "Prénom",
    "Nom",
    "Date de naissance",
    "Lieu de naissance",
    "Département de naissance",
    "Date de décès",
    "Lieu de décès",
    "Département de décès",
    "Régiment",
    "Compagnie / section",
    "Monument aux morts",
    "Église",
    "Livre d'or",
    "Classe du service militaire",
    "Bureau de recrutement",
    "Décoration(s)",
    "Profession",
    "Lieu d'inhumation",
        "Motif du décès"
  ];

  // Filtre uniquement sur les noms de catégories
  const matchingCategories = categoryNames.filter(cat =>
    cat.toLowerCase().startsWith(normalized)
  );

  // Retourne uniquement les noms des catégories
  return matchingCategories.slice(0, 10);
}

function PoilusPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchChips, setSearchChips] = useState<SearchChip[]>([]);
    const [pendingChip, setPendingChip] = useState<{
    value: string;
    field: string;
    suggestions: string[];
  } | null>(null);
  // Champ choisi dans la liste, en attente de la valeur tapée par l'utilisateur
  const [pendingField, setPendingField] = useState<string | null>(null);
  // Valeur tapée dans la chip du champ (distincte de la recherche libre)
  const [fieldValue, setFieldValue] = useState("");
  // Suggestion de valeur surlignée dans la chip
  const [fieldIndex, setFieldIndex] = useState(-1);



  const [filters, setFilters] = useState<PoiluSearchFilters>(EMPTY_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [suggestionsIndex, setSuggestionsIndex] = useState<number>(-1);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);

  const [all, setAll] = useState<Poilu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const options = useMemo(() => {
    const filterOptions = getFilterOptions();
    return {
      ...filterOptions,
      tags: getAllTags(),
    } as ReturnType<typeof getFilterOptions> & { tags: string[] };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPoilus({})
      .then(setAll)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Update search suggestions when input changes
  useEffect(() => {
        if (searchInput.trim() && !pendingField) {
      const suggestions = getSearchSuggestions(searchInput, options);
      setSearchSuggestions(suggestions);
      setSuggestionsIndex(-1);
      setShowSuggestionsDropdown(true);
    } else {
      setSearchSuggestions([]);
      setSuggestionsIndex(-1);
      setShowSuggestionsDropdown(false);
    }
  }, [searchInput, options, pendingField]);

  // Close suggestions dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSuggestionsDropdown(false);
        setSuggestionsIndex(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const queryTerms = useMemo(() => {
    const tokens = [
      ...searchChips.map((chip) => chip.value),
      ...searchInput.split(/[\s,]+/).filter(Boolean),
    ];
    return Array.from(new Set(tokens.map((token) => token.trim()).filter(Boolean)));
  }, [searchChips, searchInput]);

  const searchQuery = queryTerms.join(" ");

  const results = useMemo(
    () => searchPoilus(searchQuery, undefined, filters, all),
    [searchQuery, filters, all]
  );

  const updateFilter = (key: keyof PoiluSearchFilters, value: string | number | undefined) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const addSearchChip = (value: string, field = "Recherche libre") => {
    const cleaned = value.trim().replace(/[\s,]+/g, " ");
    if (!cleaned) return;

    const chip: SearchChip = {
      id: `${field}-${cleaned}-${Date.now()}`,
      field,
      value: cleaned,
      label: field === "Recherche libre" ? cleaned : `${field} : ${cleaned}`,
    };

    setSearchChips((current) => {
      const exists = current.some(
        (item) =>
          item.field === chip.field && item.value.toLowerCase() === chip.value.toLowerCase()
      );
      return exists ? current : [...current, chip];
    });
        setPendingChip(null);
        setPendingField(null);
        setFieldValue("");
        setSearchInput("");
  };

  const removeSearchChip = (chipId: string) => {
    setSearchChips((current) => current.filter((chip) => chip.id !== chipId));
  };

  // Choisir un champ : on ne pré-remplit pas la valeur, l'utilisateur la tape ensuite
    const selectField = (field: string) => {
      setPendingField(field);
      setFieldValue("");
      setFieldIndex(-1);
    setPendingChip(null);
    setSearchInput("");
    setSuggestionsIndex(-1);
    setShowSuggestionsDropdown(false);
  };

    const cancelField = () => {
    setPendingField(null);
    setFieldValue("");
    setFieldIndex(-1);
  };

  const fieldMatches = pendingField
    ? getFieldValueOptions(pendingField, options)
        .filter((option) => option.toLowerCase().startsWith(fieldValue.trim().toLowerCase()))
        .slice(0, 8)
    : [];

  const commitFieldValue = (picked?: string) => {
    if (!pendingField) return;
    const cleaned = (picked ?? fieldValue).trim().replace(/[\s,]+/g, " ");
    if (!cleaned) return;
    addSearchChip(cleaned, pendingField);
  };



  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
            const cleaned = searchInput.trim().replace(/[\s,]+/g, " ");
      if (!cleaned) return;

      

      const suggestions = getChipSuggestions(cleaned, options);
      if (suggestions.length > 1 && suggestions[0] !== "Recherche libre") {
        setPendingChip({
          value: cleaned,
          field: suggestions[0],
          suggestions,
        });
        return;
      }

      addSearchChip(cleaned, suggestions[0]);
      return;
    }

    

    if (event.key === "Backspace" && searchInput === "" && searchChips.length > 0) {
      event.preventDefault();
      setSearchChips((current) => current.slice(0, -1));
    }
  };

  const resetFilters = () => {
        setSearchInput("");
        setPendingChip(null);
        setPendingField(null);
        setFieldValue("");
        setSearchChips([]);
    setFilters(EMPTY_FILTERS);
  };

  const setRange = (
    kind: "naissance" | "deces",
    nextMin: number,
    nextMax: number,
  ) => {
    setFilters((current) => {
      const minKey = kind === "naissance" ? "dateNaissanceMin" : "dateDecesMin";
      const maxKey = kind === "naissance" ? "dateNaissanceMax" : "dateDecesMax";

      return {
        ...current,
        [minKey]: nextMin,
        [maxKey]: nextMax,
      };
    });
  };

  // Un mois ne s'applique qu'avec une année : on fixe les années affichées si elles ne le sont pas encore
  const setMonths = (kind: "naissance" | "deces", startMonth?: number, endMonth?: number) => {
    setFilters((current) =>
      kind === "naissance"
        ? {
            ...current,
            dateNaissanceMin: current.dateNaissanceMin ?? naissanceMin,
            dateNaissanceMax: current.dateNaissanceMax ?? naissanceMax,
            dateNaissanceMinMois: startMonth,
            dateNaissanceMaxMois: endMonth,
          }
        : {
            ...current,
            dateDecesMin: current.dateDecesMin ?? decesMin,
            dateDecesMax: current.dateDecesMax ?? decesMax,
            dateDecesMinMois: startMonth,
            dateDecesMaxMois: endMonth,
          },
    );
  };

  const naissanceMin = filters.dateNaissanceMin ?? options.naissanceRange.min;
  const naissanceMax = filters.dateNaissanceMax ?? options.naissanceRange.max;
  const decesMin = filters.dateDecesMin ?? options.decesRange.min;
  const decesMax = filters.dateDecesMax ?? options.decesRange.max;

  return (
    <div className="min-h-screen bg-frost font-body text-foreground antialiased">
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
          <a href="/" className="flex items-center gap-3">
            <Monogram />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold italic tracking-tight">
                Mémoire en Meuse
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Annuaire des poilus
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 md:inline-block"
            >
              Retour à l'accueil
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10">
        <div className="animate-rise">
          <p className="font-mono mb-6 text-[11px] uppercase tracking-[0.25em] text-primary">
            1914–1918 · Mémoire vivante
          </p>
          <h1 className="font-display text-balance text-5xl leading-[0.95] font-semibold tracking-tight">
            Biographies <br />
            <em className="font-medium text-primary italic">des poilus</em>
          </h1>
          <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-foreground/80 text-pretty">
            Retrouvez les parcours de soldats tombés en Meuse. Leurs noms, leurs vies,
            et les lieux où ils reposent à jamais.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="glass rounded-2xl p-6">
          <div className="space-y-5">
            <div className="relative">
              <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50">
                {searchChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => removeSearchChip(chip.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/15"
                  >
                    {chip.label}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
                                {pendingField && (
                                  <span className="relative inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                                    <span className="uppercase tracking-[0.12em]">{pendingField} :</span>
                                    <input
                                      type="text"
                                      autoFocus
                                      value={fieldValue}
                                      onChange={(event) => {
                                        setFieldValue(event.target.value);
                                        setFieldIndex(-1);
                                      }}
                                                                            onKeyDown={(event) => {
                                        if (event.key === "ArrowDown") {
                                          event.preventDefault();
                                          setFieldIndex((prev) => Math.min(prev + 1, fieldMatches.length - 1));
                                        } else if (event.key === "ArrowUp") {
                                          event.preventDefault();
                                          setFieldIndex((prev) => Math.max(prev - 1, -1));
                                        } else if (event.key === "Enter" || event.key === ",") {
                                          event.preventDefault();
                                          commitFieldValue(fieldIndex >= 0 ? fieldMatches[fieldIndex] : undefined);
                                        } else if (event.key === "Escape") {
                                          event.preventDefault();
                                          cancelField();
                                        } else if (event.key === "Backspace" && fieldValue === "") {
                                          event.preventDefault();
                                          cancelField();
                                        }
                                      }}
                                      placeholder="Valeur…"
                                      aria-label={`Valeur pour ${pendingField}`}
                                      className="w-28 border-0 bg-transparent px-1 py-0 text-[11px] font-medium text-foreground placeholder:text-muted focus:outline-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={cancelField}
                                                                            aria-label="Annuler le champ"
                                      className="ml-1 text-muted hover:text-foreground"
                                    >
                                      ×
                                    </button>
                                    {/* Valeurs proposées pour le champ choisi, sous la chip */}
                                    {fieldMatches.length > 0 && (
                                      <div className="absolute left-0 top-full z-50 mt-2 w-56">
                                        <SuggestionList
                                          items={fieldMatches.map((option) => ({ key: option, label: option }))}
                                          activeIndex={fieldIndex}
                                          onSelect={(option) => addSearchChip(option, pendingField)}
                                          onHover={setFieldIndex}
                                        />
                                      </div>
                                    )}

                                  </span>
                                )}

                <input
                  type="search"
                  placeholder={searchChips.length > 0 ? "Ajouter un critère…" : "Recherche libre : nom, régiment, lieu, métier…"}
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    // Handle arrow keys for suggestion navigation
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      if (searchSuggestions.length > 0) {
                        setShowSuggestionsDropdown(true);
                        setSuggestionsIndex(prev => 
                          prev < searchSuggestions.length - 1 ? prev + 1 : prev
                        );
                      }
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setSuggestionsIndex(prev => prev > 0 ? prev - 1 : -1);
                    } else if (event.key === "Enter" && suggestionsIndex >= 0 && !pendingField) {
                      event.preventDefault();
                      // Select the highlighted suggestion (which is now just a category name)
                      const category = searchSuggestions[suggestionsIndex];
                                            if (category) {
                        selectField(category);
                      }
                    } else {
                      handleSearchKeyDown(event);
                    }
                  }}
                  onFocus={() => {
                    if (searchInput.trim()) {
                      setShowSuggestionsDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // Don't close immediately to allow click on suggestions
                    setTimeout(() => {
                      setShowSuggestionsDropdown(false);
                      setSuggestionsIndex(-1);
                    }, 200);
                  }}
                  className="min-w-28 flex-1 border-0 bg-transparent px-1 py-1 text-sm font-body text-foreground placeholder:text-muted focus:outline-none"
                />
              </div>
              
              

              {/* Suggestions dropdown */}
              {showSuggestionsDropdown && searchInput.trim() && searchSuggestions.length > 0 && !pendingChip && !pendingField && (
                <div className="absolute left-0 right-0 mt-2 z-50">
                  <div className="rounded-xl border border-border bg-card p-1 shadow-lg shadow-black/5">
                    {searchSuggestions.map((category, index) => {
                      const isHighlighted = index === suggestionsIndex;
                      return (
                        <button
                          key={`${category}-${index}`}
                          type="button"
                          onClick={() => {
                                                        selectField(category);
                          }}
                          onMouseEnter={() => setSuggestionsIndex(index)}
                          className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            isHighlighted 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="flex-1">{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {pendingChip && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/60 bg-primary/5 px-2.5 py-1.5 shadow-sm shadow-primary/5">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
                      {pendingChip.value}
                    </span>
                    <div className="flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-0.5">
                      <select
                        value={pendingChip.field}
                        onChange={(event) =>
                          setPendingChip((current) =>
                            current ? { ...current, field: event.target.value } : current
                          )
                        }
                        className="appearance-none bg-transparent pr-5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground outline-none"
                        aria-label="Choisir le champ de la chip"
                      >
                        {pendingChip.suggestions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span aria-hidden="true" className="text-[10px] text-muted">▾</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!pendingChip) return;
                        addSearchChip(pendingChip.value, pendingChip.field);
                      }}
                      className="rounded-full bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary-foreground"
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingChip(null)}
                      className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Critères de recherche {showAdvancedFilters ? "avancée" : "rapide"}
                </p>
                <div className="flex items-center gap-2">
                  {(searchInput || searchChips.length > 0 || Object.values(filters).some((value) => value !== undefined && value !== null)) && (
                    <button
                      onClick={resetFilters}
                      className="text-[10px] font-medium uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters((current) => !current)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {showAdvancedFilters ? "Recherche simple" : "Recherche avancée"}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-3">
                    <GroupTitle>Identité</GroupTitle>
                    <FreeAutocompleteField
                      label="Prénom"
                      value={filters.firstName ?? ""}
                      onChange={(value) => updateFilter("firstName", value)}
                      options={options.firstNames}
                    />
                    <FreeAutocompleteField
                      label="Nom"
                      value={filters.lastName ?? ""}
                      onChange={(value) => updateFilter("lastName", value)}
                      options={options.lastNames}
                    />
                  </div>
                  <div className="space-y-3">
                    <GroupTitle>Naissance</GroupTitle>
                    <FilterRangeSlider
                      label="Années de naissance"
                      min={options.naissanceRange.min}
                      max={options.naissanceRange.max}
                      valueMin={naissanceMin}
                      valueMax={naissanceMax}
                      onChange={(nextMin, nextMax) => setRange("naissance", nextMin, nextMax)}
                                          />
                                          <MonthRangeSelects
                                            label="Mois de naissance"
                                            startYear={naissanceMin}
                                            endYear={naissanceMax}
                                            startMonth={filters.dateNaissanceMinMois}
                                            endMonth={filters.dateNaissanceMaxMois}
                                            onChange={(start, end) => setMonths("naissance", start, end)}
                                          />
                    <FreeAutocompleteField
                      label="Lieu de naissance"
                      value={filters.lieuNaissance ?? ""}
                      onChange={(value) => updateFilter("lieuNaissance", value)}
                      options={options.lieuxNaissance}
                    />
                    <FreeAutocompleteField
                      label="Département de naissance"
                      value={filters.departementNaissance ?? ""}
                      onChange={(value) => updateFilter("departementNaissance", value)}
                      options={options.departementsNaissance}
                    />
                  </div>
                  <div className="space-y-3">
                    <GroupTitle>Décès</GroupTitle>
                    <FilterRangeSlider
                      label="Années de décès"
                      min={options.decesRange.min}
                      max={options.decesRange.max}
                      valueMin={decesMin}
                      valueMax={decesMax}
                      onChange={(nextMin, nextMax) => setRange("deces", nextMin, nextMax)}
                                          />
                                          <MonthRangeSelects
                                            label="Mois de décès"
                                            startYear={decesMin}
                                            endYear={decesMax}
                                            startMonth={filters.dateDecesMinMois}
                                            endMonth={filters.dateDecesMaxMois}
                                            onChange={(start, end) => setMonths("deces", start, end)}
                                          />
                    <FreeAutocompleteField
                      label="Lieu de décès"
                      value={filters.lieuDeces ?? ""}
                      onChange={(value) => updateFilter("lieuDeces", value)}
                      options={options.lieuxDeces}
                    />
                    <FreeAutocompleteField
                      label="Département de décès"
                      value={filters.departementDeces ?? ""}
                      onChange={(value) => updateFilter("departementDeces", value)}
                      options={options.departementsDeces}
                    />
                  </div>
                </div>

                {showAdvancedFilters && (
                  <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-3">
                      <GroupTitle>Parcours militaire</GroupTitle>
                      <FilterSelect
                        label="Régiment"
                        value={filters.regiment ?? ""}
                        onChange={(value) => updateFilter("regiment", value)}
                        options={options.regiments}
                      />
                      <FilterSelect
                        label="Compagnie / section"
                        value={filters.section ?? ""}
                        onChange={(value) => updateFilter("section", value)}
                        options={options.sections}
                      />
                    </div>
                    <div className="space-y-3">
                      <GroupTitle>Commémoration</GroupTitle>
                      <FreeAutocompleteField
                        label="Monument aux morts"
                        value={filters.monumentAuxMorts ?? ""}
                        onChange={(value) => updateFilter("monumentAuxMorts", value)}
                        options={options.monuments}
                      />
                      <FreeAutocompleteField
                        label="Église"
                        value={filters.eglise ?? ""}
                        onChange={(value) => updateFilter("eglise", value)}
                        options={options.eglises}
                      />
                      <FreeAutocompleteField
                        label="Livre d'or"
                        value={filters.livreDor ?? ""}
                        onChange={(value) => updateFilter("livreDor", value)}
                        options={options.livresOr}
                      />
                    </div>
                    <div className="space-y-3">
                      <GroupTitle>Service militaire</GroupTitle>
                      <FreeAutocompleteField
                        label="Classe du service militaire"
                        value={filters.classeService ?? ""}
                        onChange={(value) => updateFilter("classeService", value)}
                        options={options.classesService}
                      />
                      <FreeAutocompleteField
                        label="Bureau de recrutement"
                        value={filters.bureauRecrutement ?? ""}
                        onChange={(value) => updateFilter("bureauRecrutement", value)}
                        options={options.bureauxRecrutement}
                      />
                      <FreeAutocompleteField
                        label="Décoration(s)"
                        value={filters.decorations ?? ""}
                        onChange={(value) => updateFilter("decorations", value)}
                        options={options.decorations}
                      />
                    </div>
                    <div className="space-y-3">
                      <GroupTitle>Vie civile</GroupTitle>
                      <FreeAutocompleteField
                        label="Profession"
                        value={filters.profession ?? ""}
                        onChange={(value) => updateFilter("profession", value)}
                        options={options.professions}
                      />
                    </div>
                    <div className="space-y-3">
                      <GroupTitle>Sépulture et circonstances</GroupTitle>
                      <FreeAutocompleteField
                        label="Lieu d'inhumation"
                        value={filters.lieuInhumation ?? ""}
                        onChange={(value) => updateFilter("lieuInhumation", value)}
                        options={options.lieuxInhumation}
                      />
                      <FreeAutocompleteField
                        label="Motif du décès"
                        value={filters.motifDeces ?? ""}
                        onChange={(value) => updateFilter("motifDeces", value)}
                        options={options.motifsDeces}
                      />
                    </div>
                    
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {results.length} biographie{results.length !== 1 ? "s" : ""}
          </p>
          {(searchQuery || Object.values(filters).some((value) => value !== undefined && value !== null)) && (
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        {error ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Impossible de joindre l'API ({error}).</p>
          </div>
        ) : loading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Chargement…</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((poilu) => (
              <PoiluCard key={poilu.id} poilu={poilu} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Aucun résultat trouvé.</p>
            {(searchInput || searchChips.length > 0 || Object.values(filters).some((value) => value !== undefined && value !== null)) && (
              <button
                onClick={resetFilters}
                className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Voir tous les poilus
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
