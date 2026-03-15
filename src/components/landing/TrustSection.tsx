import { Lock, ShieldCheck, MessageCircle, Star } from 'lucide-react'

const trustFeatures = [
  {
    icon: Lock,
    title: 'Intermediación segura',
    description:
      'Retenemos el pago hasta la transferencia del vehículo. Tu dinero está siempre protegido, sin excepciones.',
  },
  {
    icon: ShieldCheck,
    title: 'Vendedores verificados',
    description:
      'Automotoras con documentación validada. Particulares con identidad confirmada antes de publicar.',
  },
  {
    icon: MessageCircle,
    title: 'Soporte local',
    description:
      'Equipo uruguayo disponible ante cualquier problema. Te conocemos, hablamos tu idioma.',
  },
  {
    icon: Star,
    title: 'Reseñas reales',
    description:
      'Solo compradores que cerraron una operación pueden calificar. Nada de reseñas falsas o incentivadas.',
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-[#111111] border-y border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            Vendé y comprá con total seguridad
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            Diseñamos Kapo para que nunca tengas que preocuparte por una estafa o un problema legal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {trustFeatures.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 hover:border-[#3F3F46] transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#F5A623]" aria-hidden="true" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
