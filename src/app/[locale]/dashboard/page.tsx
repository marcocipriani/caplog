import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AthleteDashboard from '@/components/dashboard/AthleteDashboard'
import CoachDashboard from '@/components/dashboard/CoachDashboard'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  // 1. Verifica Utente
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/login`)
  }

  // 2. Prendi Profilo
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Routing basato su ruolo
  if (profile?.role === 'coach') {
    // redirect(`/${locale}/dashboard/coach`)
    return <CoachDashboard user={user} profile={profile} locale={locale} />
  } else {
    // Atleta
    return <AthleteDashboard user={user} profile={profile} locale={locale} />
  }
}