import { db } from '@/lib/db'
import type { SellerProfile } from '@prisma/client'
import type { SellerWithListings } from '@/types/prisma'

export async function getSellerById(id: string): Promise<SellerWithListings | null> {
  try {
    const seller = await db.sellerProfile.findUnique({
      where: { id },
      include: {
        listings: {
          where: { status: 'ACTIVE' },
          include: { images: { take: 1 } },
        },
        user: true,
      },
    })
    return seller
  } catch (err) {
    console.error('[getSellerById] error:', err)
    return null
  }
}

export async function getVerifiedDealerships(): Promise<SellerProfile[]> {
  try {
    const sellers = await db.sellerProfile.findMany({
      where: { verified: true, type: 'DEALERSHIP' },
      orderBy: { createdAt: 'desc' },
    })
    return sellers
  } catch (err) {
    console.error('[getVerifiedDealerships] error:', err)
    return []
  }
}
