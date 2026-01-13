'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface HorizontalCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  workouts: any[] // Per mostrare i pallini dei giorni con allenamenti
  locale: string
}

export default function HorizontalCalendar({ selectedDate, onSelectDate, workouts, locale }: HorizontalCalendarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Genera i giorni: Se espanso mostra 2 settimane, se no una striscia lunga scorrevole
  // Generiamo un range di date centrato su oggi o sulla data selezionata
  const generateDays = () => {
    const days = []
    const baseDate = new Date() // Partiamo sempre da oggi per il contesto
    const range = isExpanded ? 14 : 30 // 2 settimane vs 30 giorni scorrevoli
    const startOffset = isExpanded ? 0 : 15 // Se espanso inizia da oggi, altrimenti centra oggi

    for (let i = -2; i < range; i++) { // Parte da 2 giorni fa
      const d = new Date(baseDate)
      d.setDate(baseDate.getDate() + (i - (isExpanded ? 0 : 2))) 
      days.push(d)
    }
    return days
  }

  const days = generateDays()

  // Auto-scroll alla data selezionata all'avvio
  useEffect(() => {
    if (scrollContainerRef.current && !isExpanded) {
        // Logica semplice di centraggio scroll
        const selectedEl = document.getElementById(`day-${selectedDate.toISOString().split('T')[0]}`)
        if (selectedEl) {
            selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }
  }, [selectedDate, isExpanded])

  const hasWorkout = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return workouts.some(w => w.scheduled_date === dateStr)
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0]
  }

  return (
    <div className="bg-background sticky top-0 z-30 pt-2 pb-1 transition-all duration-300">
      
      {/* HEADER MESE CORRENTE */}
      <div className="flex justify-between items-end px-1 mb-2">
        <h2 className="text-xl font-bold font-oswald uppercase text-foreground">
            {selectedDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </h2>
        <button 
            onClick={() => {
                onSelectDate(new Date()) // Torna a oggi
            }}
            className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-1 rounded"
        >
            Oggi
        </button>
      </div>

      {/* STRISCIA GIORNI */}
      <div 
        ref={scrollContainerRef}
        className={`
            ${isExpanded ? 'grid grid-cols-7 gap-y-4' : 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3'} 
            transition-all duration-300 pb-2
        `}
      >
        {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            const hasActivity = hasWorkout(day)

            return (
                <button
                    key={day.toISOString()}
                    id={`day-${day.toISOString().split('T')[0]}`}
                    onClick={() => onSelectDate(day)}
                    className={`
                        snap-center shrink-0 flex flex-col items-center justify-center
                        w-[13.5vw] max-w-[50px] h-16 rounded-2xl transition-all relative
                        ${isSelected 
                            ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                            : 'bg-secondary/30 text-muted-foreground hover:bg-secondary'
                        }
                        ${isToday && !isSelected ? 'border border-primary/50 text-primary' : ''}
                    `}
                >
                    <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                        {day.toLocaleDateString(locale, { weekday: 'short' }).replace('.', '')}
                    </span>
                    <span className="text-lg font-black leading-none mt-0.5">
                        {day.getDate()}
                    </span>
                    
                    {/* Pallino indicatore allenamento */}
                    {hasActivity && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                    )}
                </button>
            )
        })}
      </div>

      {/* MANIGLIA PER ESPANDERE (TOGGLE) */}
      <div className="flex justify-center -mt-1 pb-1">
         <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-4 bg-secondary hover:bg-secondary/80 rounded-full flex items-center justify-center transition-colors active:scale-95"
         >
            {isExpanded ? <ChevronUp size={12} className="opacity-50" /> : <ChevronDown size={12} className="opacity-50" />}
         </button>
      </div>
    </div>
  )
}