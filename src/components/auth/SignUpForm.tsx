'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type SignUpValues = z.infer<typeof signUpSchema>

function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | null {
  if (!password) return null
  const hasLetters = /[a-zA-Z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)
  if (password.length < 8 || !hasLetters) return 'weak'
  if (hasLetters && hasNumbers && hasSpecial) return 'strong'
  if (hasLetters && hasNumbers) return 'medium'
  return 'weak'
}

const strengthConfig = {
  weak:   { label: 'Débil',   color: 'bg-red-500',   segments: 1 },
  medium: { label: 'Media',   color: 'bg-[#F5A623]', segments: 2 },
  strong: { label: 'Fuerte',  color: 'bg-green-500', segments: 3 },
}

export function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) })

  const passwordValue = watch('password', '')
  const strength = getPasswordStrength(passwordValue)

  async function onSubmit(values: SignUpValues) {
    setError(null)
    const { error: authError } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: '/dashboard',
    })
    if (authError) {
      setError('No se pudo crear la cuenta. Verificá los datos e intentá de nuevo.')
      return
    }
    router.push('/dashboard')
  }

  async function handleGoogle() {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Crear cuenta</h1>
        <p className="text-[#A1A1AA] text-sm mt-1">Empezá a usar Kapo gratis</p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-900 bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-[#A1A1AA] text-sm">Nombre completo</Label>
          <Input
            id="name"
            placeholder="Juan García"
            className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[#A1A1AA] text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@ejemplo.com"
            className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[#A1A1AA] text-sm">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Strength indicator */}
          {strength && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3].map((seg) => (
                  <div
                    key={seg}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      seg <= strengthConfig[strength].segments
                        ? strengthConfig[strength].color
                        : 'bg-[#27272A]'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-[#A1A1AA]">
                Contraseña <span className={strength === 'strong' ? 'text-green-400' : strength === 'medium' ? 'text-[#F5A623]' : 'text-red-400'}>{strengthConfig[strength].label}</span>
              </p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-[#A1A1AA] text-sm">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repetí tu contraseña"
              className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50 pr-10"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA]"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#27272A]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-[#111111] text-[#52525B]">o continuá con</span>
        </div>
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-[#27272A] text-white hover:bg-[#1A1A1A] hover:text-white gap-2"
        onClick={handleGoogle}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continuar con Google
      </Button>

      <p className="text-center text-sm text-[#A1A1AA]">
        ¿Ya tenés cuenta?{' '}
        <Link href="/sign-in" className="text-[#F5A623] hover:underline font-medium">
          Iniciar sesión →
        </Link>
      </p>
    </div>
  )
}
