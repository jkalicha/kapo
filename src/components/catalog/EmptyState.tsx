import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" aria-hidden="true">
        {/* Car body */}
        <rect x="8" y="50" width="76" height="28" rx="7" fill="#27272A" />
        <rect x="22" y="30" width="48" height="24" rx="5" fill="#3F3F46" />
        {/* Windows */}
        <rect x="26" y="34" width="18" height="14" rx="3" fill="#52525B" />
        <rect x="48" y="34" width="17" height="14" rx="3" fill="#52525B" />
        {/* Wheels */}
        <circle cx="26" cy="78" r="11" fill="#3F3F46" />
        <circle cx="26" cy="78" r="5" fill="#27272A" />
        <circle cx="66" cy="78" r="11" fill="#3F3F46" />
        <circle cx="66" cy="78" r="5" fill="#27272A" />
        {/* Magnifying glass */}
        <circle cx="96" cy="28" r="16" stroke="#F5A623" strokeWidth="3" fill="none" />
        <circle cx="96" cy="28" r="8" stroke="#F5A623" strokeWidth="1.5" fill="none" />
        <line x1="107" y1="40" x2="117" y2="50" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
        {/* Question mark */}
        <text x="92" y="34" fill="#F5A623" fontSize="13" fontWeight="bold">?</text>
      </svg>

      <div>
        <h3 className="text-xl font-bold text-white mb-2">
          No encontramos autos con esos filtros
        </h3>
        <p className="text-[#A1A1AA] text-sm max-w-xs mx-auto">
          Probá ajustando los filtros o limpiando la búsqueda
        </p>
      </div>

      <Link
        href="/autos"
        className="bg-[#F5A623] text-black font-bold px-6 py-2.5 rounded-lg hover:bg-[#E09610] transition-colors"
      >
        Ver todos los autos
      </Link>
    </div>
  )
}
