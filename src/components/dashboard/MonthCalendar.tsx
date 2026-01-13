'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MonthCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  workouts: any[]
  locale: string
}

export default function MonthCalendar({ selectedDate, onSelectDate, workouts, locale }: MonthCalendarProps) {
  // Helper per ottenere i giorni del mese corrente visualizzato (basato su selectedDate)
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const date = new Date(year, month, 1)
    const days = []

    // Padding giorni mese precedente (per allineare lunedì/domenica)
    const firstDayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1 // Lunedì = 0
    for (let i = 0; i < firstDayIndex; i++) {
        days.push(null) 
    }

    while (date.getMonth() === month) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  const days = getDaysInMonth()
  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

  // Navigazione mese
  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + offset)
    onSelectDate(newDate)
  }

  const hasWorkout = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return workouts.filter(w => w.scheduled_date === dateStr)
  }

  const isSelected = (d: Date) => d.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
  const isToday = (d: Date) => d.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-300">
      
      {/* HEADER CONTROLLI */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-secondary rounded-full"><ChevronLeft size={20}/></button>
        <h3 className="font-oswald font-bold uppercase text-lg">
            {selectedDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-secondary rounded-full"><ChevronRight size={20}/></button>
      </div>

      {/* GRIGLIA GIORNI */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {weekDays.map(d => <span key={d} className="text-[10px] uppercase font-bold text-muted-foreground">{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            
            const dayWorkouts = hasWorkout(day)
            const active = isSelected(day)
            const today = isToday(day)

            return (
                <button
                    key={day.toISOString()}
                    onClick={() => onSelectDate(day)}
                    className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all
                        ${active ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-secondary'}
                        ${today && !active ? 'border border-primary text-primary' : ''}
                    `}
                >
                    <span className="text-sm font-bold">{day.getDate()}</span>
                    
                    {/* Pallini allenamenti */}
                    <div className="flex gap-0.5 mt-0.5 px-0.5 flex-wrap justify-center h-1.5 w-full">
                        {dayWorkouts.map((w, idx) => (
                            <div 
                                key={idx} 
                                className={`w-1 h-1 rounded-full ${active ? 'bg-white' : 'bg-primary'}`} 
                            />
                        ))}
                    </div>
                </button>
            )
        })}
      </div>
    </div>
  )
}