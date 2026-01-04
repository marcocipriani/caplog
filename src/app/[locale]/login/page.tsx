import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

async function signIn(formData: FormData) {
  'use server'
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const locale = formData.get('locale') as string
  
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/${locale}/login?message=Could not authenticate user`)
  }

  return redirect(`/${locale}`)
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('Auth')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    redirect(`/${locale}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-oswald uppercase tracking-wide">CAPLOG</h1>
          <p className="text-sm text-muted-foreground mt-2">Training System</p>
        </div>

        <form action={signIn} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Email</label>
            <input
              name="email"
              type="email"
              placeholder="user@example.com"
              required
              className="w-full bg-background p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full bg-background p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl uppercase hover:opacity-90 transition-opacity mt-4"
          >
            Entra nel Sistema
          </button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
             Problemi di accesso? Contatta il tuo Coach.
          </p>
        </form>
      </div>
    </div>
  )
}