import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { createClient } from '@/utils/supabase/server'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import PwaInstallPrompt from '@/components/PwaInstallPrompt'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

// 3. CONFIGURAZIONE VIEWPORT PWA (Step 4)
export const viewport: Viewport = {
  themeColor: '#f97316', // Arancione CapLog
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Disabilita zoom per feeling app nativa
}

// 4. METADATA BASE PWA
export const metadata: Metadata = {
  title: "CapLog Training",
  description: "Training System",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CapLog",
  },
}

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

  const cookieStore = await cookies()
  const activeRole = cookieStore.get('caplog_active_role')?.value || profile?.role || 'athlete'

  return (
    <html lang={locale} suppressHydrationWarning data-role={activeRole}>
      <body className={`${inter.variable} ${oswald.variable} font-sans bg-background text-foreground antialiased`}>
        
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              
              {user && profile && (
                <Header 
                  user={user} 
                  profile={profile} 
                  activeRole={activeRole} 
                  locale={locale} 
                />
              )}

              <main className={user ? "pt-20 pb-24" : ""}>
                {children}
              </main>

              {/* 5. Componente Prompt Installazione PWA */}
              <PwaInstallPrompt />

              {user && profile && (
                <BottomNav role={activeRole} locale={locale} />
              )}

            </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}