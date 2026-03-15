import { Button } from '@/components/ui/button'

const stats = [
  { icon: '🚗', label: '+2.400 autos publicados' },
  { icon: '🤝', label: '+1.200 ventas concretadas' },
  { icon: '⭐', label: '4.8/5 satisfacción' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0A0A0A]">
      {/* Subtle grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="hero-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Amber atmospheric glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#F5A623]/[0.04] blur-[140px] pointer-events-none" />

      {/* Decorative circles */}
      <div className="absolute top-24 right-8 w-72 h-72 rounded-full border border-[#27272A]/60 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-36 right-20 w-44 h-44 rounded-full border border-[#27272A]/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-32 left-8 w-56 h-56 rounded-full border border-[#27272A]/40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-48 left-24 w-28 h-28 rounded-full border border-[#27272A]/30 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#111111] border border-[#27272A] rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
            <span className="text-xs text-[#A1A1AA] tracking-wide">
              El nuevo estándar para comprar y vender autos en Uruguay
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.04] tracking-tight mb-6">
            El marketplace de autos{' '}
            <span className="text-[#F5A623]">más confiable</span>{' '}
            de Uruguay.
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#A1A1AA] max-w-2xl mb-10 leading-relaxed">
            Comprá o vendé con seguridad. Intermediación garantizada. Sin vueltas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Button
              size="lg"
              className="bg-[#F5A623] text-black hover:bg-[#E09610] font-bold text-base px-8 h-12"
            >
              Buscar autos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#27272A] text-white hover:bg-[#111111] hover:text-white text-base px-8 h-12"
            >
              Publicar gratis
            </Button>
          </div>

          {/* Trust stats */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 pt-6 border-t border-[#27272A]/50">
            {stats.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="text-base" aria-hidden="true">{icon}</span>
                <span className="text-sm text-[#A1A1AA]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
