'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { SellerType } from '@prisma/client'
import type { ActionResult } from '@/lib/types'

const UY_PHONE_REGEX = /^\+?598?\s?0?9?\d{7,8}$/

const privateSellerSchema = z.object({
  type: z.literal('particular'),
  name: z.string().min(2).max(100),
  phone: z.string().regex(UY_PHONE_REGEX, 'Teléfono uruguayo inválido'),
  city: z.string().min(1, 'Seleccioná una ciudad'),
  department: z.string().min(1, 'Seleccioná un departamento'),
})

const dealershipSchema = z.object({
  type: z.literal('automotora'),
  businessName: z.string().min(2).max(100),
  phone: z.string().regex(UY_PHONE_REGEX, 'Teléfono uruguayo inválido'),
  whatsapp: z.string().regex(UY_PHONE_REGEX, 'WhatsApp uruguayo inválido'),
  city: z.string().min(1, 'Seleccioná una ciudad'),
  department: z.string().min(1, 'Seleccioná un departamento'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().max(300).optional(),
})

const sellerSchema = z.discriminatedUnion('type', [privateSellerSchema, dealershipSchema])

export async function createSellerProfile(
  input: unknown,
): Promise<ActionResult<{ sellerId: string }>> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return { success: false, error: 'No estás autenticado.' }
  }

  const existing = await db.sellerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (existing) {
    return { success: false, error: 'Ya tenés un perfil de vendedor.' }
  }

  const parsed = sellerSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos.'
    return { success: false, error: firstError }
  }

  const data = parsed.data

  try {
    const result = await db.$transaction(async (tx) => {
      const profile = await tx.sellerProfile.create({
        data: {
          userId: session.user.id,
          type: data.type === 'automotora' ? SellerType.DEALERSHIP : SellerType.PRIVATE,
          businessName: data.type === 'automotora' ? data.businessName : null,
          phone: data.phone,
          whatsapp: data.type === 'automotora' ? data.whatsapp : data.phone,
          city: data.city,
          department: data.department,
          website: data.type === 'automotora' && data.website ? data.website : null,
          description: data.type === 'automotora' && data.description ? data.description : null,
        },
      })
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: 'SELLER' },
      })
      return profile
    })

    return { success: true, data: { sellerId: result.id } }
  } catch (err) {
    console.error('[createSellerProfile]', err)
    return { success: false, error: 'Error al crear el perfil. Intentá de nuevo.' }
  }
}
