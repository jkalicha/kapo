import { CatalogGridSkeleton } from '@/components/catalog/CatalogGrid'
import { Skeleton } from '@/components/ui/skeleton'

export default function AutosLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header band skeleton */}
      <div className="bg-[#111111] border-b border-[#27272A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:flex gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5 space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-9 w-full" />
                  {i < 3 && <Skeleton className="h-9 w-full" />}
                </div>
              ))}
            </div>
          </aside>

          {/* Grid skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-9 w-44" />
            </div>
            <CatalogGridSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
