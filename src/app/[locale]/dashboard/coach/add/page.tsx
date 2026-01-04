import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import CreateWorkoutForm from '@/components/CreateWorkoutForm'

// 1. Definisci params come Promise
export default async function NewMissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; // Await dei params
  const t = await getTranslations('Coach');

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'coach') {
    return <div className="p-10 text-center">Accesso Negato. Non sei autorizzato a impartire ordini.</div>
  }

  // 1. Recuperiamo tutti gli Atleti
  const { data: athletes } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'athlete')
  
  // Fallback se non ci sono atleti
  const athleteList = athletes && athletes.length > 0 
    ? athletes 
    : [{ id: user.id, full_name: 'Me Stesso (Test)', email: user.email }]

  // 2. Recuperiamo gli Sport
  const { data: sports } = await supabase
    .from('sports')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Titolo Pagina (Opzionale, visto che l'header ha il titolo dinamico, ma utile per contesto) */}
      <div className="p-4 max-w-lg mx-auto">
         <h1 className="text-2xl font-bold font-oswald uppercase mb-6 flex items-center gap-2">
            {t('create_title')}
         </h1>

         <CreateWorkoutForm 
            athletes={athleteList} 
            sports={sports || []} 
            locale={locale} 
            coachId={user.id}
         />
      </div>
    </div>
  )
}