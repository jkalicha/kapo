import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Recuperar contraseña — Kapo' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Recuperar contraseña</h1>
        <p className="text-[#A1A1AA] text-sm">Esta función está en construcción.</p>
        <Button asChild variant="outline" className="border-[#27272A] text-white hover:bg-[#1A1A1A]">
          <Link href="/sign-in">← Volver al inicio de sesión</Link>
        </Button>
      </div>
    </div>
  )
}
