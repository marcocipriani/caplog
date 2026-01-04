import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AthleteDashboard from '@/components/dashboard/AthleteDashboard'
import CoachDashboard from '@/components/dashboard/CoachDashboard'

// Aggiornata la firma per supportare params asincroni
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params // Await params
  
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

  if (profile?.role === 'coach') {
    return <CoachDashboard user={user} profile={profile} locale={locale} />
  } else {
    return <AthleteDashboard user={user} profile={profile} locale={locale} />
  }
}