'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { sanitizeMessage } from '@/lib/utils/sanitize'
import type { ActionResult } from '@/lib/types'

const UY_PHONE_REGEX =
  /^(\+598\s?)?((09[1-9])[\s-]?\d{3}[\s-]?\d{3}|(2|4\d{2})[\s-]?\d{3,4}[\s-]?\d{3,4})$/

const leadSchema = z.object({
  listingId: z.string().min(1),
  buyerName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  buyerPhone: z
    .string()
    .regex(UY_PHONE_REGEX, 'Ingresá un teléfono uruguayo válido (ej: 099 123 456)'),
  buyerEmail: z.string().max(200).optional(),
  message: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export async function createLead(
  input: unknown,
): Promise<ActionResult<{ leadId: string }>> {
  // 1. Validate with Zod
  const parsed = leadSchema.safeParse(input)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? 'Datos inválidos'
    return { success: false, error: firstError }
  }

  const { listingId, buyerName, buyerPhone, buyerEmail, message } = parsed.data

  try {
    // 2. Fetch listing to get sellerId
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true, status: true },
    })
    if (!listing) return { success: false, error: 'Publicación no encontrada' }
    if (listing.status !== 'ACTIVE') {
      return { success: false, error: 'Esta publicación no está activa' }
    }

    // 3. Sanitize message
    const rawMessage = message ?? ''
    const sanitizedText = sanitizeMessage(rawMessage)
    const wasSanitized = sanitizedText !== rawMessage

    // 4. Duplicate prevention: same phone + listingId in last 24 h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existing = await db.lead.findFirst({
      where: { listingId, buyerPhone, createdAt: { gte: oneDayAgo } },
      select: { id: true },
    })
    if (existing) {
      // Silent success — don't reveal it's a duplicate
      return { success: true, data: { leadId: existing.id } }
    }

    // 5. Create lead
    const lead = await db.lead.create({
      data: {
        listingId,
        sellerId: listing.sellerId,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        buyerEmail: buyerEmail?.trim() || null,
        message: sanitizedText || null,
        sanitized: wasSanitized,
      },
      select: { id: true },
    })

    // 6. TODO: Send notification email to seller

    return { success: true, data: { leadId: lead.id } }
  } catch (err) {
    console.error('[createLead] error:', err)
    return { success: false, error: 'Hubo un error al enviar tu consulta. Intentá de nuevo.' }
  }
}
