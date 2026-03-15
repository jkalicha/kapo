import { getSimilarListings } from '@/lib/queries/listings'
import { ListingCard } from '@/components/catalog/ListingCard'

interface Props {
  listingId: string
  brand: string
  price: number
}

export async function SimilarListings({ listingId, brand, price }: Props) {
  const listings = await getSimilarListings(listingId, brand, price)

  if (listings.length === 0) return null

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-white mb-4">Autos similares</h2>
      {/* Horizontal scroll on mobile, 4-col grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {listings.map((listing) => (
          <div key={listing.id} className="shrink-0 w-64 lg:w-auto">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  )
}
