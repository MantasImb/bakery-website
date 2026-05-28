import { render, screen } from "@testing-library/react";
import { HomePage, HomePageMessages } from "@/components/home/HomePage";
import englishMessages from "@/messages/en.json";
import norwegianMessages from "@/messages/no.json";

describe("Home page", () => {
  it("renders the Norwegian bakery homepage copy and language switcher", () => {
    render(
      <HomePage
        currentPath="/no"
        locale="no"
        messages={norwegianMessages.HomePage as HomePageMessages}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ferskt brød og rolige morgenbakverk.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Se ukens meny" })).toHaveAttribute(
      "href",
      "#menu",
    );
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
  });

  it("renders the English bakery homepage copy and primary calls to action", () => {
    render(
      <HomePage
        currentPath="/en"
        locale="en"
        messages={englishMessages.HomePage as HomePageMessages}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Fresh bread and quiet morning pastries.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View weekly menu" })).toHaveAttribute(
      "href",
      "#menu",
    );
    expect(screen.getByRole("link", { name: "Plan a pickup" })).toHaveAttribute(
      "href",
      "#visit",
    );
  });
});
