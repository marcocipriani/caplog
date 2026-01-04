import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import WorkoutCard from '@/components/WorkoutCard' // Assicurati di aver creato questo componente nello step precedente
import { CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react'

// Helper date
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

  // Query: Allenamenti da ieri in poi
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
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="px-4 space-y-8 mt-6">
        
        {/* IERI (Passato - Grigio) */}
        {yesterdayWorkout && (
          <div className="opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1">
              Ieri: {yesterdayWorkout.status === 'completed' 
                ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={10} /> Completato</span> 
                : <span className="text-red-500 flex items-center gap-1"><XCircle size={10} /> Non Eseguito</span>}
            </h3>
            <div className="scale-95 origin-left">
               <WorkoutCard workout={yesterdayWorkout} locale={locale} />
            </div>
          </div>
        )}

        {/* OGGI (Hero) */}
        <div>
          <h3 className="text-primary font-bold text-sm uppercase mb-3 flex items-center gap-2 animate-pulse">
            <Clock size={16} /> Missione Odierna
          </h3>
          {todayWorkout ? (
            <div className="transform scale-105 origin-top transition-transform shadow-2xl shadow-primary/10 rounded-xl">
               <WorkoutCard workout={todayWorkout} locale={locale} />
            </div>
          ) : (
            <div className="bg-secondary/30 p-8 rounded-2xl border-2 border-dashed border-border text-center">
              <p className="text-muted-foreground font-medium">Nessun ordine per oggi.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">"Riposo e recupero"</p>
            </div>
          )}
        </div>

        {/* FUTURO */}
        {futureWorkouts.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-muted-foreground font-bold text-xs uppercase mb-4 flex items-center gap-2">
              <CalendarDays size={14} /> Prossime Operazioni
            </h3>
            <div className="space-y-4">
              {futureWorkouts.map(w => (
                <WorkoutCard key={w.id} workout={w} locale={locale} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}