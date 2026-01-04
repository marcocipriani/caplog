import { type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { updateSession } from '@/utils/supabase/middleware'

const intlMiddleware = createMiddleware({
  locales: ['it', 'en'],
  defaultLocale: 'it',
  localePrefix: 'always' // Forza sempre /it o /en
})

export async function middleware(request: NextRequest) {
  // 1. Prima eseguiamo la logica di Next-Intl per ottenere la risposta corretta (coi redirect lingua)
  const response = intlMiddleware(request)

  // 2. Poi passiamo quella risposta a Supabase per gestire i cookie della sessione
  return await updateSession(request, response)
}

export const config = {
  matcher: [
    // Applica a tutte le rotte TRANNE file statici, immagini, api, favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}