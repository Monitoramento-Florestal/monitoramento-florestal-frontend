import { DashboardCard } from "@/components/features/dashboard";

export function TreeManagementLoadingState() {
  return (
    <DashboardCard className="overflow-hidden p-0">
      <div className="animate-pulse divide-y divide-rosewood/8">
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
    </DashboardCard>
  );
}
