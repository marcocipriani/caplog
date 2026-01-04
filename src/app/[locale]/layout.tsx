import '@/app/globals.css'
import { Inter, Oswald } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { createClient } from '@/utils/supabase/server'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { use } from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages()
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profile = data
  }

  return (
    // 2. AGGIUNGI suppressHydrationWarning QUI SOTTO
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${oswald.variable} font-sans bg-background text-foreground antialiased`}>
        
        {/* 3. AVVOLGI TUTTO NEL THEME PROVIDER */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              
              {user && profile && (
                <Header user={user} profile={profile} />
              )}

              <main className={user ? "pt-20 pb-24" : ""}>
                {children}
              </main>

              {user && profile && (
                <BottomNav role={profile.role} locale={locale} />
              )}

            </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}