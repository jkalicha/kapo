import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getFeaturedListings } from '@/lib/queries/listings'
import type { ListingCard } from '@/types/prisma'
import { Calendar, Gauge, Fuel, Settings2, MapPin, ShieldCheck, User, ArrowRight } from 'lucide-react'
import { FuelType, Transmission, SellerType } from '@prisma/client'

// ─── Display label maps ───────────────────────────────────────────────────────

const fuelLabel: Record<FuelType, string> = {
  NAFTA:    'Nafta',
  DIESEL:   'Diesel',
  HIBRIDO:  'Híbrido',
  ELECTRICO: 'Eléctrico',
  GNC:      'GNC',
}

const transmissionLabel: Record<Transmission, string> = {
  MANUAL:     'Manual',
  AUTOMATICO: 'Automático',
}

// ─── Badge logic ──────────────────────────────────────────────────────────────

const badgeStyles: Record<string, string> = {
  Destacado:      'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
  'Nuevo ingreso': 'bg-green-500/10 text-green-400 border-green-500/20',
}

function getBadge(listing: ListingCard): string | null {
  if (listing.featured) return 'Destacado'
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  if (listing.createdAt > sevenDaysAgo) return 'Nuevo ingreso'
  return null
}

// ─── Card gradients ───────────────────────────────────────────────────────────

const cardGradients = [
  'from-[#1A1A2E] to-[#16213E]',
  'from-[#1C1C1C] to-[#2A2A2A]',
  'from-[#0D1117] to-[#1C1C2E]',
  'from-[#1A1A1A] to-[#1E2030]',
  'from-[#0A1628] to-[#1A2A3A]',
  'from-[#1A1410] to-[#2A2010]',
]

function CarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
  )
}

// ─── Individual card ──────────────────────────────────────────────────────────

function ListingCard({ listing, index }: { listing: ListingCard; index: number }) {
  const badge = getBadge(listing)
  const title = [listing.brand, listing.model, listing.version].filter(Boolean).join(' ')
  const isDealership = listing.seller.type === SellerType.DEALERSHIP

  return (
    <Card className="bg-[#111111] border-[#27272A] hover:border-[#3F3F46] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {/* Image / placeholder */}
      <div className={cn('relative h-44 bg-gradient-to-br', cardGradients[index % cardGradients.length])}>
        {listing.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0].url}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CarIcon className="w-20 h-20 text-white/10" />
          </div>
        )}

        {badge && (
          <div className="absolute top-3 left-3">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', badgeStyles[badge])}>
              {badge}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      <CardContent className="p-4">
        {/* Title & price */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-white text-base leading-tight">{title}</h3>
          <div className="shrink-0 text-right">
            <div className="text-lg font-bold text-white">
              {listing.currency === 'USD' ? 'U$S' : '$'}{' '}
              {listing.price.toLocaleString('es-UY')}
            </div>
          </div>
        </div>

        {/* Specs row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-3">
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Calendar size={12} aria-hidden="true" />
            {listing.year}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Gauge size={12} aria-hidden="true" />
            {listing.km.toLocaleString('es-UY')} km
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Settings2 size={12} aria-hidden="true" />
            {transmissionLabel[listing.transmission]}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <Fuel size={12} aria-hidden="true" />
            {fuelLabel[listing.fuel]}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#A1A1AA]">
            <MapPin size={12} aria-hidden="true" />
            {listing.city}
          </span>
        </div>

        <div className="border-t border-[#27272A] my-3" />

        {/* Seller type & CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isDealership ? (
              <ShieldCheck size={14} className="text-[#F5A623]" aria-hidden="true" />
            ) : (
              <User size={14} className="text-[#A1A1AA]" aria-hidden="true" />
            )}
            <span className="text-xs text-[#A1A1AA]">
              {isDealership ? 'Automotora verificada' : 'Particular'}
            </span>
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white hover:border-[#F5A623]/30 text-xs h-7"
          >
            <Link href={`/autos/${listing.id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full py-16 text-center">
      <CarIcon className="w-16 h-16 text-white/10 mx-auto mb-4" />
      <p className="text-[#A1A1AA] text-sm">No hay autos destacados en este momento.</p>
      <Button asChild variant="outline" className="mt-4 border-[#27272A] text-white hover:bg-[#111111]">
        <Link href="/autos">Ver todos los autos</Link>
      </Button>
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export async function FeaturedListings() {
  const listings = await getFeaturedListings(6)

  return (
    <section id="listings" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Autos destacados</h2>
            <p className="text-[#A1A1AA] mt-1.5 text-sm">
              Los mejores autos del mercado, curados para vos
            </p>
          </div>
          <Button
            asChild
            className="hidden sm:flex items-center gap-2 bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold"
          >
            <Link href="/autos">
              Ver todos <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.length === 0 ? (
            <EmptyState />
          ) : (
            listings.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))
          )}
        </div>

        {listings.length > 0 && (
          <div className="mt-8 sm:hidden text-center">
            <Button
              asChild
              className="bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold gap-2"
            >
              <Link href="/autos">
                Ver todos los autos <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
