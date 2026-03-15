'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Menu, X, LayoutDashboard, LogOut, Car } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'

const navLinks = [
  { label: 'Comprar', href: '#listings' },
  { label: 'Vender', href: '#how-it-works' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Automotoras', href: '#dealerships' },
]

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} className="w-8 h-8 rounded-full object-cover" />
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center text-black text-xs font-bold">
      {initials}
    </div>
  )
}

export function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: session, isPending } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  const hasSeller = (session?.user as Record<string, unknown> | undefined)?.role === 'SELLER'

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
        <Link href="/" className="flex items-center gap-1 group">
          <span className="text-white font-bold text-xl tracking-widest">KAPO</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] mb-0.5 group-hover:scale-125 transition-transform" />
        </Link>

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
          {isPending ? (
            <div className="w-8 h-8 rounded-full bg-[#1A1A1A] animate-pulse" />
          ) : session ? (
            <>
              {hasSeller ? (
                <Button asChild size="sm" variant="outline" className="border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white gap-1.5">
                  <Link href="/dashboard"><LayoutDashboard size={14} />Mi panel</Link>
                </Button>
              ) : (
                <Button asChild size="sm" variant="outline" className="border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white gap-1.5">
                  <Link href="/onboarding"><Car size={14} />Vender mi auto</Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A623]/50">
                    <UserAvatar name={session.user.name ?? 'U'} image={session.user.image} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#111111] border-[#27272A] text-white">
                  <div className="px-2 py-1.5 text-xs text-[#A1A1AA]">{session.user.email}</div>
                  <DropdownMenuSeparator className="bg-[#27272A]" />
                  <DropdownMenuItem asChild className="focus:bg-[#1A1A1A] focus:text-white cursor-pointer gap-2">
                    <Link href="/dashboard"><LayoutDashboard size={14} />Mi panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#27272A]" />
                  <DropdownMenuItem
                    className="focus:bg-[#1A1A1A] focus:text-red-400 text-red-400 cursor-pointer gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} />Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white">
                <Link href="/sign-up">Publicar auto</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#F5A623] text-black hover:bg-[#E09610] font-semibold">
                <Link href="/sign-in">Entrar</Link>
              </Button>
            </>
          )}
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
              {session ? (
                <>
                  <Button asChild variant="outline" size="sm" className="border-[#27272A] text-white hover:bg-[#1A1A1A] w-full">
                    <Link href="/dashboard">Mi panel</Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 w-full" onClick={handleSignOut}>
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="border-[#27272A] text-white hover:bg-[#1A1A1A] w-full">
                    <Link href="/sign-up">Publicar auto</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-[#F5A623] text-black hover:bg-[#E09610] font-semibold w-full">
                    <Link href="/sign-in">Entrar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
