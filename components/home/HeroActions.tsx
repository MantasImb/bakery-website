"use client";

import { Button } from "@/components/ui/button";
import { captureBrowserAnalyticsEvent } from "@/lib/observability/analytics";

export function HeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <a
          href="#menu"
          onClick={() => captureBrowserAnalyticsEvent("view_menu_clicked")}
        >
          View today&apos;s menu
        </a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <a
          href="#visit"
          onClick={() => captureBrowserAnalyticsEvent("plan_visit_clicked")}
        >
          Plan a visit
        </a>
      </Button>
    </div>
  );
}
