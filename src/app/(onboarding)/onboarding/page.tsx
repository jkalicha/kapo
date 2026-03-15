import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { OnboardingTypeSelector } from '@/components/auth/OnboardingTypeSelector'

export const metadata = { title: 'Configurá tu cuenta — Kapo' }

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const existing = await db.sellerProfile.findUnique({
    where: { userId: session.user.id },
  })
  if (existing) redirect('/dashboard')

  return <OnboardingTypeSelector />
}
