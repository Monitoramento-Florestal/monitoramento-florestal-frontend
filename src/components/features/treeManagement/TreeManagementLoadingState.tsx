import { DashboardCard } from "@/components/features/dashboard";

export function TreeManagementLoadingState() {
  return (
    <DashboardCard className="overflow-hidden p-0">
      <div className="animate-pulse">
        <div className="divide-y divide-rosewood/8 md:hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="space-y-4 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-20 rounded-full bg-secondary/80" />
                  <div className="h-5 w-2/3 rounded-full bg-secondary/80" />
                  <div className="h-4 w-1/2 rounded-full bg-secondary/60" />
                  <div className="h-3 w-3/4 rounded-full bg-secondary/60" />
                </div>
                <div className="h-7 w-20 rounded-full bg-secondary/70" />
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-secondary/35 px-3 py-3">
                {Array.from({ length: 3 }, (_, metricIndex) => (
                  <div key={metricIndex} className="space-y-2">
                    <div className="h-2 w-10 rounded-full bg-secondary/60" />
                    <div className="h-4 w-full rounded-full bg-secondary/80" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="h-10 rounded-xl bg-secondary/70" />
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="h-10 rounded-xl bg-secondary/60" />
                  <div className="h-10 rounded-xl bg-secondary/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden divide-y divide-rosewood/8 md:block">
          <div className="grid grid-cols-[1.1fr_2fr_repeat(4,minmax(0,1fr))_120px] gap-4 px-5 py-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-3 rounded-full bg-secondary/80"
              />
            ))}
          </div>

          {Array.from({ length: 7 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-[1.1fr_2fr_repeat(4,minmax(0,1fr))_120px] gap-4 px-5 py-5"
            >
              {Array.from({ length: 8 }, (_, cellIndex) => (
                <div
                  key={cellIndex}
                  className="space-y-2"
                >
                  <div className="h-3 rounded-full bg-secondary/80" />
                  {cellIndex === 1 ? (
                    <div className="h-3 w-3/4 rounded-full bg-secondary/60" />
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
