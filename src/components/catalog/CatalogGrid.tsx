import { ListingCard } from './ListingCard'
import { EmptyState } from './EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { ListingCard as ListingCardType } from '@/types/prisma'

interface Props {
  listings: ListingCardType[]
}

export function CatalogGrid({ listings }: Props) {
  if (listings.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

export function CatalogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden">
          {/* Image */}
          <Skeleton className="aspect-video w-full rounded-none" />
          {/* Body */}
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <div className="border-t border-[#27272A] pt-3 flex justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
