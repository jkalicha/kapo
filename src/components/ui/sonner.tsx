'use client'

import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      richColors
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1A1A1A',
          border: '1px solid #27272A',
          color: '#fff',
        },
      }}
      {...props}
    />
  )
}
