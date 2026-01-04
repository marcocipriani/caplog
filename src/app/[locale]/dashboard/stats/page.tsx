import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Activity, Trophy, TrendingUp, CheckCircle2 } from 'lucide-react'

// 1. Definisci params come Promise
export default async function StatsPage({ params }: { params: Promise<{ locale: string }> }) {
  // 2. Await dei params
  const { locale } = await params
  
  // Usa namespace 'Dashboard' o uno generico se 'Stats' non esiste
  const t = await getTranslations('Dashboard') 
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  // Fetch di tutti gli allenamenti dell'atleta
  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, status, scheduled_date')
    .eq('athlete_id', user.id)

  // Calcolo Statistiche
  const totalWorkouts = workouts?.length || 0
  const completedWorkouts = workouts?.filter(w => w.status === 'completed').length || 0
  
  // Calcolo % completamento (evita divisione per zero)
  const completionRate = totalWorkouts > 0 
    ? Math.round((completedWorkouts / totalWorkouts) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      {/* Intestazione */}
      <div className="p-4 pt-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold font-oswald uppercase mb-1">
          Rapporto Prestazioni
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Analisi operativa delle missioni svolte.
        </p>

        {/* Griglia Statistiche */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Card 1: Completate */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-full mb-2">
                <CheckCircle2 size={24} />
            </div>
            <span className="text-3xl font-black font-oswald">{completedWorkouts}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Missioni Completate</span>
          </div>

          {/* Card 2: Totali */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full mb-2">
                <Activity size={24} />
            </div>
            <span className="text-3xl font-black font-oswald">{totalWorkouts}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Missioni Totali</span>
          </div>

          {/* Card 3: Rateo Successo (Larga) */}
          <div className="col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-sm font-bold uppercase text-muted-foreground mb-1">Tasso di Successo</h3>
                <span className="text-4xl font-black font-oswald text-primary">{completionRate}%</span>
            </div>
            <div className="p-4 bg-primary/10 text-primary rounded-full">
                <TrendingUp size={32} />
            </div>
            
            {/* Barra di progresso visuale sullo sfondo */}
            <div 
                className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000" 
                style={{ width: `${completionRate}%` }}
            />
          </div>

          {/* Card 4: Livello (Placeholder) */}
          <div className="col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
             <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-full">
                <Trophy size={24} />
             </div>
             <div>
                <h3 className="font-bold uppercase text-sm">Livello Atleta</h3>
                <p className="text-xs text-muted-foreground">
                    {completedWorkouts > 10 ? 'Veterano' : 'Recluta'}
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}