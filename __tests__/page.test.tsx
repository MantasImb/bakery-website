import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders the bakery homepage heading and primary calls to action", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Fresh bread and quiet morning pastries.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View today's menu" }),
    ).toHaveAttribute("href", "#menu");
    expect(screen.getByRole("link", { name: "Plan a visit" })).toHaveAttribute(
      "href",
      "#visit",
    );
  });
});
