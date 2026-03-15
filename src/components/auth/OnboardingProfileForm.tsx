'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createSellerProfile } from '@/lib/actions/sellers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'

const UY_PHONE_REGEX = /^\+?598?\s?0?9?\d{7,8}$/

const UY_DEPARTMENTS = [
  'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
  'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
  'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
  'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres',
]

const privateSchema = z.object({
  type: z.literal('particular'),
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  phone: z.string().regex(UY_PHONE_REGEX, 'Teléfono uruguayo inválido (ej: 099123456)'),
  city: z.string().min(1, 'Ingresá tu ciudad'),
  department: z.string().min(1, 'Seleccioná un departamento'),
})

const dealershipSchema = z.object({
  type: z.literal('automotora'),
  businessName: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  phone: z.string().regex(UY_PHONE_REGEX, 'Teléfono uruguayo inválido'),
  whatsapp: z.string().regex(UY_PHONE_REGEX, 'WhatsApp uruguayo inválido'),
  city: z.string().min(1, 'Ingresá tu ciudad'),
  department: z.string().min(1, 'Seleccioná un departamento'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
})

type PrivateValues = z.infer<typeof privateSchema>
type DealershipValues = z.infer<typeof dealershipSchema>

interface Props {
  tipo: 'particular' | 'automotora'
  userName: string
}

// ── Private seller form ────────────────────────────────────────────────────────

function PrivateForm({ userName }: { userName: string }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<PrivateValues>({
      resolver: zodResolver(privateSchema),
      defaultValues: { type: 'particular', name: userName },
    })

  const department = watch('department')

  async function onSubmit(values: PrivateValues) {
    setServerError(null)
    const result = await createSellerProfile(values)
    if (!result.success) { setServerError(result.error); return }
    router.push('/dashboard?welcome=true')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('type')} />

      <div className="space-y-1.5">
        <Label className="text-[#A1A1AA] text-sm">Nombre completo</Label>
        <Input className="bg-[#0A0A0A] border-[#27272A] text-white focus-visible:ring-[#F5A623]/50" {...register('name')} />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-[#A1A1AA] text-sm">Teléfono / WhatsApp</Label>
        <Input placeholder="099 123 456" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('phone')} />
        {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">Ciudad</Label>
          <Input placeholder="Montevideo" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('city')} />
          {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">Departamento</Label>
          <Select value={department} onValueChange={(v) => setValue('department', v)}>
            <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white focus:ring-[#F5A623]/50">
              <SelectValue placeholder="Seleccioná" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#27272A] text-white">
              {UY_DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="focus:bg-[#1A1A1A] focus:text-white">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-xs text-red-400">{errors.department.message}</p>}
        </div>
      </div>

      {serverError && (
        <Alert variant="destructive" className="border-red-900 bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold">
        {isSubmitting ? 'Creando perfil...' : 'Crear mi cuenta de vendedor'}
      </Button>
    </form>
  )
}

// ── Dealership form ────────────────────────────────────────────────────────────

function DealershipForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<DealershipValues>({
      resolver: zodResolver(dealershipSchema),
      defaultValues: { type: 'automotora' },
    })

  const department = watch('department')
  const description = watch('description', '')

  async function onSubmit(values: DealershipValues) {
    setServerError(null)
    const result = await createSellerProfile(values)
    if (!result.success) { setServerError(result.error); return }
    router.push('/dashboard?welcome=true')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('type')} />

      <div className="space-y-1.5">
        <Label className="text-[#A1A1AA] text-sm">Nombre de la automotora</Label>
        <Input placeholder="Autos del Sur SRL" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('businessName')} />
        {errors.businessName && <p className="text-xs text-red-400">{errors.businessName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">Teléfono principal</Label>
          <Input placeholder="099 123 456" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('phone')} />
          {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">WhatsApp de contacto</Label>
          <Input placeholder="099 123 456" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('whatsapp')} />
          {errors.whatsapp && <p className="text-xs text-red-400">{errors.whatsapp.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">Ciudad</Label>
          <Input placeholder="Montevideo" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('city')} />
          {errors.city && <p className="text-xs text-red-400">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-[#A1A1AA] text-sm">Departamento</Label>
          <Select value={department} onValueChange={(v) => setValue('department', v)}>
            <SelectTrigger className="bg-[#0A0A0A] border-[#27272A] text-white focus:ring-[#F5A623]/50">
              <SelectValue placeholder="Seleccioná" />
            </SelectTrigger>
            <SelectContent className="bg-[#111111] border-[#27272A] text-white">
              {UY_DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="focus:bg-[#1A1A1A] focus:text-white">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && <p className="text-xs text-red-400">{errors.department.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[#A1A1AA] text-sm">Sitio web <span className="text-[#52525B]">(opcional)</span></Label>
        <Input type="url" placeholder="https://miauto.com.uy" className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50" {...register('website')} />
        {errors.website && <p className="text-xs text-red-400">{errors.website.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label className="text-[#A1A1AA] text-sm">Descripción <span className="text-[#52525B]">(opcional)</span></Label>
          <span className="text-xs text-[#52525B]">{(description ?? '').length}/300</span>
        </div>
        <Textarea
          placeholder="Contá un poco sobre tu automotora..."
          className="bg-[#0A0A0A] border-[#27272A] text-white placeholder:text-[#52525B] focus-visible:ring-[#F5A623]/50 resize-none"
          rows={3}
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      </div>

      {serverError && (
        <Alert variant="destructive" className="border-red-900 bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#F5A623] hover:bg-[#E09415] text-black font-semibold">
        {isSubmitting ? 'Creando perfil...' : 'Crear mi cuenta de vendedor'}
      </Button>
    </form>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────

export function OnboardingProfileForm({ tipo, userName }: Props) {
  return (
    <div className="space-y-8">
      {/* Steps */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-[#F5A623] flex items-center justify-center text-[#F5A623] text-xs">✓</div>
          <span className="text-sm text-[#A1A1AA]">Tipo de cuenta</span>
        </div>
        <div className="w-8 h-px bg-[#27272A]" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#F5A623] flex items-center justify-center text-black text-xs font-bold">2</div>
          <span className="text-sm text-white font-medium">Tu perfil</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">
          {tipo === 'automotora' ? 'Datos de tu automotora' : 'Tu información de contacto'}
        </h1>
        <p className="text-[#A1A1AA] mt-2">
          {tipo === 'automotora'
            ? 'Estos datos aparecerán en tus publicaciones'
            : 'Los compradores te contactarán a través de estos datos'}
        </p>
      </div>

      <div className="bg-[#111111] border border-[#27272A] rounded-xl p-6">
        {tipo === 'particular' ? (
          <PrivateForm userName={userName} />
        ) : (
          <DealershipForm />
        )}
      </div>
    </div>
  )
}
