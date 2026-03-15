'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('pagina')
    } else {
      params.set('pagina', String(page))
    }
    router.replace(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex items-center justify-center gap-4 py-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex items-center gap-1.5 px-4 py-2 border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:border-[#F5A623]/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        Anterior
      </button>

      <span className="text-sm text-[#A1A1AA]">
        Página{' '}
        <span className="text-white font-semibold">{currentPage}</span>
        {' '}de{' '}
        <span className="text-white font-semibold">{totalPages}</span>
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex items-center gap-1.5 px-4 py-2 border border-[#27272A] rounded-lg text-sm text-[#A1A1AA] hover:border-[#F5A623]/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Siguiente
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
