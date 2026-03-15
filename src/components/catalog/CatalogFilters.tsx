'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'

const FUEL_OPTIONS = [
  { value: 'NAFTA', label: 'Nafta' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HIBRIDO', label: 'Híbrido' },
  { value: 'ELECTRICO', label: 'Eléctrico' },
  { value: 'GNC', label: 'GNC' },
] as const

const CITY_OPTIONS = [
  'Montevideo',
  'Canelones',
  'Maldonado',
  'Salto',
  'Paysandú',
  'Rivera',
  'Colonia',
  'Rocha',
  'Tacuarembó',
  'Melo',
  'Mercedes',
]

const PRICE_PRESETS = [
  { label: 'Hasta U$S 10.000', min: undefined, max: '10000' },
  { label: 'U$S 10.000 – 20.000', min: '10000', max: '20000' },
  { label: 'U$S 20.000 – 35.000', min: '20000', max: '35000' },
  { label: 'Más de U$S 35.000', min: '35000', max: undefined },
]

const YEAR_RANGE = Array.from({ length: 26 }, (_, i) => 2025 - i)

// ── Section wrapper ──────────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#52525B] uppercase tracking-widest mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function CatalogFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Current param values
  const marcaValue = searchParams.get('marca') ?? ''
  const modeloValue = searchParams.get('modelo') ?? ''
  const precioMin = searchParams.get('precio_min') ?? ''
  const precioMax = searchParams.get('precio_max') ?? ''
  const anioMin = searchParams.get('anio_min') ?? ''
  const anioMax = searchParams.get('anio_max') ?? ''
  const combustible = searchParams.get('combustible') ?? ''
  const transmision = searchParams.get('transmision') ?? ''
  const ciudad = searchParams.get('ciudad') ?? ''
  const conFinanciacion = searchParams.get('con_financiacion') === 'true'
  const permuta = searchParams.get('permuta') === 'true'
  const soloDestacados = searchParams.get('destacados') === 'true'

  const activeCount = [
    'marca', 'modelo', 'precio_min', 'precio_max',
    'anio_min', 'anio_max', 'combustible', 'transmision',
    'ciudad', 'con_financiacion', 'permuta', 'destacados',
  ].filter((k) => searchParams.has(k)).length

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('pagina')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const updateMultiple = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined) {
          params.set(k, v)
        } else {
          params.delete(k)
        }
      }
      params.delete('pagina')
      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const clearAll = () => {
    router.replace(pathname)
    setDrawerOpen(false)
  }

  const handleText = (key: string, value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam(key, value || undefined)
    }, 400)
  }

  const isPricePresetActive = (preset: (typeof PRICE_PRESETS)[number]) =>
    precioMin === (preset.min ?? '') && precioMax === (preset.max ?? '')

  const togglePricePreset = (preset: (typeof PRICE_PRESETS)[number]) => {
    if (isPricePresetActive(preset)) {
      updateMultiple({ precio_min: undefined, precio_max: undefined })
    } else {
      updateMultiple({ precio_min: preset.min, precio_max: preset.max })
    }
  }

  // ── Filter content (shared between drawer + sidebar) ──────────────────────
  const filterContent = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Filtros</span>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[#F5A623] hover:underline underline-offset-2 transition-opacity"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* 1 · Búsqueda libre */}
      <FilterSection title="Búsqueda">
        <div className="flex flex-col gap-2">
          <input
            key={`marca-${marcaValue}`}
            type="text"
            placeholder="Marca: Toyota, VW…"
            defaultValue={marcaValue}
            onChange={(e) => handleText('marca', e.target.value)}
            className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F5A623]/40 transition-colors"
          />
          <input
            key={`modelo-${modeloValue}`}
            type="text"
            placeholder="Modelo: Corolla, Gol…"
            defaultValue={modeloValue}
            onChange={(e) => handleText('modelo', e.target.value)}
            className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F5A623]/40 transition-colors"
          />
        </div>
      </FilterSection>

      {/* 2 · Precio */}
      <FilterSection title="Precio (USD)">
        <div className="flex flex-col gap-1.5">
          {PRICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => togglePricePreset(preset)}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                isPricePresetActive(preset)
                  ? 'border-[#F5A623]/60 bg-[#F5A623]/10 text-[#F5A623]'
                  : 'border-[#27272A] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* 3 · Año */}
      <FilterSection title="Año">
        <div className="flex gap-2">
          <select
            value={anioMin}
            onChange={(e) => updateParam('anio_min', e.target.value || undefined)}
            className="flex-1 bg-[#0A0A0A] border border-[#27272A] rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#F5A623]/40 cursor-pointer"
          >
            <option value="">Desde</option>
            {YEAR_RANGE.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={anioMax}
            onChange={(e) => updateParam('anio_max', e.target.value || undefined)}
            className="flex-1 bg-[#0A0A0A] border border-[#27272A] rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#F5A623]/40 cursor-pointer"
          >
            <option value="">Hasta</option>
            {YEAR_RANGE.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* 4 · Combustible */}
      <FilterSection title="Combustible">
        <div className="flex flex-col gap-2">
          {FUEL_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={combustible === opt.value}
                onChange={() =>
                  updateParam('combustible', combustible === opt.value ? undefined : opt.value)
                }
                className="w-4 h-4 rounded border-[#27272A] bg-[#0A0A0A] accent-[#F5A623] cursor-pointer"
              />
              <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* 5 · Transmisión */}
      <FilterSection title="Transmisión">
        <div className="flex flex-col gap-2">
          {[
            { value: '', label: 'Todos' },
            { value: 'MANUAL', label: 'Manual' },
            { value: 'AUTOMATICO', label: 'Automático' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="transmision-filter"
                checked={transmision === opt.value}
                onChange={() => updateParam('transmision', opt.value || undefined)}
                className="w-4 h-4 border-[#27272A] bg-[#0A0A0A] accent-[#F5A623] cursor-pointer"
              />
              <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* 6 · Ciudad */}
      <FilterSection title="Ciudad">
        <select
          value={ciudad}
          onChange={(e) => updateParam('ciudad', e.target.value || undefined)}
          className="w-full bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5A623]/40 cursor-pointer"
        >
          <option value="">Todas las ciudades</option>
          {CITY_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterSection>

      {/* 7 · Características */}
      <FilterSection title="Características">
        <div className="flex flex-col gap-2">
          {[
            { key: 'destacados', label: '⭐ Solo destacados', checked: soloDestacados },
            { key: 'permuta', label: 'Acepta permuta', checked: permuta },
            { key: 'con_financiacion', label: 'Con financiación', checked: conFinanciacion },
          ].map(({ key, label, checked }) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => updateParam(key, checked ? undefined : 'true')}
                className="w-4 h-4 rounded border-[#27272A] bg-[#0A0A0A] accent-[#F5A623] cursor-pointer"
              />
              <span className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* ── Mobile trigger ──────────────────────────────────────────────────── */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 bg-[#1A1A1A] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-white hover:border-[#3F3F46] transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filtros
          {activeCount > 0 && (
            <span className="bg-[#F5A623] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-[#111111] border-r border-[#27272A] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-white">Filtros</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#A1A1AA] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-[280px] shrink-0 self-start sticky top-6">
        <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5">
          {filterContent}
        </div>
      </aside>
    </>
  )
}
