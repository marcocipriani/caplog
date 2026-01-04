'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Send, User, Calendar, Activity, Bike, Footprints, Waves, Dumbbell, Mic } from 'lucide-react'
import { createWorkout } from '@/actions/coach-actions'
import { useFormStatus } from 'react-dom'
import VoiceRecorder from './VoiceRecorder'

const iconMap: Record<string, any> = {
  bike: Bike,
  ciclismo: Bike,
  footprints: Footprints,
  corsa: Footprints,
  waves: Waves,
  nuoto: Waves,
  dumbbell: Dumbbell,
  palestra: Dumbbell
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-4 bg-primary hover:bg-orange-600 disabled:opacity-50 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg uppercase text-sm mt-4"
    >
      <Send size={18} />
      {pending ? '...' : label}
    </button>
  )
}

interface Props {
  athletes: any[]
  sports: any[]
  locale: string
}

export default function CreateWorkoutForm({ athletes, sports, locale }: Props) {
  const t = useTranslations('Coach')
  const [selectedSportId, setSelectedSportId] = useState<string>(sports[0]?.id?.toString() || '')
  const audioInputRef = useRef<HTMLInputElement>(null)

  const selectedSport = sports.find(s => s.id.toString() === selectedSportId)
  const CurrentIcon = selectedSport && iconMap[selectedSport.icon_key] ? iconMap[selectedSport.icon_key] : Activity
  const sportColor = selectedSport?.color_hex || '#3b82f6'

  const handleAudioRecorded = (blob: Blob | null) => {
    if (!audioInputRef.current) return

    const dataTransfer = new DataTransfer()
    if (blob) {
      const file = new File([blob], "voice-note.webm", { type: "audio/webm" })
      dataTransfer.items.add(file)
      audioInputRef.current.files = dataTransfer.files
    } else {
      audioInputRef.current.value = ''
    }
  }

  return (
    <form action={createWorkout} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      
      <input 
        type="file" 
        name="audioFile" 
        ref={audioInputRef} 
        className="hidden" 
        accept="audio/*"
      />

      <div className="space-y-1">
        <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1 flex items-center gap-1">
            <User size={12} /> {t('select_athlete')}
        </label>
        <div className="relative">
            <select 
                name="athleteId" 
                required
                className="w-full bg-card text-foreground p-3 rounded-xl border border-border appearance-none focus:ring-2 focus:ring-primary outline-none"
            >
                {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.full_name || a.email}
                    </option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1 flex items-center gap-1">
                <Calendar size={12} /> {t('date')}
            </label>
            <input 
                type="date" 
                name="date" 
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-card text-foreground p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none min-h-[50px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1 flex items-center gap-1" style={{ color: sportColor }}>
                <CurrentIcon size={12} /> {t('select_sport')}
            </label>
            <div className="relative">
                <select 
                    name="sportId" 
                    required
                    value={selectedSportId}
                    onChange={(e) => setSelectedSportId(e.target.value)}
                    className="w-full bg-card text-foreground p-3 rounded-xl border appearance-none focus:ring-2 outline-none min-h-[50px] pr-10"
                    style={{ borderColor: sportColor }}
                >
                    {sports.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: sportColor }}>
                    <CurrentIcon size={20} />
                </div>
            </div>
          </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
            {t('title_label')}
        </label>
        <input 
            type="text" 
            name="title" 
            placeholder="Es. Fondo Lento 10k"
            required
            className="w-full bg-card text-foreground p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none font-oswald tracking-wide"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
            {t('desc_label')}
        </label>
        <textarea 
            name="description" 
            rows={4}
            placeholder="Dettagli tecnici, passo, recuperi..."
            required
            className="w-full bg-card text-foreground p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1">
            {t('notes_label')}
        </label>
        <input 
            type="text" 
            name="notes" 
            placeholder="Messaggio motivazionale..."
            className="w-full bg-card text-foreground p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary outline-none italic text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase text-muted-foreground font-bold pl-1 flex items-center gap-1">
           <Mic size={12} /> Nota Vocale
        </label>
        <VoiceRecorder onAudioRecorded={handleAudioRecorded} />
      </div>

      <SubmitButton label={t('assign_btn')} />
    </form>
  )
}