import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const filters = [
  { label: 'Marca', placeholder: 'Toyota, VW, Chevrolet…' },
  { label: 'Modelo', placeholder: 'Corolla, Gol, Cruze…' },
  { label: 'Precio máximo', placeholder: 'U$S 25.000' },
  { label: 'Ubicación', placeholder: 'Montevideo, Maldonado…' },
]

export function SearchBar() {
  return (
    <section className="bg-[#111111] border-y border-[#27272A] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1A1A1A] border border-[#27272A] rounded-xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filters.map(({ label, placeholder }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#A1A1AA] px-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F5A623]/40 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-end">
              <Button className="bg-[#F5A623] text-black hover:bg-[#E09610] font-bold h-[42px] px-7 w-full lg:w-auto gap-2">
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
