import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import { getTranslations } from 'next-intl/server'
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns'
import { TrendingUp, TrendingDown, Minus, Activity, Clock, Map } from 'lucide-react'

// Funzione helper per sommare i valori di un array di allenamenti
const calculateStats = (workouts: any[]) => {
  const completed = workouts.filter(w => w.status === 'completed')
  
  const totalWorkouts = completed.length
  // Somma durata (in minuti) e converti in ore (con 1 decimale)
  const totalDuration = completed.reduce((acc, curr) => acc + (curr.actual_duration || 0), 0) / 60
  const totalDistance = completed.reduce((acc, curr) => acc + (curr.actual_distance || 0), 0)
  
  // Calcolo per sport (per i grafici)
  const bySport: Record<string, { count: number, color: string, name: string }> = {}
  completed.forEach(w => {
    const sportName = w.sports?.name || 'Altro'
    if (!bySport[sportName]) {
      bySport[sportName] = { 
        count: 0, 
        color: w.sports?.color_hex || '#888',
        name: sportName
      }
    }
    bySport[sportName].count += 1
  })

  return {
    totalWorkouts,
    totalDuration: parseFloat(totalDuration.toFixed(1)),
    totalDistance: parseFloat(totalDistance.toFixed(1)),
    bySport
  }
}

// Componente per la Card KPI (Indicatore Chiave di Prestazione)
const StatCard = ({ title, value, prevValue, unit, icon: Icon }: any) => {
  const diff = value - prevValue
  const percent = prevValue > 0 ? ((diff / prevValue) * 100).toFixed(0) : 0
  
  let trendColor = 'text-muted-foreground'
  let TrendIcon = Minus
  
  if (diff > 0) {
    trendColor = 'text-green-500'
    TrendIcon = TrendingUp
  } else if (diff < 0) {
    trendColor = 'text-red-500'
    TrendIcon = TrendingDown
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase font-bold text-muted-foreground">{title}</span>
        <Icon size={16} className="text-primary opacity-80" />
      </div>
      <div>
        <div className="text-2xl font-black font-oswald flex items-baseline gap-1">
          {value} <span className="text-xs font-sans text-muted-foreground font-normal">{unit}</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${trendColor} mt-1`}>
          <TrendIcon size={10} />
          {diff > 0 ? '+' : ''}{percent}% <span className="text-muted-foreground font-normal ml-1">vs sc. sett.</span>
        </div>
      </div>
    </div>
  )
}

export default async function StatsPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const t = await getTranslations('Stats');

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // 1. Definiamo i range temporali (Lunedì-Domenica)
  const today = new Date()
  const startCurrent = startOfWeek(today, { weekStartsOn: 1 })
  const endCurrent = endOfWeek(today, { weekStartsOn: 1 })
  
  const startPrev = subWeeks(startCurrent, 1)
  const endPrev = subWeeks(endCurrent, 1)

  // 2. Query parallele per settimana corrente e precedente
  const [currentWorkouts, prevWorkouts] = await Promise.all([
    supabase.from('workouts')
      .select('*, sports(name, color_hex)')
      .eq('athlete_id', user.id)
      .gte('scheduled_date', startCurrent.toISOString())
      .lte('scheduled_date', endCurrent.toISOString()),
    supabase.from('workouts')
      .select('*, sports(name, color_hex)')
      .eq('athlete_id', user.id)
      .gte('scheduled_date', startPrev.toISOString())
      .lte('scheduled_date', endPrev.toISOString())
  ])

  // 3. Calcoli Matematici
  const currentStats = calculateStats(currentWorkouts.data || [])
  const prevStats = calculateStats(prevWorkouts.data || [])

  // Calcolo percentuale totale sport per le barre
  const totalSportCount = Object.values(currentStats.bySport).reduce((a, b) => a + b.count, 0)

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <Header 
        title={t('title')} 
        subtitle={t('subtitle')}
        user={user}
        profile={profile}
      />

      <div className="px-4 mt-6 space-y-6">
        
        {/* GRIGLIA KPI */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card: Numero Allenamenti */}
          <div className="col-span-2">
             <StatCard 
               title={t('total_workouts')} 
               value={currentStats.totalWorkouts} 
               prevValue={prevStats.totalWorkouts} 
               unit=""
               icon={Activity}
             />
          </div>
          {/* Card: Ore */}
          <StatCard 
            title={t('total_duration')} 
            value={currentStats.totalDuration} 
            prevValue={prevStats.totalDuration} 
            unit="h"
            icon={Clock}
          />
          {/* Card: Distanza */}
          <StatCard 
            title={t('total_distance')} 
            value={currentStats.totalDistance} 
            prevValue={prevStats.totalDistance} 
            unit="km"
            icon={Map}
          />
        </div>

        {/* GRAFICO: RIPARTIZIONE SPORT (Barra singola multi-colore) */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h3 className="text-primary font-bold text-xs uppercase mb-4">
            {t('by_sport')}
          </h3>

          {totalSportCount > 0 ? (
            <>
              {/* Barra Progressiva */}
              <div className="h-4 w-full rounded-full flex overflow-hidden mb-4 bg-secondary">
                {Object.values(currentStats.bySport).map((sport) => (
                  <div 
                    key={sport.name}
                    style={{ 
                      width: `${(sport.count / totalSportCount) * 100}%`,
                      backgroundColor: sport.color 
                    }}
                    className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-1000"
                  />
                ))}
              </div>

              {/* Legenda */}
              <div className="grid grid-cols-2 gap-2">
                {Object.values(currentStats.bySport).map((sport) => (
                  <div key={sport.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sport.color }} />
                    <span className="font-bold text-foreground">{sport.name}</span>
                    <span className="text-muted-foreground ml-auto">{sport.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              {t('no_data')}
            </p>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}