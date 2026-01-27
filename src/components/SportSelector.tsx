'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Check, Plus, Settings } from 'lucide-react'
import { getSportIcon } from '@/utils/sport-config'
import Link from 'next/link'

interface SportSelectorProps {
  onSelect: (sportId: string) => void // Il form si aspetta stringa, va bene
  selectedSportId?: string
  userId: string
  locale?: string
}

export default function SportSelector({ onSelect, selectedSportId, userId, locale = 'it' }: SportSelectorProps) {
  const [sports, setSports] = useState<any[]>([])
  const [mySportIds, setMySportIds] = useState<number[]>([]) // ID numerici
  const [showAll, setShowAll] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
        const { data: allSports } = await supabase.from('sports').select('*').order('name')
        const { data: myData } = await supabase.from('user_sports').select('sport_id').eq('user_id', userId)
        
        if (allSports) setSports(allSports)
        if (myData) setMySportIds(myData.map((r: any) => r.sport_id))
    }
    fetchData()
  }, [userId])

  const hasFavorites = mySportIds.length > 0
  
  const visibleSports = (!hasFavorites || showAll) 
    ? sports 
    : sports.filter(s => mySportIds.includes(s.id))

  return (
    <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {visibleSports.map(sport => {
                const Icon = getSportIcon(sport.icon_key)
                // Convertiamo entrambi in stringa per confronto sicuro
                const isSelected = String(selectedSportId) === String(sport.id)
                const isFav = mySportIds.includes(sport.id)

                return (
                    <button
                        key={sport.id}
                        type="button"
                        onClick={() => onSelect(String(sport.id))} // Passa ID come stringa al form
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:bg-secondary/50'}`}
                    >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: sport.color_hex }}>
                            <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-xs font-bold truncate">{sport.name}</span>
                            <span className="block text-[9px] text-muted-foreground uppercase opacity-70">
                                {sport.type} {!isFav && showAll && '• Altro'}
                            </span>
                        </div>
                        {isSelected && <Check size={14} className="ml-auto text-primary" />}
                    </button>
                )
            })}
            
            {/* Tasti Mostra Tutti / Gestisci */}
            {!showAll && hasFavorites ? (
                <button type="button" onClick={() => setShowAll(true)} className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors min-h-[60px]">
                    <Plus size={18} />
                    <span className="text-[10px] font-bold uppercase">Mostra Tutti</span>
                </button>
            ) : (
                <Link href={`/${locale}/dashboard/profile`} className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors min-h-[60px]">
                    <Settings size={18} />
                    <span className="text-[10px] font-bold uppercase">Gestisci</span>
                </Link>
            )}
        </div>
    </div>
  )
}