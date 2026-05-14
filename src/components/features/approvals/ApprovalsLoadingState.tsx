import { DashboardCard } from "@/components/features/dashboard";

export function ApprovalsLoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }, (_, index) => (
        <DashboardCard
          key={index}
          className="animate-pulse px-5 py-5"
        >
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="h-24 w-24 rounded-lg bg-secondary/70" />

            <div className="flex-1 space-y-3">
              <div className="h-3 w-20 rounded-full bg-secondary/80" />
              <div className="h-6 w-48 rounded-full bg-secondary/80" />
              <div className="h-4 w-36 rounded-full bg-secondary/70" />

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }, (_, statIndex) => (
                  <div key={statIndex} className="space-y-2">
                    <div className="h-2.5 w-12 rounded-full bg-secondary/70" />
                    <div className="h-4 w-16 rounded-full bg-secondary/80" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 sm:w-40 sm:flex-col">
              <div className="h-10 flex-1 rounded-lg bg-secondary/80" />
              <div className="h-10 flex-1 rounded-lg bg-secondary/70" />
            </div>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}
