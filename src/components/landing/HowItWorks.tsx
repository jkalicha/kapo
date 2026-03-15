'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Search, MessageCircle, ShieldCheck, Camera, Inbox, Banknote } from 'lucide-react'

type Tab = 'compradores' | 'vendedores'

interface Step {
  icon: React.ElementType
  title: string
  description: string
}

const buyerSteps: Step[] = [
  {
    icon: Search,
    title: 'Buscá',
    description: 'Filtrá por marca, precio, año y ubicación. Encontrá el auto que buscás en segundos.',
  },
  {
    icon: MessageCircle,
    title: 'Contactá',
    description: 'Hablá directo con el vendedor o pedí intermediación para mayor seguridad.',
  },
  {
    icon: ShieldCheck,
    title: 'Comprá seguro',
    description: 'Retenemos el pago hasta que el auto sea tuyo. Sin sorpresas, sin riesgos.',
  },
]

const sellerSteps: Step[] = [
  {
    icon: Camera,
    title: 'Publicá',
    description: 'Subí fotos y completá los datos de tu auto. Gratis para empezar.',
  },
  {
    icon: Inbox,
    title: 'Recibí consultas',
    description: 'Los leads llegan directo a tu bandeja. Respondé cuando quieras.',
  },
  {
    icon: Banknote,
    title: 'Cobrá',
    description: 'Te transferimos el dinero cuando la operación se confirma. Garantizado.',
  },
]

const tabs: { id: Tab; label: string }[] = [
  { id: 'compradores', label: 'Compradores' },
  { id: 'vendedores', label: 'Vendedores' },
]

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<Tab>('compradores')
  const steps = activeTab === 'compradores' ? buyerSteps : sellerSteps

  return (
    <section id="how-it-works" className="py-20 bg-[#111111] border-y border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            ¿Cómo funciona Kapo?
          </h2>
          <p className="text-[#A1A1AA] mb-7">Simple, seguro y transparente para todos</p>

          {/* Tab switcher */}
          <div className="inline-flex bg-[#1A1A1A] border border-[#27272A] rounded-lg p-1">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'px-7 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  activeTab === id
                    ? 'bg-[#F5A623] text-black shadow-sm'
                    : 'text-[#A1A1AA] hover:text-white',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line between cards (desktop only) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-0.5rem] h-px bg-[#27272A]"
                  aria-hidden="true"
                />
              )}

              <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6 text-center relative hover:border-[#3F3F46] transition-colors">
                {/* Step number pill */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#F5A623] text-black text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Icon container */}
                <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#27272A] flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.icon size={22} className="text-[#F5A623]" aria-hidden="true" />
                </div>

                <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
