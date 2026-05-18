"use client";

import { Button } from "@/components/ui/button";
import {
  recordHomepageCtaClicked,
  recordSecondaryEngagement,
} from "@/lib/observability/analytics";

export function HeroActions() {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <a
          href="#menu"
          onClick={() => recordHomepageCtaClicked("view_menu")}
        >
          View today&apos;s menu
        </a>
      </Button>
      <Button asChild variant="outline" size="lg">
        <a
          href="#visit"
          onClick={() =>
            recordSecondaryEngagement("visit_planning_clicked", {
              cta: "plan_visit",
            })
          }
        >
          Plan a visit
        </a>
      </Button>
    </div>
  );
}
