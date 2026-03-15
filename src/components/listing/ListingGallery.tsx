'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { ListingImage } from '@prisma/client'

interface Props {
  images: ListingImage[]
  brand: string
}

export function ListingGallery({ images, brand }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const hasImages = images.length > 0
  const activeImage = hasImages ? images[activeIndex] : null

  const prev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const next = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, prev, next])

  if (!hasImages) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex flex-col items-center justify-center">
        <span className="text-7xl font-bold text-[#27272A]">{brand[0]}</span>
        <p className="text-[#52525B] text-sm mt-2">Sin fotos disponibles</p>
      </div>
    )
  }

  return (
    <div>
      {/* ── Main image ───────────────────────────────────────────────────── */}
      <div
        className="relative aspect-video rounded-xl overflow-hidden bg-[#1A1A1A] cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={activeImage!.url}
          alt={`${brand} — imagen ${activeIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 100vw, 65vw"
          unoptimized
          priority
        />
        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} className="text-white" />
        </div>
        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/60 rounded-full px-2.5 py-1 text-xs text-white">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnails ──────────────────────────────────────────────────── */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-20 h-[60px] rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? 'border-[#F5A623]'
                  : 'border-[#27272A] hover:border-[#3F3F46]'
              }`}
            >
              <Image
                src={img.url}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors z-10"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm tabular-nums">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors z-10 bg-black/40 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors z-10 bg-black/40 rounded-full p-2"
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].url}
              alt={`${brand} — imagen ${activeIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  )
}
