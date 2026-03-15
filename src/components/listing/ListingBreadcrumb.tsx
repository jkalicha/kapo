import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { ListingWithSeller } from '@/types/prisma'

interface Props {
  listing: ListingWithSeller
}

export function ListingBreadcrumb({ listing }: Props) {
  const crumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Autos', href: '/autos' },
    { label: listing.brand, href: `/autos?marca=${encodeURIComponent(listing.brand)}` },
  ]

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-[#52525B]">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <Link href={crumb.href} className="hover:text-[#A1A1AA] transition-colors">
              {crumb.label}
            </Link>
            <ChevronRight size={13} />
          </li>
        ))}
        <li
          className="text-[#A1A1AA] truncate max-w-[220px]"
          aria-current="page"
        >
          {listing.brand} {listing.model} {listing.year}
        </li>
      </ol>
    </nav>
  )
}
