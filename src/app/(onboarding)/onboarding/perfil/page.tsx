import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { OnboardingProfileForm } from '@/components/auth/OnboardingProfileForm'

export const metadata = { title: 'Tu perfil — Kapo' }

interface Props {
  searchParams: Promise<{ tipo?: string }>
}

export default async function OnboardingPerfilPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const params = await searchParams
  const tipo = params.tipo

  if (tipo !== 'particular' && tipo !== 'automotora') {
    redirect('/onboarding')
  }

  return (
    <OnboardingProfileForm
      tipo={tipo}
      userName={session.user.name ?? ''}
    />
  )
}
