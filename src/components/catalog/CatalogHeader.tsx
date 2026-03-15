import { Suspense } from 'react'
import { SortSelector } from './SortSelector'

interface Props {
  total: number
  brand?: string
  city?: string
}

function buildDescription(total: number, brand?: string, city?: string): string {
  const count = `${total.toLocaleString('es-UY')} ${total === 1 ? 'auto' : 'autos'}`
  if (brand && city) return `${count} · ${brand} en ${city}`
  if (brand) return `${count} · ${brand} en Uruguay`
  if (city) return `${count} · autos en ${city}`
  return `${count} disponibles`
}

export function CatalogHeader({ total, brand, city }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <p className="text-sm text-[#A1A1AA]">
        <span className="text-white font-semibold">
          {buildDescription(total, brand, city)}
        </span>
      </p>
      <Suspense fallback={
        <div className="bg-[#1A1A1A] border border-[#27272A] rounded-lg px-3 py-2 text-sm text-[#52525B] w-44">
          Más recientes
        </div>
      }>
        <SortSelector />
      </Suspense>
    </div>
  )
}
