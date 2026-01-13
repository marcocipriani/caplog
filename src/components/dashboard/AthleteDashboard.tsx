'use client'

import { useState, useEffect } from 'react'
import HorizontalCalendar from './HorizontalCalendar'
import MonthCalendar from './MonthCalendar'
import WorkoutCard from '@/components/WorkoutCard'
import AddWorkoutPlaceholder from '@/components/AddWorkoutPlaceholder'
import { createClient } from '@/utils/supabase/client'
import { LayoutGrid, StretchHorizontal } from 'lucide-react'

export default function AthleteDashboard({ user, profile, locale }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [workouts, setWorkouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'strip' | 'month'>('strip') // Stato della vista
  
  useEffect(() => {
    const fetchWorkouts = async () => {
      const supabase = createClient()
      const today = new Date()
      // Carichiamo un range ampio (es. +/- 2 mesi) per coprire entrambe le viste
      const startRange = new Date(today.setMonth(today.getMonth() - 2)).toISOString()
      
      const { data } = await supabase
        .from('workouts')
        .select('*, sports(*)')
        .eq('athlete_id', user.id)
        .gte('scheduled_date', startRange)
        .order('scheduled_date', { ascending: true })
        
      if (data) setWorkouts(data)
      setLoading(false)
    }
    
    fetchWorkouts()
  }, [user.id])

  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const todaysWorkouts = workouts.filter(w => w.scheduled_date === selectedDateStr)

  return (
    <div className="w-full relative">
      
      {/* TOGGLE VISTA (Posizionato sopra il calendario a destra) */}
      <div className="flex justify-end mb-2 px-1">
        <div className="bg-secondary/50 p-1 rounded-lg flex items-center gap-1">
            <button 
                onClick={() => setViewMode('strip')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'strip' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title="Vista Striscia"
            >
                <StretchHorizontal size={16} />
            </button>
            <button 
                onClick={() => setViewMode('month')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'month' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                title="Vista Mese"
            >
                <LayoutGrid size={16} />
            </button>
        </div>
      </div>

      {/* CALENDARIO DINAMICO */}
      <div className="mb-6">
         {viewMode === 'strip' ? (
             <HorizontalCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate} 
                workouts={workouts}
                locale={locale}
             />
         ) : (
             <MonthCalendar 
                selectedDate={selectedDate} 
                onSelectDate={setSelectedDate} 
                workouts={workouts}
                locale={locale}
             />
         )}
      </div>

      {/* LISTA ALLENAMENTI */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase text-muted-foreground">
                Programma {selectedDate.getDate() === new Date().getDate() ? 'di oggi' : 'del giorno'}
            </h3>
            <span className="text-[10px] font-mono bg-secondary px-2 py-0.5 rounded text-foreground/70">
                {todaysWorkouts.length} Attività
            </span>
        </div>

        {todaysWorkouts.length > 0 ? (
            <div className="space-y-3">
                {todaysWorkouts.map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} locale={locale} />
                ))}
            </div>
        ) : (
            <div className="py-8 text-center bg-secondary/10 rounded-xl border border-border/50">
                <p className="text-sm font-medium text-muted-foreground">Nessun ordine dal coach.</p>
                <p className="text-xs opacity-60">Goditi il riposo o aggiungi un extra.</p>
            </div>
        )}

        <AddWorkoutPlaceholder locale={locale} />
      </div>
    </div>
  )
}