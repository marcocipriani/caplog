'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Save, X, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { submitWorkoutReport } from '@/actions/workout-actions'

interface ReportFormProps {
  workoutId: string
  locale: string
  defaultValues?: {
    distance?: number | null
    duration?: number | null
    rpe?: number | null
  }
}

export default function ReportForm({ workoutId, locale }: ReportFormProps) {
  const t = useTranslations('Report')

  const [rpe, setRpe] = useState<number>(5)

  const getRpeColor = (val: number) => {
    if (val <= 3) return 'text-green-500'
    if (val <= 6) return 'text-yellow-500'
    if (val <= 8) return 'text-orange-500'
    return 'text-red-600'
  }

  return (
    <form action={submitWorkoutReport} className="space-y-6">
      <input type="hidden" name="workoutId" value={workoutId} />
      <input type="hidden" name="locale" value={locale} />

      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-primary font-bold text-xs uppercase mb-4 border-b border-border pb-2">
          Dati Tecnici
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] uppercase text-muted-foreground font-bold mb-1">{t('distance')}</label>
            <input 
              type="number" step="0.01" name="distance" 
              placeholder="0.0"
              className="w-full bg-secondary text-foreground p-3 rounded-xl border-transparent focus:border-primary focus:ring-0 font-oswald text-lg"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-muted-foreground font-bold mb-1">{t('duration')}</label>
            <input 
              type="number" name="duration" 
              placeholder="min"
              className="w-full bg-secondary text-foreground p-3 rounded-xl border-transparent focus:border-primary focus:ring-0 font-oswald text-lg"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <label className="text-[10px] uppercase text-muted-foreground font-bold">{t('rpe')}</label>
            <span className={`text-sm font-bold font-oswald animate-pulse ${getRpeColor(rpe)}`}>
              {t(`rpe_scale.${rpe}`)}
            </span>
          </div>
          
          <div className="relative h-12 flex items-center">
            <input 
              type="range" min="1" max="10" step="1" name="rpe"
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary z-20 relative"
            />
            
            <div className="absolute top-7 left-0 right-0 flex justify-between px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                        <div className="h-1.5 w-0.5 bg-muted-foreground/30 mb-1"></div>
                        <span className="text-[9px] text-muted-foreground font-mono">{num}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border/50">
            <input 
                type="checkbox" 
                id="isPartial" 
                name="isPartial"
                className="w-5 h-5 text-primary bg-secondary border-gray-500 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="isPartial" className="cursor-pointer">
                <span className="block text-xs font-bold text-foreground uppercase flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    {t('is_partial')}
                </span>
                <span className="block text-[10px] text-muted-foreground">
                    {t('is_partial_desc')}
                </span>
            </label>
        </div>

        <div className="mt-6">
          <label className="block text-[10px] uppercase text-muted-foreground font-bold mb-1">{t('link')}</label>
          <input 
            type="url" name="link" 
            placeholder="https://connect.garmin.com/..."
            className="w-full bg-secondary text-foreground p-3 rounded-xl text-sm border-transparent focus:border-primary focus:ring-0"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
        <h3 className="text-primary font-bold text-xs uppercase mb-4 border-b border-border pb-2">
          Debriefing
        </h3>
        <textarea 
          name="notes" 
          rows={4}
          placeholder={t('notes_placeholder')}
          className="w-full bg-secondary text-foreground p-3 rounded-xl text-sm border-transparent focus:border-primary focus:ring-0 resize-none"
        ></textarea>
      </div>

      <div className="flex gap-3 pt-2">
        <Link 
          href={`/${locale}/dashboard`}
          className="flex-1 py-4 bg-secondary text-muted-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase text-xs"
        >
          <X size={18} /> {t('cancel')}
        </Link>
        
        <button 
          type="submit"
          className="flex-[2] py-4 bg-primary hover:bg-orange-600 text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-orange-500/20 uppercase text-xs"
        >
          <Save size={18} /> {t('submit')}
        </button>
      </div>

    </form>
  )
}