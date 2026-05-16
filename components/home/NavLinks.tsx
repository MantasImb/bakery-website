"use client";

import { Button } from "@/components/ui/button";
import { captureBrowserAnalyticsEvent } from "@/lib/observability/analytics";

const navigationItems = ["Menu", "Visit", "About"];

export function NavLinks() {
  return (
    <div className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
      {navigationItems.map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          className="transition-colors hover:text-foreground"
          onClick={() =>
            captureBrowserAnalyticsEvent("nav_item_clicked", {
              item: item.toLowerCase(),
            })
          }
        >
          {item}
        </a>
      ))}
    </div>
  );
}

export function OrderAheadButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <a
        href="#visit"
        onClick={() => captureBrowserAnalyticsEvent("order_ahead_clicked")}
      >
        Order ahead
      </a>
    </Button>
  );
}
