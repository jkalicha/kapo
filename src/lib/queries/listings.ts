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
  sellerId?: string
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
    sellerId,
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
      ...(sellerId && { sellerId }),
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
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        seller: { include: { user: true } },
      },
    })
    // Only surface ACTIVE or SOLD listings publicly
    if (!listing) return null
    if (listing.status !== 'ACTIVE' && listing.status !== 'SOLD') return null
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

export async function getSimilarListings(
  listingId: string,
  brand: string,
  price: number,
  limit = 4,
): Promise<ListingCard[]> {
  try {
    const listings = await db.listing.findMany({
      where: {
        status: ListingStatus.ACTIVE,
        id: { not: listingId },
        OR: [
          { brand: { equals: brand, mode: 'insensitive' as const } },
          {
            price: {
              gte: Math.floor(price * 0.75),
              lte: Math.ceil(price * 1.25),
            },
          },
        ],
      },
      include: {
        images: { take: 1, orderBy: { order: 'asc' } },
        seller: true,
        _count: { select: { leads: true } },
      },
      orderBy: [{ featured: 'desc' as const }, { createdAt: 'desc' as const }],
      take: limit,
    })
    return listings as ListingCard[]
  } catch (err) {
    console.error('[getSimilarListings] error:', err)
    return []
  }
}
