import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['it', 'en'],
  defaultLocale: 'it',
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  // 1. Eseguiamo PRIMA Next-Intl per ottenere la risposta corretta (redirect lingua o rewrite)
  const response = intlMiddleware(request)

  // 2. Creiamo il client Supabase usando la risposta di Next-Intl
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 3. Rinfreschiamo la sessione (IMPORTANTE: non blocchiamo se fallisce)
  // Questo aggiorna i cookie nella 'response' se il token è scaduto
  await supabase.auth.getUser()

  // 4. Ritorniamo la risposta originale di Next-Intl (arricchita dai cookie Supabase)
  return response
}

export const config = {
  matcher: [
    // Matcher preciso per escludere file statici e API interne
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}