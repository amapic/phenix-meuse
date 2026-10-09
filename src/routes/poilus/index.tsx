import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { poilus, getAllTags, searchPoilus, type Poilu } from "../../lib/poilus";

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
          {poilu.naissance} – {poilu.deces.split('-')[0]}
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

function PoilusPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(() => getAllTags(), []);
  const results = useMemo(
    () => searchPoilus(searchQuery, selectedTag || undefined),
    [searchQuery, selectedTag]
  );

  const toggleTag = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  return (
    <div className="min-h-screen bg-frost font-body text-foreground antialiased">
      {/* Nav */}
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

      {/* Hero Section */}
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

      {/* Search & Filters */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="glass rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <input
                type="search"
                placeholder="Rechercher un nom, un régiment, un lieu…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-body placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Filtrer par
                </p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedTag === tag
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            {results.length} biographie{results.length !== 1 ? "s" : ""}
          </p>
          {(searchQuery || selectedTag) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag(null);
              }}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* Grid Results */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((poilu) => (
              <PoiluCard key={poilu.id} poilu={poilu} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">Aucun résultat trouvé.</p>
            {(searchQuery || selectedTag) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
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
