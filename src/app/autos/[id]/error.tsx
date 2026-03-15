'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ListingError({ error, reset }: Props) {
  useEffect(() => {
    console.error('[/autos/[id]] error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-6">🚗</p>
        <h2 className="text-xl font-bold text-white mb-2">No pudimos cargar este auto</h2>
        <p className="text-[#A1A1AA] text-sm mb-8">
          Ocurrió un error inesperado. Intentá de nuevo en unos segundos.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="bg-[#F5A623] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#E09610] transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/autos"
            className="border border-[#27272A] text-[#A1A1AA] px-5 py-2.5 rounded-lg hover:border-[#3F3F46] hover:text-white transition-colors text-sm"
          >
            Ver todos los autos
          </Link>
        </div>
      </div>
    </div>
  )
}
