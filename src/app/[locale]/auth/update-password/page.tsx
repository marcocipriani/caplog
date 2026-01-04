import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function updatePassword(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  const locale = formData.get('locale') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (!error) {
    redirect(`/${locale}/?message=password_updated`)
  }
}

// CORREZIONE QUI: params è Promise<{ locale: string }>
export default async function UpdatePasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params // Await dei parametri
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl border border-border shadow-lg">
        <h1 className="text-2xl font-bold font-oswald uppercase mb-6">Nuova Password</h1>
        
        <form action={updatePassword} className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <input 
            name="password" 
            type="password" 
            placeholder="Digita nuova password" 
            required 
            minLength={6}
            className="w-full bg-background p-4 rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none"
          />
          <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl uppercase">
            Salva Nuova Password
          </button>
        </form>
      </div>
    </div>
  )
}