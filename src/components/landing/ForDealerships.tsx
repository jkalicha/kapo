import { Button } from '@/components/ui/button'
import { BarChart3, Users, Star, LayoutDashboard } from 'lucide-react'

const features = [
  { icon: BarChart3, label: 'Leads calificados' },
  { icon: Users, label: 'Mayor exposición' },
  { icon: Star, label: 'Planes exclusivos' },
  { icon: LayoutDashboard, label: 'Panel de gestión' },
]

const metrics = [
  { label: 'Consultas por mes', value: '+47', unit: 'leads' },
  { label: 'Ventas adicionales', value: '+12', unit: 'por mes' },
  { label: 'Retorno de inversión', value: '8x', unit: 'ROI' },
]

export function ForDealerships() {
  return (
    <section id="dealerships" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#111111] border border-[#27272A] rounded-2xl overflow-hidden">
          {/* Ambient glow top-right */}
          <div
            className="absolute top-0 right-0 w-96 h-96 bg-[#F5A623]/[0.06] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          />
          {/* Ambient glow bottom-left */}
          <div
            className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5A623]/[0.03] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative p-8 sm:p-12 lg:p-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
              {/* Left: content */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full px-3 py-1 mb-6">
                  <span className="text-xs text-[#F5A623] font-medium">Para automotoras</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                  ¿Tenés una automotora?
                </h2>
                <p className="text-lg text-[#A1A1AA] mb-8 max-w-lg leading-relaxed">
                  Publicá todo tu stock, recibí leads calificados y cerrá más ventas.
                  Planes diseñados para automotoras uruguayas.
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {features.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 bg-[#1A1A1A] border border-[#27272A] rounded-lg px-3 py-2"
                    >
                      <Icon size={14} className="text-[#F5A623]" aria-hidden="true" />
                      <span className="text-sm text-[#A1A1AA]">{label}</span>
                    </div>
                  ))}
                </div>

                <Button className="bg-[#F5A623] text-black hover:bg-[#E09610] font-bold px-8 h-11">
                  Quiero saber más
                </Button>
              </div>

              {/* Right: metrics card */}
              <div className="w-full lg:w-72 bg-[#1A1A1A] border border-[#27272A] rounded-xl p-6 shrink-0">
                <div className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-5">
                  Resultados promedio
                </div>
                <div className="space-y-5">
                  {metrics.map(({ label, value, unit }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-[#A1A1AA]">{label}</span>
                      <div className="text-right">
                        <span className="text-xl font-bold text-white">{value}</span>
                        <span className="text-xs text-[#A1A1AA] ml-1">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-[#27272A]">
                  <p className="text-xs text-[#52525B]">
                    Basado en automotoras activas en Kapo durante 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
