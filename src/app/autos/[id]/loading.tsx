import { Skeleton } from '@/components/ui/skeleton'

export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-5 w-32 mb-6" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </div>
  )
}
