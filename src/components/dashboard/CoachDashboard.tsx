import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import Link from 'next/link'
import { User, Calendar, CheckCircle2, Plus, Users, ChevronRight } from 'lucide-react'

// Helper logica pianificazione
function getPlanningStatus(workouts: any[]) {
  if (!workouts || workouts.length === 0) return { days: 0, status: 'critical' }
  
  const dates = workouts.map(w => new Date(w.scheduled_date).getTime())
  const lastDate = new Date(Math.max(...dates))
  const today = new Date()
  
  const diffTime = lastDate.getTime() - today.getTime()
  // Se ultima data è passata, giorni = 0
  const diffDays = diffTime < 0 ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
  
  return { 
    days: diffDays, 
    status: diffDays < 3 ? 'warning' : 'good'
  }
}

export default async function CoachDashboard({ user, profile, locale }: any) {
  const supabase = await createClient()

  // Prendi tutti gli atleti (filtra per coach_id se hai implementato la relazione)
  const { data: athletes } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email')
    .eq('role', 'athlete')

  const today = new Date().toISOString().split('T')[0]

  // Arricchisci dati atleti
  const athletesStats = await Promise.all((athletes || []).map(async (a) => {
    // Pianificazione Futura
    const { data: futureW } = await supabase
      .from('workouts')
      .select('scheduled_date')
      .eq('athlete_id', a.id)
      .gte('scheduled_date', today)
    
    // Ultimo Allenamento (Ieri o Oggi)
    const { data: lastW } = await supabase
        .from('workouts')
        .select('status, scheduled_date, title')
        .eq('athlete_id', a.id)
        .lte('scheduled_date', today)
        .order('scheduled_date', { ascending: false })
        .limit(1)
        .maybeSingle()

    return { 
      ...a, 
      planning: getPlanningStatus(futureW || []), 
      lastWorkout: lastW 
    }
  }))

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      <div className="px-4 mt-6">
        <Link 
            href={`/${locale}/dashboard/coach/add`}
            className="w-full mb-8 bg-primary text-primary-foreground p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 active:scale-95 transition-all font-bold uppercase tracking-wide"
        >
            <Plus size={24} strokeWidth={3} /> Nuova Missione
        </Link>

        <div className="flex items-center justify-between mb-4">
            <h3 className="text-muted-foreground font-bold text-xs uppercase flex items-center gap-2">
                <Users size={14} /> Stato Reclute
            </h3>
            <span className="text-[10px] font-bold bg-secondary px-2 py-1 rounded text-foreground/70">{athletesStats.length} Atleti</span>
        </div>

        <div className="grid gap-3">
          {athletesStats.map((athlete) => (
            <div key={athlete.id} className="bg-card border border-border p-4 rounded-xl flex justify-between items-center shadow-sm relative overflow-hidden">
              
              {/* Indicatore laterale stato pianificazione */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${athlete.planning.status === 'critical' ? 'bg-red-500' : athlete.planning.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />

              <div className="flex items-center gap-3 pl-2">
                <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-sm font-bold border border-border">
                    {athlete.full_name?.[0] || athlete.email[0].toUpperCase()}
                </div>
                <div>
                    <h4 className="font-bold text-sm leading-none mb-1">{athlete.full_name || athlete.email.split('@')[0]}</h4>
                    
                    <div className="text-[10px] flex items-center gap-1 text-muted-foreground">
                        {athlete.lastWorkout ? (
                            athlete.lastWorkout.status === 'completed' ? 
                            <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Completato</span> :
                            <span>Ultimo: {athlete.lastWorkout.title}</span>
                        ) : (
                            <span>Nessuna attività recente</span>
                        )}
                    </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold mb-0.5">Copertura</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded ${
                         athlete.planning.status === 'critical' ? 'bg-red-100 text-red-700' : 
                         athlete.planning.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                         'bg-green-100 text-green-700'
                    }`}>
                        {athlete.planning.days} GG
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}