import { viewport } from "@/app/layout";
import { buttonVariants } from "@/components/ui/button";

describe("Light mode", () => {
  it("publishes a light browser color scheme", () => {
    expect(viewport).toMatchObject({
      colorScheme: "light",
      themeColor: "#ffffff",
    });
  });

  it("keeps button variants free of dark-mode utility branches", () => {
    expect(buttonVariants()).not.toContain("dark:");
    expect(buttonVariants({ variant: "outline" })).not.toContain("dark:");
    expect(buttonVariants({ variant: "ghost" })).not.toContain("dark:");
    expect(buttonVariants({ variant: "destructive" })).not.toContain("dark:");
  });
});
