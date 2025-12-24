import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { getTranslations } from 'next-intl/server'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  getDay 
} from 'date-fns'
import { it, enUS } from 'date-fns/locale' // local formats
import { ChevronLeft, ChevronRight, Check, X, Circle } from 'lucide-react'
import Link from 'next/link'

// helper for status
const getWorkoutStatusColor = (workout: any) => {
  if (workout.status === 'completed') return 'bg-green-500 shadow-green-500/50'
  if (workout.status === 'missed') return 'bg-red-500 shadow-red-500/50'
  return 'bg-gray-400'
}

export default async function SchedulePage({ 
  params, 
  searchParams 
}: { 
  params: { locale: string },
  searchParams: { month?: string }
}) {
  const { locale } = await params;
  const { month } = await searchParams; // async searchParams
  const t = await getTranslations('Schedule');

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  // 1. Determiniamo la data corrente del calendario
  // Se c'è un parametro ?month=2023-12 usiamo quello, altrimenti oggi
  const currentDate = month ? new Date(month) : new Date()
  
  // Data locale per formattazione date (it o en)
  const dateLocale = locale === 'it' ? it : enUS

  // 2. Calcoliamo inizio e fine del mese visualizzato
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // 3. Generiamo tutti i giorni da visualizzare
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })


  const { data: workouts } = await supabase
    .from('workouts')
    .select('*, sports(name, color_hex)')
    .eq('athlete_id', user.id)
    .gte('scheduled_date', monthStart.toISOString())
    .lte('scheduled_date', monthEnd.toISOString())

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 5. Setup per la navigazione mesi (Link Precedente / Successivo)

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header 
        title={t('title')} 
        subtitle={format(currentDate, 'MMMM yyyy', { locale: dateLocale })}
        user={user}
        profile={profile}
      />

      <div className="px-4 mt-6">
        
        {/* GRIGLIA CALENDARIO */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
          
          {/* Intestazione Giorni Settimana */}
          <div className="grid grid-cols-7 mb-2 border-b border-border pb-2">
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Giorni */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-1">
            {/* Spazi vuoti per allineare il primo giorno del mese (se inizia di Mercoledì, saltiamo Lun e Mar) */}
            {/* Nota: getDay restituisce 0 per Domenica, 1 Lunedì... aggiustiamo l'offset per partire da Lunedì */}
            {Array.from({ length: (getDay(monthStart) + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((day) => {
              const dayString = format(day, 'yyyy-MM-dd')
              // Troviamo se c'è un allenamento in questo giorno
              const dailyWorkout = workouts?.find(w => w.scheduled_date === dayString)
              const isTodayDate = isToday(day)

              return (
                <div key={dayString} className="flex flex-col items-center relative group">
                  {/* Cerchio del giorno */}
                  <div className={`
                    w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                    ${isTodayDate ? 'bg-primary text-primary-foreground font-bold scale-110 shadow-lg shadow-orange-500/20' : 'text-foreground hover:bg-secondary'}
                    ${dailyWorkout ? 'cursor-pointer' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>

                  {/* Pallino indicatore allenamento */}
                  {dailyWorkout && (
                    <Link href={dailyWorkout.status === 'completed' ? `/dashboard/report/${dailyWorkout.id}` : `/dashboard`} className="absolute -bottom-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${getWorkoutStatusColor(dailyWorkout)}`} />
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* LISTA ALLENAMENTI DEL MESE (Sotto il calendario) */}
        <div className="mt-8 space-y-4">
          <h3 className="text-primary font-bold text-xs uppercase mb-2">
            Prossime Missioni
          </h3>
          
          {workouts && workouts.length > 0 ? (
            workouts
              .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
              .filter(w => new Date(w.scheduled_date) >= new Date()) // Mostriamo solo i futuri/oggi nella lista
              .slice(0, 5) // Solo i prossimi 5
              .map((workout) => (
              <div key={workout.id} className="flex items-center gap-4 bg-secondary/20 p-3 rounded-xl border border-border/50">
                <div className="flex flex-col items-center justify-center bg-card w-12 h-12 rounded-lg border border-border shadow-sm shrink-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {format(new Date(workout.scheduled_date), 'MMM', { locale: dateLocale })}
                  </span>
                  <span className="text-lg font-black font-oswald leading-none">
                    {format(new Date(workout.scheduled_date), 'dd')}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                    {workout.sports?.name}
                  </p>
                  <h4 className="font-bold text-sm truncate">{workout.title}</h4>
                </div>

                <div className={`w-2 h-8 rounded-full`} style={{ backgroundColor: workout.sports?.color_hex || '#ccc' }} />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              Nessuna missione in vista. Riposo o punizione?
            </p>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}