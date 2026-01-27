import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LogActivityForm from '@/components/LogActivityForm'

export default async function AthleteAddWorkoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="p-4 max-w-lg mx-auto">
         <h1 className="text-2xl font-bold font-oswald uppercase mb-6 flex items-center gap-2">
            Registra Attività
         </h1>

         <LogActivityForm 
            userId={user.id} 
            locale={locale} 
         />
      </div>
    </div>
  )
}