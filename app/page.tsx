import { NavLinks, OrderAheadButton } from "@/components/home/NavLinks";
import { HeroActions } from "@/components/home/HeroActions";

const dailyDetails = [
  {
    id: "menu",
    label: "Daily bake",
    value: "Country sourdough, seeded rye, morning buns, and a small pastry case.",
  },
  {
    id: "visit",
    label: "Pickup window",
    value: "Open from 7:00 with bread held for same-day pickup until noon.",
  },
  {
    id: "about",
    label: "Bakery note",
    value: "Everything is mixed in small batches and shaped for the neighborhood table.",
  },
];

export default function Home() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8"
        >
          <a
            href="#home"
            className="text-sm font-semibold tracking-normal text-foreground"
          >
            Hearth & Flour
          </a>

          <NavLinks />

          <OrderAheadButton />
        </nav>
      </header>

      <section
        id="home"
        className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-normal text-muted-foreground">
            Neighborhood bakery
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            Fresh bread and quiet morning pastries.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Hearth & Flour bakes slow-fermented loaves, seasonal pastries, and
            simple coffee for daily pickup in the neighborhood.
          </p>

          <HeroActions />
        </div>

        <div
          role="img"
          aria-label="Bakery counter preview"
          className="grid min-h-80 grid-cols-6 grid-rows-6 gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm sm:min-h-96"
        >
          <div className="col-span-4 row-span-3 rounded-md bg-muted" />
          <div className="col-span-2 row-span-2 rounded-md bg-foreground/90" />
          <div className="col-span-2 row-span-4 rounded-md border border-border bg-background" />
          <div className="col-span-2 row-span-3 rounded-md bg-muted/70" />
          <div className="col-span-4 row-span-1 rounded-md border border-border bg-background" />
        </div>
      </section>

      <section
        id="daily-details"
        aria-labelledby="daily-details-heading"
        className="border-y border-border bg-surface"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:py-14">
          <div>
            <p className="text-sm font-medium uppercase tracking-normal text-muted-foreground">
              Good to know
            </p>
            <h2
              id="daily-details-heading"
              className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl"
            >
              A small daily bake, ready for regular mornings.
            </h2>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {dailyDetails.map((detail) => (
              <div
                key={detail.id}
                id={detail.id}
                className="border-t border-border pt-4"
              >
                <dt className="text-sm font-semibold text-foreground">
                  {detail.label}
                </dt>
                <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
