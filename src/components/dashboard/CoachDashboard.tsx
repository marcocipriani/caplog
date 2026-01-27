import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Users, CheckCircle2 } from 'lucide-react'

function getPlanningStatus(workouts: any[]) {
  if (!workouts || workouts.length === 0) return { days: 0, status: 'critical' }
  const dates = workouts.map(w => new Date(w.scheduled_date).getTime())
  const lastDate = new Date(Math.max(...dates))
  const today = new Date()
  const diffTime = lastDate.getTime() - today.getTime()
  const diffDays = diffTime < 0 ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 
  return { days: diffDays, status: diffDays < 3 ? 'warning' : 'good' }
}

export default async function CoachDashboard({ user, profile, locale }: any) {
  const supabase = await createClient()
  
  // Query aggiornata: filtra per coach_id
  const { data: athletes } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, email')
    .eq('role', 'athlete')
    .eq('coach_id', user.id)

  const today = new Date().toISOString().split('T')[0]

  const athletesStats = await Promise.all((athletes || []).map(async (a) => {
    const { data: futureW } = await supabase
      .from('workouts')
      .select('scheduled_date')
      .eq('athlete_id', a.id)
      .gte('scheduled_date', today)
    
    const { data: lastW } = await supabase
        .from('workouts')
        .select('status, scheduled_date, title')
        .eq('athlete_id', a.id)
        .lte('scheduled_date', today)
        .order('scheduled_date', { ascending: false })
        .limit(1)
        .maybeSingle()

    return { ...a, planning: getPlanningStatus(futureW || []), lastWorkout: lastW }
  }))

  return (
    <div className="w-full">
      <Link 
          href={`/${locale}/dashboard/coach/add`}
          className="w-full mb-6 bg-primary text-primary-foreground p-4 rounded-xl flex items-center justify-center gap-3 shadow-lg hover:bg-orange-600 transition-all font-bold uppercase text-sm"
      >
          <Plus size={20} strokeWidth={3} /> Nuova Missione
      </Link>

      <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-muted-foreground font-bold text-[10px] uppercase flex items-center gap-2">
              <Users size={12} /> Stato Reclute
          </h3>
      </div>

      <div className="grid gap-3 w-full">
        {athletesStats.length > 0 ? (
          athletesStats.map((athlete) => (
            <div key={athlete.id} className="bg-card border border-border p-3 rounded-xl flex justify-between items-center shadow-sm relative overflow-hidden group">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${athlete.planning.status === 'critical' ? 'bg-red-500' : athlete.planning.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />

              <div className="flex items-center gap-3 pl-2 min-w-0">
                <div className="h-9 w-9 bg-secondary shrink-0 rounded-full flex items-center justify-center text-xs font-bold border border-border">
                    {athlete.full_name?.[0] || 'A'}
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-sm truncate">{athlete.full_name || athlete.email.split('@')[0]}</h4>
                    <div className="text-[9px] text-muted-foreground truncate uppercase font-bold">
                        {athlete.lastWorkout?.status === 'completed' ? 'Pianificato' : 'In attesa'}
                    </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                      athlete.planning.status === 'critical' ? 'bg-red-100 text-red-700' : 
                      athlete.planning.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                  }`}>
                      {athlete.planning.days} GG
                  </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-50">
            <p className="text-sm font-bold">Nessuna recluta assegnata.</p>
            <p className="text-xs">Gli atleti devono selezionarti dal loro profilo.</p>
          </div>
        )}
      </div>
    </div>
  )
}