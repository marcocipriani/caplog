import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AthleteDashboard from '@/components/dashboard/AthleteDashboard'
import CoachDashboard from '@/components/dashboard/CoachDashboard'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
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

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="p-4 max-w-lg mx-auto space-y-6">
        {profile?.role === 'coach' ? (
          <CoachDashboard user={user} profile={profile} locale={locale} />
        ) : (
          <AthleteDashboard user={user} profile={profile} locale={locale} />
        )}
      </div>
    </div>
  )
}