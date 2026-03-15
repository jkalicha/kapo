import Link from 'next/link'
import { MapPin, Car, CalendarDays } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { db } from '@/lib/db'
import { ListingStatus } from '@prisma/client'
import type { ListingWithSeller } from '@/types/prisma'

interface Props {
  seller: ListingWithSeller['seller']
}

export async function SellerCard({ seller }: Props) {
  const activeCount = await db.listing.count({
    where: { sellerId: seller.id, status: ListingStatus.ACTIVE },
  })

  const isDealer = seller.type === 'DEALERSHIP'
  const displayName = isDealer
    ? (seller.businessName ?? seller.user.name ?? 'Automotora')
    : (seller.user.name?.split(' ')[0] ?? 'Particular')

  const initial = displayName[0]?.toUpperCase() ?? '?'

  const memberSince = formatDistanceToNow(new Date(seller.createdAt), {
    locale: es,
    addSuffix: false,
  })

  return (
    <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5">
      <h3 className="text-xs font-semibold text-[#52525B] uppercase tracking-widest mb-4">
        Vendedor
      </h3>

      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-[#F5A623]/15 border border-[#F5A623]/30 flex items-center justify-center shrink-0">
          <span className="text-[#F5A623] font-bold text-lg">{initial}</span>
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-white truncate">{displayName}</p>
          <p className="text-xs text-[#A1A1AA]">{isDealer ? 'Automotora' : 'Particular'}</p>
          {seller.verified && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-[#F5A623] bg-[#F5A623]/10 px-2 py-0.5 rounded-full">
              ✓ Vendedor verificado
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="shrink-0" />
          <span>{seller.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Car size={14} className="shrink-0" />
          <span>{activeCount} {activeCount === 1 ? 'auto publicado' : 'autos publicados'}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="shrink-0" />
          <span>En Kapo hace {memberSince}</span>
        </div>
      </div>

      <Link
        href={`/autos?vendedor=${seller.id}`}
        className="mt-4 block text-center text-sm font-medium text-[#F5A623] border border-[#F5A623]/30 rounded-lg py-2 hover:bg-[#F5A623]/10 transition-colors"
      >
        Ver todos sus autos →
      </Link>
    </div>
  )
}
