import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Send } from 'lucide-react'

// Server Action inline per semplicità (o spostala in auth-actions.ts)
async function requestReset(formData: FormData) {
  'use server'
  const email = formData.get('email') as string
  const locale = formData.get('locale') as string
  const supabase = await createClient()
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/${locale}/auth/update-password`,
  })
  
  redirect(`/${locale}/login?message=check_email`)
}

export default function ForgotPassword({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl border border-border shadow-lg">
        <h1 className="text-2xl font-bold font-oswald uppercase mb-2">Recupero Accesso</h1>
        <p className="text-sm text-muted-foreground mb-6">Inserisci la tua email. Ti invieremo un link magico per reimpostare la password.</p>
        
        <form action={requestReset} className="space-y-4">
          <input type="hidden" name="locale" value={params.locale} />
          <div>
             <input 
               name="email" 
               type="email" 
               placeholder="Tua Email" 
               required 
               className="w-full bg-background p-4 rounded-xl border border-input focus:ring-2 focus:ring-primary outline-none"
             />
          </div>
          <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 uppercase">
            <Send size={18} /> Invia Link
          </button>
        </form>
      </div>
    </div>
  )
}