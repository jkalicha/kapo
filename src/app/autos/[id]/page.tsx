import { Suspense } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ListingStatus, Currency } from '@prisma/client'
import { getListingById } from '@/lib/queries/listings'
import { db } from '@/lib/db'
import { ListingGallery } from '@/components/listing/ListingGallery'
import { ListingSpecs } from '@/components/listing/ListingSpecs'
import { ListingDescription } from '@/components/listing/ListingDescription'
import { ContactForm } from '@/components/listing/ContactForm'
import { SellerCard } from '@/components/listing/SellerCard'
import { SimilarListings } from '@/components/listing/SimilarListings'
import { ListingBreadcrumb } from '@/components/listing/ListingBreadcrumb'

type Props = { params: Promise<{ id: string }> }

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return {}
  const price = listing.price.toLocaleString('es-UY')
  const currency = listing.currency === Currency.USD ? 'U$S' : '$'
  return {
    title: `${listing.brand} ${listing.model} ${listing.year} — ${currency} ${price} | Kapo`,
    description: `${listing.brand} ${listing.model} ${listing.year}, ${listing.km.toLocaleString('es-UY')} km, ${listing.fuel}, ${listing.transmission}. ${listing.city}, Uruguay.`,
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: Currency): string {
  const n = price.toLocaleString('es-UY')
  return currency === Currency.USD ? `U$S ${n}` : `$ ${n}`
}

const fuelLabel: Record<string, string> = {
  NAFTA: 'Nafta', DIESEL: 'Diesel', HIBRIDO: 'Híbrido', ELECTRICO: 'Eléctrico', GNC: 'GNC',
}
const transLabel: Record<string, string> = {
  MANUAL: 'Manual', AUTOMATICO: 'Automático',
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) notFound()

  const isSold = listing.status === ListingStatus.SOLD

  // Fire-and-forget views increment (don't await)
  db.listing
    .update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
    .then(() => {})
    .catch(() => {})

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── Header band ────────────────────────────────────────────────── */}
      <div className="bg-[#111111] border-b border-[#27272A] py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ListingBreadcrumb listing={listing} />
        </div>
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Two-column: right (price+form) first in HTML for mobile */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left column ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              {listing.brand} {listing.model}
              {listing.version ? ` ${listing.version}` : ''} {listing.year}
            </h1>
            <p className="text-[#A1A1AA] text-sm mb-6">
              {listing.km.toLocaleString('es-UY')} km ·{' '}
              {fuelLabel[listing.fuel]} ·{' '}
              {transLabel[listing.transmission]} ·{' '}
              {listing.city}
            </p>

            <ListingGallery images={listing.images} brand={listing.brand} />
            <ListingDescription listing={listing} />
            <ListingSpecs listing={listing} />

            <Suspense fallback={null}>
              <SimilarListings
                listingId={listing.id}
                brand={listing.brand}
                price={listing.price}
              />
            </Suspense>
          </div>

          {/* ── Right column — sticky ────────────────────────────────── */}
          <div className="lg:w-[380px] shrink-0 order-1 lg:order-2">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">

              {/* Price card */}
              <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5 relative overflow-hidden">
                {isSold && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-xl">
                    <span className="text-[#F5A623] font-black text-3xl tracking-widest uppercase">
                      Vendido
                    </span>
                  </div>
                )}

                <p className="text-3xl font-black text-[#F5A623] mb-1">
                  {formatPrice(listing.price, listing.currency)}
                </p>
                <p className="text-sm text-[#A1A1AA] mb-4">
                  {listing.brand} {listing.model} {listing.year}
                </p>

                {/* Flags */}
                {(listing.acceptsTrade || listing.hasFinancing) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.acceptsTrade && (
                      <span className="text-xs font-medium text-blue-400 bg-blue-900/20 border border-blue-700/30 px-2.5 py-1 rounded-full">
                        ✓ Acepta permuta
                      </span>
                    )}
                    {listing.hasFinancing && (
                      <span className="text-xs font-medium text-green-400 bg-green-900/20 border border-green-700/30 px-2.5 py-1 rounded-full">
                        ✓ Con financiación
                      </span>
                    )}
                  </div>
                )}

                {/* Quick specs */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-[#A1A1AA]">
                  <span>📅 {listing.year}</span>
                  <span>📏 {listing.km.toLocaleString('es-UY')} km</span>
                  <span>⛽ {fuelLabel[listing.fuel]}</span>
                  <span>⚙️ {transLabel[listing.transmission]}</span>
                  {listing.color && <span>🎨 {listing.color}</span>}
                </div>
              </div>

              {/* Contact form or sold message */}
              {isSold ? (
                <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5 text-center">
                  <p className="text-[#A1A1AA] text-sm">
                    Este auto ya fue vendido.
                  </p>
                  <p className="text-[#A1A1AA] text-sm mt-1">
                    Te mostramos opciones similares{' '}
                    <a href="#similar" className="text-[#F5A623] underline">
                      ↓
                    </a>
                  </p>
                </div>
              ) : (
                <ContactForm listingId={listing.id} />
              )}

              {/* Seller card */}
              <Suspense fallback={
                <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5 h-32 animate-pulse" />
              }>
                <SellerCard seller={listing.seller} />
              </Suspense>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
