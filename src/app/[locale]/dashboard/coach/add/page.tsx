import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import { getTranslations } from 'next-intl/server'
import CreateWorkoutForm from '@/components/CreateWorkoutForm'

export default async function NewMissionPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations('Coach');

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  // Controllo sicurezza: Profilo e Ruolo
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'coach') {
    return <div className="p-10 text-center">Accesso Negato. Non sei autorizzato a impartire ordini.</div>
  }

  // 1. Recuperiamo tutti gli Atleti
  // (In un'app reale prenderemmo solo quelli assegnati a questo coach, qui prendiamo tutti gli 'athlete')
  const { data: athletes } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'athlete')
  
  // Se non ci sono atleti, fallback sull'utente stesso per testare
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
      <Header 
        title={t('create_title')} 
        user={user}
        profile={profile}
      />

      <div className="p-4 max-w-lg mx-auto">
         <CreateWorkoutForm 
            athletes={athleteList} 
            sports={sports || []} 
            locale={locale} 
         />
      </div>
    </div>
  )
}