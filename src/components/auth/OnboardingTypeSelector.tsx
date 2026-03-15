'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

type SellerType = 'particular' | 'automotora'

const options: Array<{
  type: SellerType
  emoji: string
  title: string
  subtitle: string
  features: string[]
}> = [
  {
    type: 'particular',
    emoji: '👤',
    title: 'Particular',
    subtitle: 'Vendé tu propio auto',
    features: ['Publicación simple y rápida', 'Sin comisiones', 'Contacto directo con compradores'],
  },
  {
    type: 'automotora',
    emoji: '🏢',
    title: 'Automotora',
    subtitle: 'Gestioná tu negocio',
    features: ['Múltiples publicaciones', 'Panel de gestión', 'Leads calificados'],
  },
]

export function OnboardingTypeSelector() {
  const router = useRouter()
  const [selected, setSelected] = useState<SellerType | null>(null)

  function handleContinue() {
    if (!selected) return
    router.push(`/onboarding/perfil?tipo=${selected}`)
  }

  return (
    <div className="space-y-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center text-black text-xs font-bold">1</div>
          <span className="text-sm text-white font-medium">Tipo de cuenta</span>
        </div>
        <div className="w-8 h-px bg-[#27272A]" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-[#27272A] flex items-center justify-center text-[#52525B] text-xs">2</div>
          <span className="text-sm text-[#52525B]">Tu perfil</span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">¿Cómo vas a usar Kapo?</h1>
        <p className="text-[#A1A1AA] mt-2">Elegí el tipo de cuenta que mejor se adapte a vos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selected === option.type
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setSelected(option.type)}
              className={cn(
                'relative text-left p-6 rounded-xl border-2 transition-all duration-200',
                isSelected
                  ? 'border-[#F5A623] bg-[#F5A623]/5'
                  : 'border-[#27272A] bg-[#111111] hover:border-[#F5A623]/50',
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#F5A623] flex items-center justify-center">
                  <Check size={12} className="text-black" />
                </div>
              )}
              <div className="text-3xl mb-3">{option.emoji}</div>
              <div className="font-bold text-white text-lg">{option.title}</div>
              <div className="text-[#A1A1AA] text-sm mt-1 mb-4">{option.subtitle}</div>
              <ul className="space-y-1.5">
                {option.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                    <div className="w-1 h-1 rounded-full bg-[#F5A623] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!selected}
          onClick={handleContinue}
          className="bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold px-8 disabled:opacity-40"
        >
          Continuar →
        </Button>
      </div>
    </div>
  )
}
