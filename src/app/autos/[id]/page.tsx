import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getListingById } from '@/lib/queries/listings'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)
  if (!listing) return { title: 'Auto no encontrado — Kapo' }
  return {
    title: `${listing.brand} ${listing.model} ${listing.year} — Kapo`,
  }
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) notFound()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/autos"
          className="inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors mb-6"
        >
          <ChevronLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="bg-[#111111] border border-[#27272A] rounded-xl p-8 text-center">
          <p className="text-4xl mb-4">🚗</p>
          <h1 className="text-2xl font-bold text-white mb-2">
            {listing.brand} {listing.model} {listing.year}
          </h1>
          <p className="text-[#A1A1AA] text-sm">
            Página de detalle — próximamente disponible
          </p>
        </div>
      </div>
    </div>
  )
}
