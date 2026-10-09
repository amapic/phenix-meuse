import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getPoiluById, poilus } from "../../lib/poilus";

export const Route = createFileRoute("/poilus/$id")({
  head: ({ params }) => {
    const poilu = getPoiluById(params.id);
    return {
      meta: [
        {
          title: `${poilu?.nom || "Poilu"} — Mémoire en Meuse`,
        },
        {
          name: "description",
          content:
            poilu?.resume ||
            "Découvrez la biographie d'un soldat tombé en Meuse pendant la Première Guerre mondiale.",
        },
      ],
    };
  },
  component: PoiluDetailPage,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-frost px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="font-display mt-4 text-2xl font-semibold text-foreground">
          Poilu non trouvé
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce poilu n'existe pas dans l'annuaire.
        </p>
        <div className="mt-6">
          <a
            href="/poilus"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Retour à l'annuaire
          </a>
        </div>
      </div>
    </div>
  );
}

function PlaceholderAvatar({ name }: { name: string }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  
  return (
    <div
      className="h-full w-full flex items-center justify-center text-4xl font-mono text-white font-semibold"
      style={{
        background: `linear-gradient(135deg, hsl(${h}, 60%, 45%), hsl(${h}, 60%, 35%))`,
      }}
    >
      {name.charAt(0)}
    </div>
  );
}

function Monogram() {
  return (
    <div className="grid size-8 place-items-center rounded-full bg-primary/90">
      <span className="font-mono text-[10px] tracking-widest text-primary-foreground">M</span>
    </div>
  );
}

function PoiluDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const poilu = getPoiluById(id);

  if (!poilu) {
    return <NotFound />;
  }

  const yearOfDeath = poilu.deces.split("-")[0];
  const yearOfBirth = poilu.naissance.toString();

  // Find other poilus (excluding current one) for "discover more" section
  const otherPoilus = poilus.filter(p => p.id !== poilu.id).slice(0, 3);

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
              href="/poilus"
              className="hidden rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 md:inline-block"
            >
              Retour à l'annuaire
            </a>
          </div>
        </nav>
      </header>

      {/* Breadcrumb */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <a href="/poilus" className="text-primary hover:text-primary/80">Annuaire</a> › {poilu.nom}
        </p>
      </section>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="animate-rise md:order-2">
            <div className="aspect-square overflow-hidden rounded-3xl bg-muted">
              {poilu.photo ? (
                <img
                  src={poilu.photo}
                  alt={`Portrait de ${poilu.nom}`}
                  className="h-full w-full object-cover grayscale sepia-[.25]"
                />
              ) : (
                <PlaceholderAvatar name={poilu.nom} />
              )}
            </div>
            <p className="mt-3 text-xs text-muted">
              Portrait de {poilu.nom}
            </p>
          </div>

          <div className="animate-rise md:order-1 [animation-delay:120ms]">
            <h1 className="font-display text-5xl leading-tight font-semibold tracking-tight">
              {poilu.nom}
            </h1>
            <p className="mt-6 text-lg text-foreground/80 text-pretty max-w-[50ch]">
              {poilu.resume}
            </p>

            {poilu.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {poilu.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Facts Section */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="glass grid grid-cols-1 gap-4 rounded-2xl p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Naissance</p>
            <p className="mt-2 font-mono text-lg font-semibold">{yearOfBirth}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Décès</p>
            <p className="mt-2 font-mono text-lg font-semibold">{yearOfDeath} · {poilu.lieu}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Département</p>
            <p className="mt-2 font-mono text-lg font-semibold">{poilu.departement_deces}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Unité</p>
            <p className="mt-2 font-mono text-lg font-semibold">{poilu.regiment}</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <article className="space-y-8">
          {poilu.sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {section[0]}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">
                {section[1]}
              </p>
            </div>
          ))}

          {poilu.glossaire && poilu.glossaire.length > 0 && (
            <div className="mt-12 border-t border-border pt-12">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Glossaire
              </h2>
              <div className="mt-6 space-y-4">
                {poilu.glossaire.map((item, idx) => (
                  <div key={idx}>
                    <p className="font-semibold text-foreground">{item[0]}</p>
                    <p className="mt-1 text-sm text-foreground/75">{item[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>

      {/* Discover More */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="border-t border-border pt-12">
          <h2 className="font-display text-3xl font-semibold tracking-tight mb-8">
            Découvrir d'autres biographies
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {otherPoilus.map((other) => (
              <a
                key={other.id}
                href={`/poilus/${other.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-32 w-full overflow-hidden bg-muted">
                  {other.photo ? (
                    <img
                      src={other.photo}
                      alt={`Portrait de ${other.nom}`}
                      className="h-full w-full object-cover grayscale sepia-[.25] transition-all group-hover:grayscale-0"
                    />
                  ) : (
                    <div
                      className="h-full w-full flex items-center justify-center text-lg font-mono text-white font-semibold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${((other.nom.charCodeAt(0) * 31) % 360)}, 60%, 45%), hsl(${((other.nom.charCodeAt(0) * 31) % 360)}, 60%, 35%))`,
                      }}
                    >
                      {other.nom.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3">
                  <p className="font-display font-semibold text-foreground text-sm">{other.nom}</p>
                  <p className="text-xs text-muted">
                    {other.naissance} – {other.deces.split('-')[0]}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <a
            href="/poilus"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            ← Rechercher toutes les biographies
          </a>
        </div>
      </section>
    </div>
  );
}
