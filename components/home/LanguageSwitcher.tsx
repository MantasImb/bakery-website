import { Locale, replacePathLocale, supportedLocales } from "@/i18n/routing";

export function LanguageSwitcher({
  currentLocale,
  currentPath,
  labels,
}: {
  currentLocale: Locale;
  currentPath: string;
  labels: Record<Locale, string>;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {supportedLocales.map((locale) => (
        <a
          key={locale}
          href={replacePathLocale(currentPath, locale)}
          hrefLang={locale}
          aria-current={locale === currentLocale ? "page" : undefined}
          className="transition-colors hover:text-foreground aria-[current=page]:font-semibold aria-[current=page]:text-foreground"
        >
          {labels[locale]}
        </a>
      ))}
    </div>
  );
}
