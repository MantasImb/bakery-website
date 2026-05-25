import { viewport } from "@/app/viewport";

describe("Root layout viewport", () => {
  it("publishes a light browser color scheme", () => {
    expect(viewport).toMatchObject({
      colorScheme: "light",
      themeColor: "#ffffff",
    });
  });
});
