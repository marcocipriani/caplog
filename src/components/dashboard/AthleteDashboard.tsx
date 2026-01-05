import { createClient } from '@/utils/supabase/server'
import WorkoutCard from '@/components/WorkoutCard'
import { CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react'

const getDates = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return {
    todayStr: today.toISOString().split('T')[0],
    yesterdayStr: yesterday.toISOString().split('T')[0]
  }
}

export default async function AthleteDashboard({ user, profile, locale }: any) {
  const supabase = await createClient()
  const { todayStr, yesterdayStr } = getDates()

  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, sports(*)')
    .eq('athlete_id', user.id)
    .gte('scheduled_date', yesterdayStr)
    .order('scheduled_date', { ascending: true })
    .limit(10)

  const todayWorkout = workouts?.find(w => w.scheduled_date === todayStr)
  const yesterdayWorkout = workouts?.find(w => w.scheduled_date === yesterdayStr)
  const futureWorkouts = workouts?.filter(w => w.scheduled_date > todayStr) || []

  return (
    <div className="space-y-6 w-full">
      
      {/* IERI */}
      {yesterdayWorkout && (
        <div className="opacity-50 transition-opacity hover:opacity-100">
          <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
            Operazione Precedente
          </h3>
          <WorkoutCard workout={yesterdayWorkout} locale={locale} />
        </div>
      )}

      {/* OGGI */}
      <div className="relative">
        <h3 className="text-primary font-bold text-xs uppercase mb-3 flex items-center gap-2">
          <Clock size={14} className="animate-pulse" /> Missione Principale
        </h3>
        {todayWorkout ? (
          <div className="ring-2 ring-primary/20 rounded-xl shadow-xl">
             <WorkoutCard workout={todayWorkout} locale={locale} />
          </div>
        ) : (
          <div className="bg-secondary/20 p-6 rounded-2xl border-2 border-dashed border-border text-center">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Riposo Operativo</p>
          </div>
        )}
      </div>

      {/* FUTURO */}
      {futureWorkouts.length > 0 && (
        <div className="pt-4 border-t border-border">
          <h3 className="text-muted-foreground font-bold text-[10px] uppercase mb-4 flex items-center gap-2">
            <CalendarDays size={12} /> Prossime Operazioni
          </h3>
          <div className="space-y-3">
            {futureWorkouts.map(w => (
              <WorkoutCard key={w.id} workout={w} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}