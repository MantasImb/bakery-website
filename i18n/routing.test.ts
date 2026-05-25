import {
  defaultLocale,
  getPathLocale,
  hasUnsupportedLocalePrefix,
  localizePath,
  replacePathLocale,
  supportedLocales,
} from "./routing";

describe("i18n routing", () => {
  it("uses Norwegian Bokmal and English locale prefixes with Norwegian as the default", () => {
    expect(supportedLocales).toEqual(["no", "en"]);
    expect(defaultLocale).toBe("no");
  });

  it("recognizes supported locale prefixes only at the start of the path", () => {
    expect(getPathLocale("/no")).toBe("no");
    expect(getPathLocale("/en/menu")).toBe("en");
    expect(getPathLocale("/fr/menu")).toBeNull();
    expect(getPathLocale("/menu/no")).toBeNull();
  });

  it("detects unsupported locale-like prefixes without treating stable route segments as locales", () => {
    expect(hasUnsupportedLocalePrefix("/fr/menu")).toBe(true);
    expect(hasUnsupportedLocalePrefix("/nb")).toBe(true);
    expect(hasUnsupportedLocalePrefix("/menu")).toBe(false);
    expect(hasUnsupportedLocalePrefix("/api/dev/sentry-smoke")).toBe(false);
  });

  it("adds or replaces only the locale prefix while preserving the stable customer path", () => {
    expect(localizePath("/", "no")).toBe("/no");
    expect(localizePath("/menu", "en")).toBe("/en/menu");
    expect(replacePathLocale("/no/menu", "en")).toBe("/en/menu");
    expect(replacePathLocale("/en/checkout?step=pickup", "no")).toBe(
      "/no/checkout?step=pickup",
    );
  });
});
