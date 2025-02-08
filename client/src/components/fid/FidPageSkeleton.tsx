import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FidPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Section Loading Skeleton */}
      <Card className="max-w-xl mx-auto bg-white/10 border-none backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-4">
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="w-14 h-14 rounded-full" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Token List Loading Skeleton */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 w-full text-center">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-5 w-12 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
