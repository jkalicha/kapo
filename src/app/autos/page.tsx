import { Suspense } from 'react'
import type { Metadata } from 'next'
import { FuelType, Transmission } from '@prisma/client'
import { getListings, type Orden } from '@/lib/queries/listings'
import { CatalogFilters } from '@/components/catalog/CatalogFilters'
import { CatalogGrid, CatalogGridSkeleton } from '@/components/catalog/CatalogGrid'
import { CatalogHeader } from '@/components/catalog/CatalogHeader'
import { ActiveFilters } from '@/components/catalog/ActiveFilters'
import { PaginationControls } from '@/components/catalog/PaginationControls'

// ── Type helpers ─────────────────────────────────────────────────────────────

type RawParams = Promise<{ [key: string]: string | string[] | undefined }>

function str(val: string | string[] | undefined): string | undefined {
  if (!val) return undefined
  return Array.isArray(val) ? val[0] : val
}

function safeInt(val: string | undefined): number | undefined {
  if (!val) return undefined
  const n = parseInt(val, 10)
  return isNaN(n) ? undefined : n
}

function parseFuel(val: string | undefined): FuelType | undefined {
  const valid: FuelType[] = ['NAFTA', 'DIESEL', 'HIBRIDO', 'ELECTRICO', 'GNC']
  return valid.includes(val as FuelType) ? (val as FuelType) : undefined
}

function parseTransmission(val: string | undefined): Transmission | undefined {
  const valid: Transmission[] = ['MANUAL', 'AUTOMATICO']
  return valid.includes(val as Transmission) ? (val as Transmission) : undefined
}

function parseOrden(val: string | undefined): Orden | undefined {
  const valid: Orden[] = ['reciente', 'precio_asc', 'precio_desc', 'km_asc']
  return valid.includes(val as Orden) ? (val as Orden) : undefined
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  searchParams,
}: {
  searchParams: RawParams
}): Promise<Metadata> {
  const params = await searchParams
  const marca = str(params.marca)
  const ciudad = str(params.ciudad)

  let title = 'Autos usados en Uruguay — Kapo'
  if (marca && ciudad) title = `${marca} en venta en ${ciudad} — Kapo`
  else if (marca) title = `${marca} en venta en Uruguay — Kapo`
  else if (ciudad) title = `Autos usados en ${ciudad} — Kapo`

  return {
    title,
    description:
      'Encontrá tu próximo auto usado en Uruguay. Miles de autos de automotoras y particulares verificados.',
  }
}

// ── Inner async component for streaming ──────────────────────────────────────

interface ResultsProps {
  brand?: string
  model?: string
  ciudad?: string
  combustible?: FuelType
  transmision?: Transmission
  orden?: Orden
  page: number
  precioMin?: number
  precioMax?: number
  anioMin?: number
  anioMax?: number
  conFinanciacion?: boolean
  permuta?: boolean
  destacados?: boolean
}

async function CatalogResults({
  brand,
  model,
  ciudad,
  combustible,
  transmision,
  orden,
  page,
  precioMin,
  precioMax,
  anioMin,
  anioMax,
  conFinanciacion,
  permuta,
  destacados,
}: ResultsProps) {
  const { listings, total, pages } = await getListings({
    brand,
    model,
    city: ciudad,
    fuel: combustible,
    transmission: transmision,
    orden,
    page,
    pageSize: 12,
    minPrice: precioMin,
    maxPrice: precioMax,
    minYear: anioMin,
    maxYear: anioMax,
    hasFinancing: conFinanciacion,
    acceptsTrade: permuta,
    featured: destacados,
  })

  return (
    <>
      <div className="mb-6">
        <CatalogHeader total={total} brand={brand} city={ciudad} />
      </div>
      <CatalogGrid listings={listings} />
      <Suspense fallback={null}>
        <PaginationControls currentPage={page} totalPages={pages} />
      </Suspense>
    </>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function AutosPage({ searchParams }: { searchParams: RawParams }) {
  const params = await searchParams

  const brand = str(params.marca)
  const model = str(params.modelo)
  const ciudad = str(params.ciudad)
  const combustible = parseFuel(str(params.combustible))
  const transmision = parseTransmission(str(params.transmision))
  const orden = parseOrden(str(params.orden))
  const page = safeInt(str(params.pagina)) ?? 1
  const precioMin = safeInt(str(params.precio_min))
  const precioMax = safeInt(str(params.precio_max))
  const anioMin = safeInt(str(params.anio_min))
  const anioMax = safeInt(str(params.anio_max))
  const conFinanciacion = str(params.con_financiacion) === 'true' ? true : undefined
  const permuta = str(params.permuta) === 'true' ? true : undefined
  const destacados = str(params.destacados) === 'true' ? true : undefined

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── Page header band ─────────────────────────────────────────────── */}
      <div className="bg-[#111111] border-b border-[#27272A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white">Autos usados en Uruguay</h1>
          <p className="text-[#A1A1AA] text-sm mt-1">
            Comprá directo de automotoras y particulares verificados
          </p>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active filter badges */}
        <Suspense fallback={null}>
          <ActiveFilters />
        </Suspense>

        {/* Two-column layout on desktop, stacked on mobile */}
        <div className="lg:flex gap-8">
          {/* Sidebar — client component, reads its own searchParams */}
          <Suspense fallback={null}>
            <CatalogFilters />
          </Suspense>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<CatalogGridSkeleton />}>
              <CatalogResults
                brand={brand}
                model={model}
                ciudad={ciudad}
                combustible={combustible}
                transmision={transmision}
                orden={orden}
                page={page}
                precioMin={precioMin}
                precioMax={precioMax}
                anioMin={anioMin}
                anioMax={anioMax}
                conFinanciacion={conFinanciacion}
                permuta={permuta}
                destacados={destacados}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
