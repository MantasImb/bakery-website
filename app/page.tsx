import { Button } from "@/components/ui/button";

const navigationItems = ["Menu", "Visit", "About"];

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

          <div className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
            {navigationItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>

          <Button asChild variant="outline" size="sm">
            <a href="#visit">Order ahead</a>
          </Button>
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#menu">View today&apos;s menu</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#visit">Plan a visit</a>
            </Button>
          </div>
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
    </main>
  );
}
