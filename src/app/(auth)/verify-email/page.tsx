import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export const metadata = { title: 'Verificá tu email — Kapo' }

export default function VerifyEmailPage() {
  return (
    <div className="text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-[#F5A623]/10 flex items-center justify-center mx-auto">
        <Mail className="w-7 h-7 text-[#F5A623]" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white">Revisá tu email</h1>
        <p className="text-[#A1A1AA] text-sm mt-2">
          Te enviamos un link de verificación. Hacé clic en el email para activar tu cuenta.
        </p>
      </div>
      <Button asChild variant="outline" className="border-[#27272A] text-white hover:bg-[#1A1A1A] w-full">
        <Link href="/sign-in">Volver al inicio de sesión</Link>
      </Button>
    </div>
  )
}
