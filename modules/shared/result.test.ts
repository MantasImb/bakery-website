import { err, isErr, isOk, ok } from "./result";

describe("Result", () => {
  it("represents successful outcomes with a readable value", () => {
    expect.assertions(3);

    const result = ok({ menuId: "menu_123" });

    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);

    if (isOk(result)) {
      expect(result.value).toEqual({ menuId: "menu_123" });
    }
  });

  it("represents expected failures with a readable error", () => {
    expect.assertions(3);

    const result = err({
      code: "NO_ACTIVE_MENU",
      message: "No active weekly menu is available.",
    });

    expect(isErr(result)).toBe(true);
    expect(isOk(result)).toBe(false);

    if (isErr(result)) {
      expect(result.error).toEqual({
        code: "NO_ACTIVE_MENU",
        message: "No active weekly menu is available.",
      });
    }
  });
});
