export default function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-8 text-foreground sm:px-8">
      <h1 className="sr-only">Bakery website foundation</h1>
      <section
        aria-label="Website foundation shell"
        className="w-full max-w-6xl rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6 lg:p-8"
      >
        <div aria-hidden="true" className="space-y-10">
          <div className="flex items-center justify-between gap-6 border-b border-border pb-4">
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="hidden items-center gap-3 sm:flex">
              <div className="h-2.5 w-14 rounded-full bg-muted" />
              <div className="h-2.5 w-14 rounded-full bg-muted" />
              <div className="h-2.5 w-14 rounded-full bg-muted" />
            </div>
            <div className="h-8 w-8 rounded-full border border-border" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <div className="h-4 w-24 rounded-full bg-muted" />
              <div className="space-y-3">
                <div className="h-12 w-full max-w-xl rounded-md bg-foreground/90" />
                <div className="h-12 w-4/5 max-w-lg rounded-md bg-foreground/90" />
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3 w-full max-w-md rounded-full bg-muted" />
                <div className="h-3 w-5/6 max-w-sm rounded-full bg-muted" />
              </div>
              <div className="flex gap-3 pt-3">
                <div className="h-10 w-28 rounded-md bg-foreground/90" />
                <div className="h-10 w-28 rounded-md border border-border" />
              </div>
            </div>

            <div className="min-h-64 rounded-md border border-border bg-background p-4">
              <div className="grid h-full min-h-56 grid-cols-2 gap-3">
                <div className="rounded bg-muted" />
                <div className="rounded bg-muted/70" />
                <div className="rounded bg-muted/70" />
                <div className="rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
