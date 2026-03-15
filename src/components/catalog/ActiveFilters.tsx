'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X } from 'lucide-react'

const fuelLabels: Record<string, string> = {
  NAFTA: 'Nafta',
  DIESEL: 'Diesel',
  HIBRIDO: 'Híbrido',
  ELECTRICO: 'Eléctrico',
  GNC: 'GNC',
}

const transmisionLabels: Record<string, string> = {
  MANUAL: 'Manual',
  AUTOMATICO: 'Automático',
}

interface FilterBadge {
  key: string
  label: string
  clearKeys: string[]
}

export function ActiveFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const badges: FilterBadge[] = []

  const marca = searchParams.get('marca')
  if (marca) badges.push({ key: 'marca', label: marca, clearKeys: ['marca'] })

  const modelo = searchParams.get('modelo')
  if (modelo) badges.push({ key: 'modelo', label: modelo, clearKeys: ['modelo'] })

  const precioMin = searchParams.get('precio_min')
  const precioMax = searchParams.get('precio_max')
  if (precioMin && precioMax) {
    badges.push({
      key: 'precio',
      label: `U$S ${Number(precioMin).toLocaleString('es-UY')} – ${Number(precioMax).toLocaleString('es-UY')}`,
      clearKeys: ['precio_min', 'precio_max'],
    })
  } else if (precioMax) {
    badges.push({
      key: 'precio_max',
      label: `Hasta U$S ${Number(precioMax).toLocaleString('es-UY')}`,
      clearKeys: ['precio_max'],
    })
  } else if (precioMin) {
    badges.push({
      key: 'precio_min',
      label: `Desde U$S ${Number(precioMin).toLocaleString('es-UY')}`,
      clearKeys: ['precio_min'],
    })
  }

  const anioMin = searchParams.get('anio_min')
  const anioMax = searchParams.get('anio_max')
  if (anioMin && anioMax) {
    badges.push({
      key: 'anio',
      label: `${anioMin} – ${anioMax}`,
      clearKeys: ['anio_min', 'anio_max'],
    })
  } else if (anioMin) {
    badges.push({ key: 'anio_min', label: `Desde ${anioMin}`, clearKeys: ['anio_min'] })
  } else if (anioMax) {
    badges.push({ key: 'anio_max', label: `Hasta ${anioMax}`, clearKeys: ['anio_max'] })
  }

  const combustible = searchParams.get('combustible')
  if (combustible) {
    badges.push({
      key: 'combustible',
      label: fuelLabels[combustible] ?? combustible,
      clearKeys: ['combustible'],
    })
  }

  const transmision = searchParams.get('transmision')
  if (transmision) {
    badges.push({
      key: 'transmision',
      label: transmisionLabels[transmision] ?? transmision,
      clearKeys: ['transmision'],
    })
  }

  const ciudad = searchParams.get('ciudad')
  if (ciudad) badges.push({ key: 'ciudad', label: ciudad, clearKeys: ['ciudad'] })

  if (searchParams.get('con_financiacion') === 'true') {
    badges.push({ key: 'con_financiacion', label: 'Con financiación', clearKeys: ['con_financiacion'] })
  }
  if (searchParams.get('permuta') === 'true') {
    badges.push({ key: 'permuta', label: 'Acepta permuta', clearKeys: ['permuta'] })
  }
  if (searchParams.get('destacados') === 'true') {
    badges.push({ key: 'destacados', label: '⭐ Destacados', clearKeys: ['destacados'] })
  }

  if (badges.length === 0) return null

  const removeFilter = (clearKeys: string[]) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const k of clearKeys) params.delete(k)
    params.delete('pagina')
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pb-4">
      {badges.map(({ key, label, clearKeys }) => (
        <button
          key={key}
          onClick={() => removeFilter(clearKeys)}
          className="flex items-center gap-1.5 bg-[#F5A623]/15 border border-[#F5A623]/30 text-[#F5A623] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F5A623]/25 transition-colors"
        >
          {label}
          <X size={11} />
        </button>
      ))}
      {badges.length > 1 && (
        <button
          onClick={() => router.replace(pathname)}
          className="text-xs text-[#A1A1AA] hover:text-white underline underline-offset-2 transition-colors ml-1"
        >
          Limpiar todo
        </button>
      )}
    </div>
  )
}
