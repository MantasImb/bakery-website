import englishMessages from "@/messages/en.json";
import norwegianMessages from "@/messages/no.json";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) =>
    flattenKeys(nestedValue, prefix ? `${prefix}.${key}` : key),
  );
}

describe("customer-facing messages", () => {
  it("keeps Norwegian and English message keys in parity", () => {
    expect(flattenKeys(norwegianMessages).sort()).toEqual(
      flattenKeys(englishMessages).sort(),
    );
  });
});
