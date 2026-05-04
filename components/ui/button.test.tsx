import { buttonVariants } from "@/components/ui/button";

describe("buttonVariants", () => {
  it("keeps button variants free of dark-mode utility branches", () => {
    expect(buttonVariants()).not.toContain("dark:");
    expect(buttonVariants({ variant: "outline" })).not.toContain("dark:");
    expect(buttonVariants({ variant: "ghost" })).not.toContain("dark:");
    expect(buttonVariants({ variant: "destructive" })).not.toContain("dark:");
  });
});
