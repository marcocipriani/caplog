import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import { getTranslations } from 'next-intl/server'
import ReportForm from '@/components/ReportForm'

export default async function ReportPage({ params }: { params: { locale: string, id: string } }) {
  const { locale, id } = await params;
  const t = await getTranslations('Report');
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: workout } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!workout) return <div>Allenamento non trovato</div>

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      <Header 
        title={t('title')} 
        subtitle={workout.title}
        user={user}
        profile={profile}
      />

      <div className="p-4 max-w-lg mx-auto">
        <ReportForm workoutId={id} locale={locale} />
      </div>
    </div>
  )
}