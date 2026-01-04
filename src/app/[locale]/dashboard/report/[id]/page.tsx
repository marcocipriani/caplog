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

  // Fetch Workout con Sport collegato per avere icone e colori
  const { data: workout } = await supabase
    .from('workouts')
    .select('*, sports(*)')
    .eq('id', id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch Scarpe attive dell'atleta
  const { data: shoes } = await supabase
    .from('shoes')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('brand', { ascending: true })

  if (!workout) return <div>Allenamento non trovato</div>

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="p-4 max-w-xl mx-auto">
        <ReportForm 
          workout={workout} 
          shoes={shoes || []} 
          locale={locale} 
        />
      </div>
    </div>
  )
}