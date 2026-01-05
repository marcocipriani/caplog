import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { LogOut } from 'lucide-react'
import { signOutAction } from '@/actions/coach-actions'
import ProfileManager from '@/components/profile/ProfileManager'
import RoleManager from '@/components/profile/RoleManager'

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('Profile')
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const cookieStore = await cookies()
  const activeRole = cookieStore.get('caplog_active_role')?.value || 'athlete'

  return (
    <div className="max-w-xl mx-auto p-4 pb-24 space-y-6">
      
      <ProfileManager 
        user={user} 
        profile={profile} 
        activeRole={activeRole} 
        locale={locale} 
      />

      {profile?.role !== 'coach' && profile?.role !== 'manager' && (
        <RoleManager userId={user.id} />
      )}

      <div className="pt-8 border-t border-border">
          <form action={signOutAction}>
            <button 
                type="submit"
                className="w-full bg-secondary/50 hover:bg-red-500/10 hover:text-red-600 text-muted-foreground p-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-xs transition-colors"
            >
                <LogOut size={16} /> Disconnessione Sicura
            </button>
          </form>
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-30 mt-4">
            CapLog System v1.3
          </p>
      </div>
    </div>
  )
}