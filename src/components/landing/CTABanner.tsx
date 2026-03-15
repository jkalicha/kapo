import { Button } from '@/components/ui/button'

export function CTABanner() {
  return (
    <section className="py-24 bg-[#111111] border-t border-[#27272A] relative overflow-hidden">
      {/* Amber radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#F5A623]/[0.05] rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="cta-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cta-grid)" />
      </svg>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
          Empezá hoy. Es gratis.
        </h2>
        <p className="text-lg text-[#A1A1AA] mb-8">
          Publicá tu primer auto sin costo. Sin tarjeta. Sin compromisos.
        </p>
        <Button
          size="lg"
          className="bg-[#F5A623] text-black hover:bg-[#E09610] font-bold text-base px-10 h-12"
        >
          Publicar mi auto
        </Button>
      </div>
    </section>
  )
}
