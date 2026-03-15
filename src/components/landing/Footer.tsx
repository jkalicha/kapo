import { Separator } from '@/components/ui/separator'

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Marketplace: [
    { label: 'Comprar', href: '#listings' },
    { label: 'Vender', href: '#how-it-works' },
    { label: 'Destacar auto', href: '#' },
  ],
  Empresa: [
    { label: 'Nosotros', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Prensa', href: '#' },
  ],
  Soporte: [
    { label: 'Preguntas frecuentes', href: '#' },
    { label: 'Contacto', href: '#' },
    { label: 'WhatsApp', href: '#' },
  ],
  Legal: [
    { label: 'Términos de uso', href: '#' },
    { label: 'Privacidad', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#27272A] pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-white font-bold text-lg tracking-widest">KAPO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" aria-hidden="true" />
            </div>
            <p className="text-xs text-[#52525B] leading-relaxed">
              El auto que buscás,
              <br />
              al precio que querés.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-[#27272A] mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#3F3F46]">
            © 2025 Kapo. Hecho en Uruguay{' '}
            <span aria-label="Bandera de Uruguay">🇺🇾</span>
          </p>
          <p className="text-xs text-[#3F3F46]">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
