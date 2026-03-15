import Link from 'next/link'
import type { ReactNode } from 'react'

interface OnboardingLayoutProps {
  children: ReactNode
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Top bar */}
      <header className="border-b border-[#27272A] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-white font-bold text-lg tracking-widest">KAPO</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mb-0.5 group-hover:scale-125 transition-transform" />
          </Link>
          <span className="text-[#52525B] text-sm ml-2">Configurá tu cuenta de vendedor</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl">
          {children}
        </div>
      </main>

      {/* Escape link */}
      <footer className="border-t border-[#27272A] px-4 py-4 text-center">
        <p className="text-sm text-[#52525B]">
          ¿Querés explorar primero?{' '}
          <Link href="/autos" className="text-[#F5A623] hover:underline">
            Ver autos →
          </Link>
        </p>
      </footer>
    </div>
  )
}
