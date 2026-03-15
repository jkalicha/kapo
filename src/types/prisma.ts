import { Prisma } from '@prisma/client'

export type ListingWithImages = Prisma.ListingGetPayload<{
  include: { images: true }
}>

export type ListingWithSeller = Prisma.ListingGetPayload<{
  include: {
    images: true
    seller: {
      include: { user: true }
    }
  }
}>

export type ListingCard = Prisma.ListingGetPayload<{
  include: {
    images: { take: 1; orderBy: { order: 'asc' } }
    seller: true
    _count: { select: { leads: true } }
  }
}>

export type SellerWithListings = Prisma.SellerProfileGetPayload<{
  include: {
    listings: {
      where: { status: 'ACTIVE' }
      include: { images: { take: 1 } }
    }
    user: true
  }
}>

export type LeadWithListing = Prisma.LeadGetPayload<{
  include: {
    listing: {
      include: { images: { take: 1 } }
    }
  }
}>
