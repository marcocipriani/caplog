import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import { getTranslations } from 'next-intl/server'
import { User, Shield, Zap, TrendingUp, Calendar } from 'lucide-react'
import { switchUserRole } from '@/actions/user-actions'

export default async function ProfilePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations('Profile');
  const tRole = await getTranslations('Role');

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const currentRole = profile?.role || 'athlete'

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      <Header 
        title={t('title')}
        user={user}
        profile={profile}
      />

      <div className="p-4 space-y-6">
        
        {/* CARD INFO */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <User size={100} />
          </div>
          
          <h2 className="text-primary font-bold text-xs uppercase mb-4 flex items-center gap-2">
            <Shield size={14} /> {t('personal_info')}
          </h2>

          <div className="space-y-4 relative z-10">
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-bold">{t('full_name')}</label>
              <p className="text-lg font-bold font-oswald">{profile?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase text-muted-foreground font-bold">{t('email')}</label>
              <p className="text-sm font-mono text-foreground/80">{user.email}</p>
            </div>
            <div>
               <label className="text-[10px] uppercase text-muted-foreground font-bold">{t('since')}</label>
               <p className="text-sm text-foreground/80 flex items-center gap-2">
                 <Calendar size={14} />
                 {new Date(user.created_at).toLocaleDateString()}
               </p>
            </div>
          </div>
        </div>

        {/* ROLE SWITCH */}
        <div className="bg-secondary/20 border border-primary/20 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-4">
             <div>
                <h2 className="text-primary font-bold text-xs uppercase flex items-center gap-2">
                  <Zap size={14} /> {t('current_role')}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  {t('role_switch_desc')}
                </p>
             </div>
             <span className={`px-3 py-1 rounded text-xs font-black uppercase ${currentRole === 'coach' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
               {tRole(currentRole)}
             </span>
          </div>

          <form action={async () => {
            'use server'
            const newRole = currentRole === 'athlete' ? 'coach' : 'athlete'
            await switchUserRole(user.id, newRole)
          }} className="mt-4">
            <button 
              type="submit"
              className="w-full py-3 bg-card hover:bg-secondary border-2 border-dashed border-border hover:border-primary text-foreground font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 uppercase"
            >
              {currentRole === 'athlete' ? t('coach_mode') : t('athlete_mode')}
            </button>
          </form>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <TrendingUp className="text-green-500 mb-2" size={24} />
             <span className="text-3xl font-black font-oswald">12</span>
             <span className="text-[10px] text-muted-foreground uppercase">{t('workouts_completed')}</span>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <Zap className="text-yellow-500 mb-2" size={24} />
             <span className="text-3xl font-black font-oswald">85%</span>
             <span className="text-[10px] text-muted-foreground uppercase">{t('completion_rate')}</span>
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}