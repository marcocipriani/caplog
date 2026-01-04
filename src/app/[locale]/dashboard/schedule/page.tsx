import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react'

// Helper per ottenere giorni del mese
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

// 1. Definisci i tipi come Promise
interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ month?: string }>
}

export default async function SchedulePage({ params, searchParams }: Props) {
  // 2. Await dei parametri
  const { locale } = await params
  const { month } = await searchParams

  const t = await getTranslations('Dashboard') // Usa traduzioni dashboard o crea 'Schedule'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // Gestione Data Corrente (dal URL o Oggi)
  const today = new Date()
  let currentDate = today

  if (month) {
    const [y, m] = month.split('-').map(Number)
    if (!isNaN(y) && !isNaN(m)) {
      currentDate = new Date(y, m - 1, 1)
    }
  }

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() // 0-11
  
  // Calcolo Mese Precedente/Successivo per i link
  const prevDate = new Date(currentYear, currentMonth - 1, 1)
  const nextDate = new Date(currentYear, currentMonth + 1, 1)
  const prevMonthStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
  const nextMonthStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`

  // Range Date per Query Database
  const startDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`
  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const endDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${daysInMonth}`

  // Fetch Allenamenti del mese
  const { data: workouts } = await supabase
    .from('workouts')
    .select('id, title, scheduled_date, status, sports(color_hex, name)')
    .eq('athlete_id', user.id)
    .gte('scheduled_date', startDateStr)
    .lte('scheduled_date', endDateStr)
    .order('scheduled_date', { ascending: true })

  // Raggruppa per giorno
  const workoutsByDay: Record<string, any[]> = {}
  workouts?.forEach(w => {
    if (!workoutsByDay[w.scheduled_date]) workoutsByDay[w.scheduled_date] = []
    workoutsByDay[w.scheduled_date].push(w)
  })

  // Generazione Giorni Calendario
  const calendarDays = []
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    calendarDays.push({
      day: i,
      dateStr,
      workouts: workoutsByDay[dateStr] || []
    })
  }

  // Formattazione mese per titolo
  const monthName = currentDate.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      {/* Intestazione Mese */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border p-4 flex items-center justify-between shadow-sm">
        <Link 
            href={`/${locale}/dashboard/schedule?month=${prevMonthStr}`}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
        >
            <ChevronLeft size={24} />
        </Link>
        
        <h1 className="text-xl font-bold font-oswald uppercase flex items-center gap-2">
            <CalendarIcon size={20} className="text-primary" />
            <span className="capitalize">{monthName}</span>
        </h1>

        <Link 
            href={`/${locale}/dashboard/schedule?month=${nextMonthStr}`}
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
        >
            <ChevronRight size={24} />
        </Link>
      </div>

      {/* Griglia / Lista Giorni */}
      <div className="p-4 space-y-3">
        {calendarDays.map((dayItem) => {
            const isToday = dayItem.dateStr === today.toISOString().split('T')[0]
            const hasWorkouts = dayItem.workouts.length > 0
            
            // Nascondi giorni passati senza allenamenti se vuoi compattare, 
            // ma per un calendario meglio mostrare tutto o almeno i giorni con attività/oggi/futuro.
            // Qui mostriamo tutto.

            return (
                <div key={dayItem.day} className={`flex gap-3 ${!hasWorkouts && !isToday ? 'opacity-40' : ''}`}>
                    
                    {/* Colonna Giorno */}
                    <div className="flex flex-col items-center w-12 pt-1">
                        <span className="text-xs text-muted-foreground uppercase font-bold">
                            {new Date(dayItem.dateStr).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', { weekday: 'short' })}
                        </span>
                        <span className={`text-lg font-black leading-none p-2 rounded-full ${isToday ? 'bg-primary text-white' : ''}`}>
                            {dayItem.day}
                        </span>
                    </div>

                    {/* Colonna Eventi */}
                    <div className="flex-1 space-y-2 pb-4 border-b border-border/50">
                        {hasWorkouts ? (
                            dayItem.workouts.map(w => (
                                <Link 
                                    key={w.id} 
                                    href={`/${locale}/dashboard/report/${w.id}`}
                                    className="block bg-card border border-border rounded-xl p-3 shadow-sm active:scale-95 transition-transform"
                                    style={{ borderLeft: `4px solid ${w.sports?.color_hex || '#f97316'}` }}
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-sm leading-tight">{w.title}</h3>
                                        {w.status === 'completed' ? (
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                        ) : (
                                            <Circle size={16} className="text-muted-foreground shrink-0" />
                                        )}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1 block">
                                        {w.sports?.name || 'Allenamento'}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <div className="h-full flex items-center">
                                <span className="text-[10px] text-muted-foreground italic">Riposo</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        })}
      </div>

    </div>
  )
}