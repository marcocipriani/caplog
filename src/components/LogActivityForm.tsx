'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import SportSelector from './SportSelector'
import { Calendar, Clock, MapPin, Activity } from 'lucide-react'

export default function LogActivityForm({ userId, locale, defaultDate }: { userId: string, locale: string, defaultDate?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sportId, setSportId] = useState<string>('')
  
  // Dati Form
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate || new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [rpe, setRpe] = useState('5')
  const [notes, setNotes] = useState('')

  const handleSubmit = async () => {
    if (!sportId || !title) return
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from('workouts').insert({
        athlete_id: userId,
        sport_id: sportId,
        title: title,
        scheduled_date: date,
        origin: 'athlete', // IMPORTANTE: Distingue dall'allenamento del coach
        status: 'completed', // Nasce già completato
        planned_description: notes, // Usiamo questo campo per le note dell'atleta o ne creiamo uno nuovo
        actual_duration: parseInt(duration) || 0,
        actual_distance: parseFloat(distance) || 0,
        perceived_effort: parseInt(rpe)
    })

    if (!error) {
        router.push(`/${locale}`)
        router.refresh()
    } else {
        alert("Errore nel salvataggio")
        setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* 1. SELEZIONE SPORT */}
      <section>
        <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
            <Activity size={16} className="text-primary" /> 1. Scegli Attività
        </h3>
        <SportSelector 
            userId={userId} 
            onSelect={setSportId} 
            selectedSportId={sportId} 
        />
      </section>

      {/* 2. DETTAGLI */}
      <section className="bg-card border border-border p-4 rounded-xl space-y-4">
        <h3 className="text-sm font-bold uppercase mb-1">2. Dettagli Sessione</h3>
        
        <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Titolo Sessione</label>
            <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Es. Corsa rigenerante serale"
                className="w-full bg-secondary rounded-lg p-3 text-sm font-medium mt-1 focus:ring-2 ring-primary outline-none"
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Calendar size={10}/> Data</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-secondary rounded-lg p-2 text-sm mt-1"
                />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><Clock size={10}/> Durata (min)</label>
                <input 
                    type="number" 
                    value={duration} 
                    onChange={e => setDuration(e.target.value)}
                    placeholder="0"
                    className="w-full bg-secondary rounded-lg p-2 text-sm mt-1"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1"><MapPin size={10}/> Distanza (km)</label>
                <input 
                    type="number" 
                    step="0.1"
                    value={distance} 
                    onChange={e => setDistance(e.target.value)}
                    placeholder="Opzionale"
                    className="w-full bg-secondary rounded-lg p-2 text-sm mt-1"
                />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Sforzo (1-10)</label>
                <div className="flex items-center gap-2 mt-1">
                    <input 
                        type="range" min="1" max="10" 
                        value={rpe} 
                        onChange={e => setRpe(e.target.value)}
                        className="flex-1 accent-primary h-2 bg-secondary rounded-lg appearance-none"
                    />
                    <span className="text-sm font-bold w-6 text-center">{rpe}</span>
                </div>
            </div>
        </div>

        <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Note / Sensazioni</label>
            <textarea 
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Come ti sei sentito?"
                className="w-full bg-secondary rounded-lg p-3 text-sm mt-1 resize-none"
            />
        </div>
      </section>

      <button 
        onClick={handleSubmit}
        disabled={loading || !title || !sportId}
        className="w-full bg-primary text-white font-bold uppercase py-4 rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none"
      >
        {loading ? 'Salvataggio...' : 'Registra Attività'}
      </button>

    </div>
  )
}