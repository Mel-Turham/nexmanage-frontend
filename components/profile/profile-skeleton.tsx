import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader className="pb-4 text-center">
          <div className="mb-4 flex justify-center">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
          <Skeleton className="mx-auto h-6 w-32" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
