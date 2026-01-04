import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ReportForm from '@/components/ReportForm'

// 1. Definisci params come Promise
export default async function ReportPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  // 2. Await dei params
  const { locale, id } = await params;
  
  const t = await getTranslations('Report');
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  // Fetch Workout con Sport collegato
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

  if (!workout) return <div className="p-10 text-center">Allenamento non trovato</div>

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