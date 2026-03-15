'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PRICE_OPTIONS = [
  { label: 'Sin límite', value: '' },
  { label: 'Hasta U$S 10.000', value: '10000' },
  { label: 'Hasta U$S 15.000', value: '15000' },
  { label: 'Hasta U$S 20.000', value: '20000' },
  { label: 'Hasta U$S 30.000', value: '30000' },
  { label: 'Hasta U$S 50.000', value: '50000' },
]

const CITY_OPTIONS = [
  'Montevideo',
  'Canelones',
  'Maldonado',
  'Salto',
  'Paysandú',
  'Rivera',
  'Colonia',
]

export function SearchBar() {
  const router = useRouter()
  const marcaRef = useRef<HTMLInputElement>(null)
  const precioRef = useRef<HTMLSelectElement>(null)
  const ciudadRef = useRef<HTMLSelectElement>(null)

  const handleSearch = () => {
    const params = new URLSearchParams()
    const marca = marcaRef.current?.value.trim()
    const precio = precioRef.current?.value
    const ciudad = ciudadRef.current?.value

    if (marca) params.set('marca', marca)
    if (precio) params.set('precio_max', precio)
    if (ciudad) params.set('ciudad', ciudad)

    const qs = params.toString()
    router.push(`/autos${qs ? `?${qs}` : ''}`)
  }

  return (
    <section className="bg-[#111111] border-y border-[#27272A] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] border border-[#27272A] rounded-xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Marca */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA] px-1">Marca</label>
                <input
                  ref={marcaRef}
                  type="text"
                  placeholder="Toyota, VW, Chevrolet…"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F5A623]/40 transition-colors"
                />
              </div>

              {/* Precio máximo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA] px-1">
                  Precio máximo
                </label>
                <select
                  ref={precioRef}
                  className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5A623]/40 transition-colors cursor-pointer"
                >
                  {PRICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#A1A1AA] px-1">
                  Ubicación
                </label>
                <select
                  ref={ciudadRef}
                  className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5A623]/40 transition-colors cursor-pointer"
                >
                  <option value="">Toda Uruguay</option>
                  {CITY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="bg-[#F5A623] text-black hover:bg-[#E09610] font-bold h-[42px] px-7 w-full lg:w-auto gap-2"
              >
                <Search size={16} />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
