import Link from 'next/link'
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4">
      {/* Wordmark */}
      <Link href="/" className="flex items-center gap-1 group mb-8">
        <span className="text-white font-bold text-2xl tracking-widest">KAPO</span>
        <span className="w-2 h-2 rounded-full bg-[#F5A623] mb-0.5 group-hover:scale-125 transition-transform" />
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-[#111111] border border-[#27272A] rounded-xl p-8">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-[#52525B] text-center">
        © {new Date().getFullYear()} Kapo — Marketplace de autos en Uruguay
      </p>
    </div>
  )
}
