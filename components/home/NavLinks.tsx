"use client";

import { Button } from "@/components/ui/button";
import { recordSecondaryEngagement } from "@/lib/observability/analytics";

export type NavigationItem = {
  id: "menu" | "visit" | "about";
  label: string;
};

export function NavLinks({ items }: { items: NavigationItem[] }) {
  return (
    <div className="hidden items-center gap-7 text-sm text-muted-foreground sm:flex">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="transition-colors hover:text-foreground"
          onClick={() =>
            recordSecondaryEngagement("navigation_clicked", {
              item: item.id,
            })
          }
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

export function OrderAheadButton({ label }: { label: string }) {
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
        {label}
      </a>
    </Button>
  );
}
