"use client";

import { Button } from "@/components/ui/button";
import { recordSecondaryEngagement } from "@/lib/observability/analytics";

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
            recordSecondaryEngagement("navigation_clicked", {
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
        onClick={() =>
          recordSecondaryEngagement("visit_planning_clicked", {
            cta: "order_ahead",
          })
        }
      >
        Order ahead
      </a>
    </Button>
  );
}
