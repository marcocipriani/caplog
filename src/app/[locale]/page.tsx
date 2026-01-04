import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AthleteDashboard from '@/components/dashboard/AthleteDashboard'
import CoachDashboard from '@/components/dashboard/CoachDashboard'

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const supabase = await createClient()

  // 1. Controllo Autenticazione
  const { data: { user } } = await supabase.auth.getUser()
  
  // Se non sei loggato, vai al login
  if (!user) {
    redirect(`/${locale}/login`)
  }

  // 2. Recupero Profilo per capire il Ruolo
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Routing condizionale basato sul ruolo
  if (profile?.role === 'coach') {
    return <CoachDashboard user={user} profile={profile} locale={locale} />
  } else {
    return <AthleteDashboard user={user} profile={profile} locale={locale} />
  }
}