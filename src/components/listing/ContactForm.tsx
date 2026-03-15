'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, MessageSquare } from 'lucide-react'
import { createLead } from '@/lib/actions/leads'

const UY_PHONE_REGEX =
  /^(\+598\s?)?((09[1-9])[\s-]?\d{3}[\s-]?\d{3}|(2|4\d{2})[\s-]?\d{3,4}[\s-]?\d{3,4})$/

const schema = z.object({
  buyerName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  buyerPhone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .regex(UY_PHONE_REGEX, 'Ingresá un teléfono válido (ej: 099 123 456)'),
  buyerEmail: z.string().max(200).optional(),
  message: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  listingId: string
}

const inputClass =
  'w-full bg-[#0A0A0A] border border-[#27272A] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#52525B] focus:outline-none focus:border-[#F5A623]/50 transition-colors'

const errorClass = 'mt-1 text-xs text-red-400'

export function ContactForm({ listingId }: Props) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      buyerName: '',
      buyerPhone: '',
      buyerEmail: '',
      message: '¡Hola, me interesa el auto. ¿Está disponible?',
    },
  })

  const onSubmit = async (data: FormData) => {
    const result = await createLead({ listingId, ...data })
    if (result.success) {
      setSubmitted(true)
    } else {
      toast.error(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="bg-[#111111] border border-green-700/40 rounded-xl p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <h3 className="font-bold text-white text-lg mb-1">¡Consulta enviada!</h3>
        <p className="text-[#A1A1AA] text-sm">El vendedor recibirá tu contacto en breve.</p>
        <p className="text-[#A1A1AA] text-sm mt-1">Solemos responder en menos de 2 horas.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#27272A] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare size={18} className="text-[#F5A623]" />
        <h3 className="font-semibold text-white">Consultá al vendedor</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* Nombre */}
        <div>
          <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">
            Nombre completo <span className="text-red-400">*</span>
          </label>
          <input
            {...register('buyerName')}
            type="text"
            placeholder="Tu nombre"
            className={inputClass}
            autoComplete="name"
          />
          {errors.buyerName && (
            <p className={errorClass}>{errors.buyerName.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">
            Teléfono <span className="text-red-400">*</span>
          </label>
          <input
            {...register('buyerPhone')}
            type="tel"
            placeholder="099 123 456"
            className={inputClass}
            autoComplete="tel"
          />
          {errors.buyerPhone && (
            <p className={errorClass}>{errors.buyerPhone.message}</p>
          )}
        </div>

        {/* Email (optional) */}
        <div>
          <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">
            Email{' '}
            <span className="text-[#52525B] font-normal">(opcional)</span>
          </label>
          <input
            {...register('buyerEmail')}
            type="email"
            placeholder="tu@email.com"
            className={inputClass}
            autoComplete="email"
          />
          {errors.buyerEmail && (
            <p className={errorClass}>{errors.buyerEmail.message}</p>
          )}
        </div>

        {/* Mensaje (optional) */}
        <div>
          <label className="text-xs font-medium text-[#A1A1AA] mb-1.5 block">
            Mensaje{' '}
            <span className="text-[#52525B] font-normal">(opcional)</span>
          </label>
          <textarea
            {...register('message')}
            rows={3}
            placeholder="¡Hola, me interesa el auto. ¿Está disponible?"
            className={`${inputClass} resize-none`}
          />
          {errors.message && (
            <p className={errorClass}>{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#F5A623] text-black font-bold py-3 rounded-lg hover:bg-[#E09610] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando…
            </>
          ) : (
            'Enviar consulta'
          )}
        </button>

        <p className="text-xs text-[#52525B] text-center">
          Tu teléfono solo será compartido con el vendedor
        </p>
      </form>
    </div>
  )
}
