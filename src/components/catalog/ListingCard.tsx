import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { Currency, FuelType, ListingStatus, Transmission } from '@prisma/client'
import type { ListingCard } from '@/types/prisma'

const fuelLabel: Record<FuelType, string> = {
  NAFTA: 'Nafta',
  DIESEL: 'Diesel',
  HIBRIDO: 'Híbrido',
  ELECTRICO: 'Eléctrico',
  GNC: 'GNC',
}

const transmissionLabel: Record<Transmission, string> = {
  MANUAL: 'Manual',
  AUTOMATICO: 'Automático',
}

function formatPrice(price: number, currency: Currency): string {
  const n = price.toLocaleString('es-UY')
  return currency === Currency.USD ? `U$S ${n}` : `$ ${n}`
}

interface Props {
  listing: ListingCard
}

export function ListingCard({ listing }: Props) {
  const image = listing.images[0]
  const isSold = listing.status === ListingStatus.SOLD

  return (
    <Link href={`/autos/${listing.id}`} className="group block">
      <article className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#F5A623]/50 hover:scale-[1.01]">
        {/* ── Image ── */}
        <div className="relative aspect-video bg-[#1A1A1A]">
          {image ? (
            <Image
              src={image.url}
              alt={`${listing.brand} ${listing.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
              <span className="text-5xl font-bold text-[#27272A]">
                {listing.brand[0]}
              </span>
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white text-lg font-bold tracking-widest uppercase">
                Vendido
              </span>
            </div>
          )}

          {/* Featured badge — top-left */}
          {listing.featured && !isSold && (
            <span className="absolute top-2 left-2 bg-[#F5A623] text-black text-xs font-bold px-2 py-1 rounded-md">
              ⭐ Destacado
            </span>
          )}

          {/* Right badges — top-right */}
          {!isSold && (listing.acceptsTrade || listing.hasFinancing) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              {listing.acceptsTrade && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                  Permuta
                </span>
              )}
              {listing.hasFinancing && (
                <span className="bg-green-700 text-white text-xs font-bold px-2 py-1 rounded-md">
                  Financiación
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-4">
          <p className="text-xl font-bold text-white mb-0.5">
            {formatPrice(listing.price, listing.currency)}
          </p>
          <h3 className="text-sm text-[#A1A1AA] truncate mb-3">
            {listing.brand} {listing.model}
            {listing.version ? ` · ${listing.version}` : ''}
          </h3>

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#A1A1AA] mb-3">
            <span>📅 {listing.year}</span>
            <span>📏 {listing.km.toLocaleString('es-UY')} km</span>
            <span>⛽ {fuelLabel[listing.fuel]}</span>
            <span>⚙️ {transmissionLabel[listing.transmission]}</span>
          </div>

          <div className="border-t border-[#27272A] mb-3" />

          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full truncate max-w-[60%] ${
                listing.seller.type === 'DEALERSHIP'
                  ? 'bg-[#F5A623]/10 text-[#F5A623]'
                  : 'bg-[#27272A] text-[#A1A1AA]'
              }`}
            >
              {listing.seller.type === 'DEALERSHIP'
                ? `✓ ${listing.seller.businessName ?? 'Automotora'}`
                : 'Particular'}
            </span>
            <span className="text-xs text-[#A1A1AA] flex items-center gap-1 shrink-0">
              <MapPin size={11} />
              {listing.city}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
