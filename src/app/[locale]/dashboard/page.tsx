import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

const formatDate = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  })
}

export default async function Dashboard({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations('Dashboard');

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

  const today = new Date().toISOString().split('T')[0]
  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, sports(*)')
    .eq('athlete_id', user.id)
    .eq('scheduled_date', today)
    .single()

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      <Header 
        title={profile?.full_name || user.email?.split('@')[0] || 'Recluta'}
        subtitle={t('welcome')}
        user={user}
        profile={profile}
      />

      <div className="px-4 mt-6">
        <h3 className="text-primary font-bold text-xs uppercase mb-3 flex items-center gap-2">
          <Clock size={14} /> {t('mission')}
        </h3>

        {workouts ? (
          <div className="bg-card text-card-foreground rounded-2xl p-5 border-l-4 shadow-lg relative overflow-hidden transition-all" 
               style={{ borderLeftColor: workouts.sports?.color_hex || '#FF5722' }}>
            
            <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded bg-secondary text-secondary-foreground uppercase tracking-wider">
              {workouts.sports?.name}
            </span>

            <div className="mb-4 pr-16">
              <p className="text-muted-foreground text-sm capitalize">{formatDate(workouts.scheduled_date, locale)}</p>
              <h2 className="text-2xl font-bold mt-1 leading-tight font-oswald">{workouts.title}</h2>
            </div>

            <div className="bg-secondary/50 p-4 rounded-xl mb-4 text-sm text-foreground/90 leading-relaxed border border-border/50">
              <span className="text-primary font-bold text-xs uppercase block mb-1">{t('orders')}:</span>
              {workouts.planned_description}
            </div>

            {workouts.coach_notes && (
              <div className="flex gap-2 items-start text-xs text-muted-foreground italic mb-6 bg-background/50 p-2 rounded lg">
                <AlertCircle size={14} className="shrink-0 mt-0.5 text-primary" />
                <p>"{workouts.coach_notes}"</p>
              </div>
            )}

            {workouts.status === 'completed' ? (
  <div className="w-full py-4 bg-green-600/20 border border-green-600/50 text-green-500 font-bold rounded-xl flex items-center justify-center gap-2 uppercase text-sm">
    <CheckCircle2 size={20} />
    Missione Compiuta
  </div>
) : (
  <Link 
    href={`/${locale}/dashboard/report/${workouts.id}`}
    className="w-full py-4 bg-primary hover:bg-orange-600 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-500/20 uppercase text-sm"
  >
    <CheckCircle2 size={20} />
    {t('report_btn')}
  </Link>
)}

          </div>
        ) : (
          <div className="bg-secondary/30 rounded-2xl p-8 border-2 border-dashed border-border text-center">
            <p className="text-muted-foreground mb-2">{t('no_mission')}</p>
            <p className="text-sm font-medium italic">"{t('rest_quote')}" - Cap</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}