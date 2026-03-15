import { FuelType, ListingStatus, Transmission } from '@prisma/client'
import { db } from '@/lib/db'
import type { ListingCard, ListingWithImages, ListingWithSeller } from '@/types/prisma'

export type Orden = 'reciente' | 'precio_asc' | 'precio_desc' | 'km_asc'

export interface ListingFilters {
  brand?: string
  model?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  fuel?: FuelType
  transmission?: Transmission
  city?: string
  featured?: boolean
  acceptsTrade?: boolean
  hasFinancing?: boolean
  orden?: Orden
  page?: number
  pageSize?: number
}

interface PaginatedListings {
  listings: ListingCard[]
  total: number
  pages: number
}

const orderByMap: Record<Orden, object> = {
  reciente:    { createdAt: 'desc' as const },
  precio_asc:  { price: 'asc' as const },
  precio_desc: { price: 'desc' as const },
  km_asc:      { km: 'asc' as const },
}

export async function getListings(filters: ListingFilters = {}): Promise<PaginatedListings> {
  const {
    brand,
    model,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    fuel,
    transmission,
    city,
    featured,
    acceptsTrade,
    hasFinancing,
    orden,
    page = 1,
    pageSize = 12,
  } = filters

  try {
    const priceFilter: { gte?: number; lte?: number } = {}
    if (minPrice !== undefined) priceFilter.gte = minPrice
    if (maxPrice !== undefined) priceFilter.lte = maxPrice

    const yearFilter: { gte?: number; lte?: number } = {}
    if (minYear !== undefined) yearFilter.gte = minYear
    if (maxYear !== undefined) yearFilter.lte = maxYear

    const where = {
      status: ListingStatus.ACTIVE,
      ...(brand && { brand: { contains: brand, mode: 'insensitive' as const } }),
      ...(model && { model: { contains: model, mode: 'insensitive' as const } }),
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
      ...(Object.keys(yearFilter).length > 0 && { year: yearFilter }),
      ...(fuel && { fuel }),
      ...(transmission && { transmission }),
      ...(city && { city: { equals: city, mode: 'insensitive' as const } }),
      ...(featured !== undefined && { featured }),
      ...(acceptsTrade !== undefined && { acceptsTrade }),
      ...(hasFinancing !== undefined && { hasFinancing }),
    }

    const orderBy = orden
      ? orderByMap[orden]
      : [{ featured: 'desc' as const }, { createdAt: 'desc' as const }]

    const [listings, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          images: { take: 1, orderBy: { order: 'asc' } },
          seller: true,
          _count: { select: { leads: true } },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.listing.count({ where }),
    ])

    return {
      listings: listings as ListingCard[],
      total,
      pages: Math.ceil(total / pageSize),
    }
  } catch (err) {
    console.error('[getListings] error:', err)
    return { listings: [], total: 0, pages: 0 }
  }
}

export async function getListingById(id: string): Promise<ListingWithSeller | null> {
  try {
    const listing = await db.listing.findUnique({
      where: { id, status: ListingStatus.ACTIVE },
      include: {
        images: true,
        seller: { include: { user: true } },
      },
    })
    return listing
  } catch (err) {
    console.error('[getListingById] error:', err)
    return null
  }
}

export async function getFeaturedListings(limit = 6): Promise<ListingCard[]> {
  try {
    const listings = await db.listing.findMany({
      where: { status: ListingStatus.ACTIVE, featured: true },
      include: {
        images: { take: 1, orderBy: { order: 'asc' } },
        seller: true,
        _count: { select: { leads: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return listings as ListingCard[]
  } catch (err) {
    console.error('[getFeaturedListings] error:', err)
    return []
  }
}

export async function getListingsBySeller(sellerId: string): Promise<ListingWithImages[]> {
  try {
    const listings = await db.listing.findMany({
      where: { sellerId, status: ListingStatus.ACTIVE },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    })
    return listings
  } catch (err) {
    console.error('[getListingsBySeller] error:', err)
    return []
  }
}
