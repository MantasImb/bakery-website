export const supportedLocales = ["no", "en"] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "no";

export const routing = {
  locales: supportedLocales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: false,
} as const;

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function hasUnsupportedLocalePrefix(path: string): boolean {
  const firstSegment = path.startsWith("/")
    ? path.split("/")[1]
    : path.split(/[/?#]/, 1)[0];

  return /^[a-z]{2}$/.test(firstSegment) && !isLocale(firstSegment);
}

export function getPathLocale(path: string): Locale | null {
  const locale = path.startsWith("/")
    ? path.split("/")[1]
    : path.split(/[/?#]/, 1)[0];

  return isLocale(locale) ? locale : null;
}

export function stripPathLocale(path: string): string {
  const locale = getPathLocale(path);

  if (!locale) {
    return path || "/";
  }

  const pathWithoutLocale = path.slice(locale.length + 1);
  return pathWithoutLocale.startsWith("/") ? pathWithoutLocale : `/${pathWithoutLocale}`;
}

export function localizePath(path: string, locale: Locale): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function replacePathLocale(path: string, locale: Locale): string {
  return localizePath(stripPathLocale(path), locale);
}
