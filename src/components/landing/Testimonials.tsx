const testimonials = [
  {
    quote:
      'Vendí mi Sandero en 10 días. El proceso fue clarísimo y el equipo de Kapo me ayudó con toda la papelería. Nunca pensé que sería tan fácil.',
    name: 'Valentina Rodríguez',
    city: 'Montevideo',
    role: 'Vendedora',
    rating: 5,
  },
  {
    quote:
      'Compré una Hilux con intermediación y me quedé tranquilo en todo momento. Sabés que si algo sale mal, Kapo te respalda. Eso no tiene precio.',
    name: 'Matías Fernández',
    city: 'Maldonado',
    role: 'Comprador',
    rating: 5,
  },
  {
    quote:
      'Tenemos 3 sucursales y desde que usamos Kapo los leads triplicaron. El panel es simple y los contactos llegan solos. Lo recomendamos a todas las automotoras.',
    name: 'Sergio Bentancur',
    city: 'Paysandú',
    role: 'Automotora',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Lo que dice la gente
          </h2>
          <p className="text-[#A1A1AA]">Más de 1.200 operaciones cerradas en Uruguay</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ quote, name, city, role, rating }) => (
            <div
              key={name}
              className="bg-[#111111] border border-[#27272A] rounded-xl p-6 hover:border-[#3F3F46] transition-colors flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4" aria-label={`${rating} estrellas`}>
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-[#F5A623] text-sm" aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#A1A1AA] text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#27272A]">
                <div className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#27272A] flex items-center justify-center text-sm font-semibold text-white shrink-0">
                  {name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{name}</div>
                  <div className="text-xs text-[#A1A1AA]">
                    {role} · {city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
