import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

interface Props {
  searchParams: Promise<{ welcome?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center space-y-4">
        {params.welcome === 'true' && (
          <p className="text-[#F5A623] text-sm font-medium">
            ¡Bienvenido a Kapo! Tu cuenta está lista.
          </p>
        )}
        <h1 className="text-white text-2xl font-bold">
          Hola, {session.user.name} 👋
        </h1>
        <p className="text-[#A1A1AA]">El panel de vendedor está en construcción.</p>
      </div>
    </div>
  )
}
