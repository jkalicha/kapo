import type { ListingWithSeller } from '@/types/prisma'

const fuelLabel: Record<string, string> = {
  NAFTA: 'Nafta',
  DIESEL: 'Diesel',
  HIBRIDO: 'Híbrido',
  ELECTRICO: 'Eléctrico',
  GNC: 'GNC',
}

const transmissionLabel: Record<string, string> = {
  MANUAL: 'Manual',
  AUTOMATICO: 'Automático',
}

interface Props {
  listing: ListingWithSeller
}

interface SpecRow {
  label: string
  value: string | number | null | undefined
}

export function ListingSpecs({ listing }: Props) {
  const rows: SpecRow[] = [
    { label: 'Marca', value: listing.brand },
    { label: 'Modelo', value: listing.model },
    { label: 'Versión', value: listing.version },
    { label: 'Año', value: listing.year },
    { label: 'Kilometraje', value: `${listing.km.toLocaleString('es-UY')} km` },
    { label: 'Combustible', value: fuelLabel[listing.fuel] ?? listing.fuel },
    { label: 'Transmisión', value: transmissionLabel[listing.transmission] ?? listing.transmission },
    { label: 'Color', value: listing.color },
    { label: 'Puertas', value: listing.doors },
    { label: 'Acepta permuta', value: listing.acceptsTrade ? 'Sí' : null },
    { label: 'Financiación', value: listing.hasFinancing ? 'Disponible' : null },
    { label: 'Departamento', value: listing.department },
  ].filter(row => row.value !== null && row.value !== undefined && row.value !== '') as { label: string; value: string | number }[]

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-white mb-4">Ficha técnica</h2>
      <div className="bg-[#111111] border border-[#27272A] rounded-xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-4 py-3 text-sm ${
              i % 2 === 0 ? 'bg-[#111111]' : 'bg-[#0F0F0F]'
            }`}
          >
            <span className="text-[#A1A1AA]">{row.label}</span>
            <span className="text-white font-medium text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
