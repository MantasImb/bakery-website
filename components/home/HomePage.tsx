import { HeroActions } from "@/components/home/HeroActions";
import { LanguageSwitcher } from "@/components/home/LanguageSwitcher";
import { NavLinks, NavigationItem, OrderAheadButton } from "@/components/home/NavLinks";
import { Locale } from "@/i18n/routing";

export type HomePageMessages = {
  brand: string;
  navigation: Record<NavigationItem["id"], string>;
  actions: {
    orderAhead: string;
    viewMenu: string;
    planVisit: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  details: {
    eyebrow: string;
    title: string;
    menu: {
      label: string;
      value: string;
    };
    visit: {
      label: string;
      value: string;
    };
    about: {
      label: string;
      value: string;
    };
  };
  mediaAlt: string;
  language: {
    norwegian: string;
    english: string;
  };
};

const detailIds = ["menu", "visit", "about"] as const;

export function HomePage({
  currentPath,
  locale,
  messages,
}: {
  currentPath: string;
  locale: Locale;
  messages: HomePageMessages;
}) {
  const navigationItems = detailIds.map((id) => ({
    id,
    label: messages.navigation[id],
  }));

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
            {messages.brand}
          </a>

          <NavLinks items={navigationItems} />

          <div className="flex items-center gap-4">
            <LanguageSwitcher
              currentLocale={locale}
              currentPath={currentPath}
              labels={{
                no: messages.language.norwegian,
                en: messages.language.english,
              }}
            />
            <OrderAheadButton label={messages.actions.orderAhead} />
          </div>
        </nav>
      </header>

      <section
        id="home"
        className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-normal text-muted-foreground">
            {messages.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            {messages.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {messages.hero.description}
          </p>

          <HeroActions
            planVisitLabel={messages.actions.planVisit}
            viewMenuLabel={messages.actions.viewMenu}
          />
        </div>

        <div
          role="img"
          aria-label={messages.mediaAlt}
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
              {messages.details.eyebrow}
            </p>
            <h2
              id="daily-details-heading"
              className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-4xl"
            >
              {messages.details.title}
            </h2>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {detailIds.map((id) => (
              <div
                key={id}
                id={id}
                className="border-t border-border pt-4"
              >
                <dt className="text-sm font-semibold text-foreground">
                  {messages.details[id].label}
                </dt>
                <dd className="mt-3 text-sm leading-6 text-muted-foreground">
                  {messages.details[id].value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
