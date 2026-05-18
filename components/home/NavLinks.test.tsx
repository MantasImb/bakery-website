import { fireEvent, render, screen } from "@testing-library/react";
import { recordSecondaryEngagement } from "@/lib/observability/analytics";
import { NavLinks, OrderAheadButton } from "./NavLinks";

jest.mock("@/lib/observability/analytics", () => ({
  recordSecondaryEngagement: jest.fn(),
}));

describe("NavLinks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("records navigation as secondary engagement through the analytics facade", () => {
    render(<NavLinks />);

    fireEvent.click(screen.getByRole("link", { name: "Menu" }));

    expect(recordSecondaryEngagement).toHaveBeenCalledWith(
      "navigation_clicked",
      { item: "menu" },
    );
  });
});

describe("OrderAheadButton", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("records order ahead as visit planning secondary engagement", () => {
    render(<OrderAheadButton />);

    fireEvent.click(screen.getByRole("link", { name: /order ahead/i }));

    expect(recordSecondaryEngagement).toHaveBeenCalledWith(
      "visit_planning_clicked",
      { cta: "order_ahead" },
    );
  });
});
