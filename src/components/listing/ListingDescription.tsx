import type { ListingWithSeller } from '@/types/prisma'

interface Props {
  listing: ListingWithSeller
}

export function ListingDescription({ listing }: Props) {
  if (!listing.description) return null

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-white mb-4">Descripción</h2>
      <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5">
        <p className="text-[#A1A1AA] text-sm leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>
    </div>
  )
}
