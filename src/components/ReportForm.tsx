'use client'

import { updateWorkoutReport } from '@/actions/workout-actions'
import { 
  CloudSun, Utensils, Footprints, Activity, Save, 
  Link as LinkIcon, Timer, MapPin, AlertTriangle, Calendar 
} from 'lucide-react'

interface Props {
  workout: any
  shoes: any[]
  locale: string
}

export default function ReportForm({ workout, shoes, locale }: Props) {
  // Colore dello sport (default arancione se manca)
  const sportColor = workout.sports?.color_hex || '#f97316'
  
  // Data formattata
  const dateStr = new Date(workout.scheduled_date).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="space-y-6">
      
      {/* --- CARD 1: DETTAGLI MISSIONE (SOLO LETTURA) --- */}
      <div 
        className="bg-card rounded-xl border-l-[6px] shadow-sm overflow-hidden"
        style={{ borderLeftColor: sportColor }}
      >
        <div className="p-5 space-y-3">
          {/* Header: Data e Sport */}
          <div className="flex justify-between items-center border-b border-border pb-2 mb-2">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
               <Calendar size={12} /> {dateStr}
            </div>
            <div 
              className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-white"
              style={{ backgroundColor: sportColor }}
            >
              {workout.sports?.name}
            </div>
          </div>

          {/* Titolo e Descrizione */}
          <div>
            <h1 className="text-xl font-bold font-oswald uppercase leading-none mb-2">
              {workout.title}
            </h1>
            <div className="bg-secondary/30 p-3 rounded-lg text-sm leading-relaxed text-foreground/90">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                Ordini Operativi:
              </span>
              {workout.planned_description}
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD 2: FORM DEBRIEFING --- */}
      <form action={updateWorkoutReport} className="space-y-4">
        <input type="hidden" name="workoutId" value={workout.id} />
        <input type="hidden" name="locale" value={locale} />

        <div className="flex items-center gap-2 mb-2 pt-2">
            <div className="h-4 w-1 bg-primary rounded-full"></div>
            <h2 className="text-lg font-bold font-oswald uppercase text-foreground">
            Rapporto Missione
            </h2>
        </div>

        {/* 1. LINK ATTIVITÀ (IN ALTO) */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-2">
           <label className="text-[10px] uppercase text-primary font-bold flex items-center gap-1">
             <LinkIcon size={12} /> Link Attività (Strava/Garmin)
           </label>
           <input 
              type="url" name="activityLink" 
              defaultValue={workout.activity_link}
              placeholder="Incolla qui il link..."
              className="w-full bg-background p-3 rounded-lg border border-input text-sm focus:ring-2 focus:ring-primary outline-none"
           />
        </div>

        {/* 2. STATISTICHE (DISTANZA & TEMPO) */}
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-card p-4 rounded-xl border border-border space-y-2">
                <label className="text-[10px] uppercase text-primary font-bold flex items-center gap-1">
                    <MapPin size={12} /> Distanza (Km)
                </label>
                <input 
                    type="number" step="0.01" name="distance"
                    defaultValue={workout.actual_distance}
                    placeholder="0.00"
                    className="w-full bg-background p-3 rounded-lg border border-input text-lg font-bold text-center focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div className="bg-card p-4 rounded-xl border border-border space-y-2">
                <label className="text-[10px] uppercase text-primary font-bold flex items-center gap-1">
                    <Timer size={12} /> Tempo (Min)
                </label>
                <input 
                    type="number" name="duration"
                    defaultValue={workout.actual_duration}
                    placeholder="0"
                    className="w-full bg-background p-3 rounded-lg border border-input text-lg font-bold text-center focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
        </div>

        {/* 3. FLAG INTERRUZIONE */}
        <div className="bg-card p-3 rounded-xl border border-border flex items-center gap-3">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                name="isPartial" 
                id="isPartial"
                defaultChecked={workout.is_partial}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-input bg-background checked:bg-red-500 checked:border-red-500 transition-all"
              />
              <AlertTriangle size={12} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
            <label htmlFor="isPartial" className="text-xs font-bold uppercase text-muted-foreground cursor-pointer select-none">
                Missione interrotta / Non completata
            </label>
        </div>

        {/* 4. SENSAZIONI (RPE + Note) */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
            <Activity size={16} /> Sensazioni
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">RPE (Sforzo 1-10)</label>
            <input 
              type="range" name="rpe" min="1" max="10" defaultValue={workout.rpe || 5} 
              className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-1">
              <span>Facile</span><span>Estremo</span>
            </div>
          </div>

          <textarea 
            name="feedback"
            rows={3}
            placeholder="Come ti sei sentito? Gambe, fiato, fatica..."
            defaultValue={workout.athlete_feedback}
            className="w-full bg-background p-3 rounded-lg border border-input text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        {/* 5. METEO */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
            <CloudSun size={16} /> Meteo
          </div>
          <input 
            type="text" name="weather"
            placeholder="Es. 12°C, Vento forte..."
            defaultValue={workout.weather_notes}
            className="w-full bg-background p-3 rounded-lg border border-input text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* 6. NUTRIZIONE */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
            <Utensils size={16} /> Nutrizione
          </div>
          <textarea 
            name="nutrition"
            rows={2}
            placeholder="Es. 1 Gel al 40'..."
            defaultValue={workout.nutrition_notes}
            className="w-full bg-background p-3 rounded-lg border border-input text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
          />
        </div>

        {/* 7. EQUIPAGGIAMENTO */}
        <div className="bg-card p-4 rounded-xl border border-border space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase">
            <Footprints size={16} /> Equipaggiamento
          </div>
          <select 
            name="shoeId"
            defaultValue={workout.shoe_id || ""}
            className="w-full bg-background p-3 rounded-lg border border-input text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="" disabled>Seleziona scarpe...</option>
            {shoes.map(shoe => (
              <option key={shoe.id} value={shoe.id}>
                {shoe.brand} {shoe.model} {shoe.nickname ? `(${shoe.nickname})` : ''}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform uppercase">
          <Save size={18} /> Registra Rapporto
        </button>
      </form>
    </div>
  )
}