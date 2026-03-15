'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Comprar', href: '#listings' },
  { label: 'Vender', href: '#how-it-works' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Automotoras', href: '#dealerships' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#27272A]'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1 group">
          <span className="text-white font-bold text-xl tracking-widest">KAPO</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mb-0.5 group-hover:scale-125 transition-transform" />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white"
          >
            Publicar auto
          </Button>
          <Button
            size="sm"
            className="bg-[#F5A623] text-black hover:bg-[#E09610] font-semibold"
          >
            Entrar
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#A1A1AA] hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#27272A] px-4 pb-5">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[#A1A1AA] hover:text-white py-2.5 border-b border-[#27272A]/50 last:border-0"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                className="border-[#27272A] text-white hover:bg-[#1A1A1A] w-full"
              >
                Publicar auto
              </Button>
              <Button
                size="sm"
                className="bg-[#F5A623] text-black hover:bg-[#E09610] font-semibold w-full"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
