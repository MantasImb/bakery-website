import { fireEvent, render, screen } from "@testing-library/react";
import {
  recordHomepageCtaClicked,
  recordSecondaryEngagement,
} from "@/lib/observability/analytics";
import { HeroActions } from "./HeroActions";

jest.mock("@/lib/observability/analytics", () => ({
  recordHomepageCtaClicked: jest.fn(),
  recordSecondaryEngagement: jest.fn(),
}));

describe("HeroActions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("records the primary homepage CTA through the analytics facade", () => {
    render(
      <HeroActions planVisitLabel="Plan a visit" viewMenuLabel="View menu" />,
    );

    fireEvent.click(screen.getByRole("link", { name: /view menu/i }));

    expect(recordHomepageCtaClicked).toHaveBeenCalledWith("view_menu");
  });

  it("records visit planning as secondary engagement", () => {
    render(
      <HeroActions planVisitLabel="Plan a visit" viewMenuLabel="View menu" />,
    );

    fireEvent.click(screen.getByRole("link", { name: /plan a visit/i }));

    expect(recordSecondaryEngagement).toHaveBeenCalledWith(
      "visit_planning_clicked",
      { cta: "plan_visit" },
    );
  });
});
