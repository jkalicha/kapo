import { Skeleton } from '@/components/ui/skeleton'

export default function ListingDetailLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header band */}
      <div className="bg-[#111111] border-b border-[#27272A] py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1 min-w-0 order-2 lg:order-1 space-y-6">
            <div>
              <Skeleton className="h-8 w-72 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            {/* Gallery */}
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="w-20 h-[60px] rounded-lg" />)}
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            {/* Specs */}
            <div>
              <Skeleton className="h-5 w-28 mb-3" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#1A1A1A]">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-[380px] shrink-0 order-1 lg:order-2 space-y-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <Skeleton className="h-80 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
