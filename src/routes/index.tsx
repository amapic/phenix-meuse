import { createFileRoute } from "@tanstack/react-router";
import heroMeuse from "../assets/hero-meuse.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Mémoire en Meuse — Voyages-hommage pour les familles",
      },
      {
        name: "description",
        content:
          "Nous accompagnons les familles des soldats tombés en Meuse (1914–1918) sur les traces de leurs proches. Voyages-hommage, transmission et mémoire, avec les enfants.",
      },
      { property: "og:title", content: "Mémoire en Meuse — Voyages-hommage pour les familles" },
      {
        property: "og:description",
        content:
          "Voyages-hommage en Meuse pour les familles des soldats tombés en 1914–1918. Marcher là où ils ont vécu, ensemble.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks = [
  { href: "#voyages", label: "Voyages" },
  { href: "#familles", label: "Familles" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#presse", label: "Presse" },
  { href: "/poilus", label: "Annuaire" },
];

const itineraries = [
  {
    number: "01",
    duration: "4 jours",
    name: "Verdun",
    description:
      "Du fort de Douaumont à l'ossuaire, en passant par le cimetière national. Une journée entière consacrée à la lecture des noms, avec un historien au côté des familles.",
    month: "Avril",
    spots: "14 places",
  },
  {
    number: "02",
    duration: "6 jours",
    name: "Douaumont",
    description:
      "Les tranchées de Vaux, le bois de Belleau, le cimetière français de Douaumont. Une nuit en hôtel de village, autour d'un repas partagé avec les habitants.",
    month: "Mai",
    spots: "12 places",
  },
  {
    number: "03",
    duration: "5 jours",
    name: "Les tranchées",
    description:
      "Un itinéraire plus intime, à pied, sur les restes des positions de 1916. Pensé pour les familles avec enfants à partir de 10 ans, avec un temps de jeu et de dessin prévu chaque jour.",
    month: "Juin",
    spots: "10 places",
  },
];

const familyRituals = [
  {
    label: "Atelier",
    title: "Carnet de route",
    description:
      "Chaque enfant tient un carnet, dessine, colle, écrit. Il le garde au retour.",
  },
  {
    label: "Rituel",
    title: "Le coquelicot en laiton",
    description: "Un coquelicot en métal, frappé à la main, posé sur la tombe du soldat.",
  },
  {
    label: "Temps",
    title: "Le silence",
    description:
      "Un moment de silence, chaque soir, avant le dîner. Les enfants y participent.",
  },
  {
    label: "Mémoire",
    title: "L'arbre des noms",
    description:
      "Un arbre commun, dans chaque hôtel, où chaque famille pose le nom du sien.",
  },
];

const testimonials = [
  {
    quote:
      "Mon fils de 9 ans a posé le coquelicot sur la tombe de son arrière-grand-père. Il n'a rien dit, mais il a pleuré. C'était ce qu'il fallait.",
    name: "Claire D.",
    detail: "Reims · voyage 2024",
  },
  {
    quote:
      "J'avais 12 ans quand mon père est mort. J'avais 78 ans quand j'ai enfin pu aller le voir. Ce voyage m'a rendu quelque chose.",
    name: "Jean-Marc P.",
    detail: "Lyon · voyage 2023",
  },
  {
    quote:
      "On a retrouvé le nom de mon grand-père sur une plaque. Ma fille l'a lu à voix haute. Tout le monde était là.",
    name: "Sophie L.",
    detail: "Nantes · voyage 2024",
  },
];

const press = [
  { outlet: "Le Figaro", excerpt: "« Un voyage qui répare quelque chose. »" },
  { outlet: "France 2", excerpt: "Reportage · 13 novembre 2024" },
  { outlet: "Le Monde", excerpt: "« La mémoire, transmise. »" },
  { outlet: "RFI", excerpt: "« Des familles, des enfants, un lieu. »" },
];

function Monogram() {
  return (
    <div className="grid size-8 place-items-center rounded-full bg-primary/90">
      <span className="font-mono text-[10px] tracking-widest text-primary-foreground">M</span>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-frost font-body text-foreground antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 px-4 pt-4">
        <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
          <a href="#" className="flex items-center gap-3">
            <Monogram />
            <div className="leading-tight">
              <p className="font-display text-lg font-semibold italic tracking-tight">
                Mémoire en Meuse
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                Association · est. 2011
              </p>
            </div>
          </a>
          <div className="hidden items-center gap-7 text-sm md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#participer"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Participer
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="animate-rise md:col-span-7">
            <p className="font-mono mb-6 text-[11px] uppercase tracking-[0.25em] text-primary">
              Voyages-hommage · Meuse · 1914–1918
            </p>
            <h1 className="font-display text-balance text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] font-semibold tracking-tight">
              Marcher là où
              <br />
              <em className="font-medium text-primary italic">ils ont vécu</em>,
              <br />
              ensemble.
            </h1>
            <p className="mt-8 max-w-[46ch] text-lg leading-relaxed text-foreground/80 text-pretty">
              Nous accompagnons les familles des soldats tombés en Meuse sur les traces de
              leurs proches — avec les enfants, avec les petits-enfants, avec ceux qui
              n'ont jamais eu le droit de connaître.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#participer"
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Rejoindre un voyage
              </a>
              <a
                href="#voyages"
                className="glass-soft rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-white/70"
              >
                Découvrir les itinéraires
              </a>
            </div>
          </div>
          <div className="animate-rise [animation-delay:120ms] md:col-span-5">
            <div className="glass rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Prochain départ
                </span>
                <span className="font-mono text-[10px] text-primary">6 jours</span>
              </div>
              <p className="font-display text-3xl leading-tight font-semibold italic">
                Verdun &amp; Douaumont
              </p>
              <p className="mt-2 text-sm text-muted">12 – 17 avril 2026 · 14 places</p>
              <div className="h-px bg-border"></div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Familles inscrites</span>
                  <span className="font-mono">38</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Enfants accompagnés</span>
                  <span className="font-mono">52</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Cimetières visités</span>
                  <span className="font-mono">27</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="animate-rise mt-12 [animation-delay:240ms]">
          <img
            src={heroMeuse}
            alt="Cimetière militaire de la Première Guerre mondiale en Meuse à l'aube, un coquelicot rouge posé sur la pierre"
            className="aspect-[16/8] w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      {/* Voyages / timeline */}
      <section id="voyages" className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              (a) Itinéraires
            </p>
            <h2 className="font-display mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-balance">
              Trois routes
              <br />
              à travers
              <br />
              la Meuse.
            </h2>
            <p className="mt-6 max-w-[38ch] text-base text-pretty text-foreground/75">
              Chaque voyage est pensé comme une traversée : un lieu, une histoire, une
              famille. Les enfants y trouvent leur place, sans jamais trahir la gravité
              du lieu.
            </p>
          </div>
          <div className="space-y-4 md:col-span-8">
            {itineraries.map((itinerary) => (
              <div
                key={itinerary.number}
                className="glass hover:bg-white/70 flex flex-col gap-6 rounded-2xl p-6 transition-colors md:flex-row md:items-center"
              >
                <div className="shrink-0 md:w-32">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {itinerary.number} · {itinerary.duration}
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold italic">
                    {itinerary.name}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-pretty text-foreground/85">
                    {itinerary.description}
                  </p>
                </div>
                <div className="shrink-0 text-right md:w-28">
                  <p className="font-mono text-[10px] text-muted">{itinerary.month}</p>
                  <p className="font-mono mt-1 text-[10px] text-primary">{itinerary.spots}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Familles / children */}
      <section id="familles" className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass grid gap-10 rounded-3xl p-8 md:grid-cols-12 md:p-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              (b) Pour les familles
            </p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-5xl">
              Un lieu pour les enfants, un lieu pour les grands-parents.
            </h2>
            <p className="mt-6 max-w-[42ch] text-base text-pretty text-foreground/75">
              Chaque voyage inclut un temps de découverte pensé pour les plus jeunes :
              carnet de route, atelier d'écriture sur les noms, et un coquelicot en
              laiton à emporter.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-7">
            {familyRituals.map((ritual) => (
              <div key={ritual.title} className="glass-soft rounded-2xl p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {ritual.label}
                </p>
                <p className="font-display mt-3 text-xl font-semibold italic">{ritual.title}</p>
                <p className="mt-2 text-sm text-pretty text-foreground/75">
                  {ritual.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section id="temoignages" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              (c) Témoignages
            </p>
            <h2 className="font-display mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-balance">
              Ce que disent
              <br />
              les familles.
            </h2>
          </div>
          <p className="font-mono hidden text-[10px] uppercase tracking-[0.2em] text-muted md:block">
            Extrait · 2024
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="glass flex flex-col rounded-2xl p-6">
              <blockquote className="font-display text-2xl leading-snug font-medium text-pretty italic">
                «&nbsp;{testimonial.quote}&nbsp;»
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-medium">{testimonial.name}</p>
                <p className="font-mono mt-1 text-[10px] uppercase tracking-[0.15em] text-muted">
                  {testimonial.detail}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="participer" className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass grid items-center gap-10 rounded-3xl p-10 md:grid-cols-12 md:p-16">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              (d) Participer
            </p>
            <h2 className="font-display mt-4 text-5xl leading-[1.02] font-semibold tracking-tight text-balance md:text-6xl">
              Rejoignez
              <br />
              le prochain voyage.
            </h2>
            <p className="mt-6 max-w-[46ch] text-base text-pretty text-foreground/75">
              Chaque année, nous ouvrons 14 places par itinéraire. Les familles sont
              prioritaires. Les enfants sont attendus. Les dons permettent de financer
              les places des familles les plus modestes.
            </p>
          </div>
          <div className="space-y-3 md:col-span-5">
            <a
              href="#"
              className="block w-full rounded-full bg-primary px-6 py-4 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              S'inscrire à un voyage
            </a>
            <a
              href="#"
              className="glass-soft block w-full rounded-full px-6 py-4 text-center text-sm font-medium transition-colors hover:bg-white/70"
            >
              Faire un don
            </a>
            <a
              href="#"
              className="block w-full rounded-full px-6 py-3 text-center text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              Devenir bénévole
            </a>
          </div>
        </div>
      </section>

      {/* Presse */}
      <section id="presse" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              (e) Presse
            </p>
            <h2 className="font-display mt-4 text-4xl leading-[1.05] font-semibold tracking-tight text-balance">
              Ils en ont parlé.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-8 md:grid-cols-4">
            {press.map((item) => (
              <div key={item.outlet} className="glass-soft rounded-xl p-5">
                <p className="font-display text-2xl font-semibold italic">{item.outlet}</p>
                <p className="mt-2 text-xs text-pretty text-muted">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass grid gap-8 rounded-3xl p-8 md:grid-cols-12 md:p-10">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold italic">Mémoire en Meuse</p>
            <p className="mt-3 max-w-[36ch] text-sm text-pretty text-muted">
              Association loi 1901 · 12 rue des Tilleuls, 55000 Verdun ·
              contact@memoireenmeuse.fr
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Navigation
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Contact
            </p>
            <p className="mt-4 text-sm text-foreground/80">contact@memoireenmeuse.fr</p>
            <p className="mt-1 text-sm text-foreground/80">+33 3 29 00 00 00</p>
            <p className="font-mono mt-4 text-[10px] text-muted">© 2026 · Mémoire en Meuse</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
