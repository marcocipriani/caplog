'use client'

import { useState } from 'react'
import { assignCoach, removeCoach } from '@/actions/profile-actions'
import { UserCheck, UserPlus, Search, X, Shield } from 'lucide-react'
import Image from 'next/image'

interface CoachSelectorProps {
  currentCoachId: string | null
  availableCoaches: any[]
}

export default function CoachSelector({ currentCoachId, availableCoaches }: CoachSelectorProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [loading, setLoading] = useState(false)

  // Trova l'oggetto del coach attuale se esiste
  const currentCoach = availableCoaches.find(c => c.id === currentCoachId)

  const handleAssign = async (coachId: string) => {
    setLoading(true)
    await assignCoach(coachId)
    setIsSelecting(false)
    setLoading(false)
  }

  const handleRemove = async () => {
    if (!confirm('Vuoi davvero rimuovere questo coach?')) return
    setLoading(true)
    await removeCoach()
    setLoading(false)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
          <h3 className="font-bold uppercase text-sm flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Il Tuo Coach
          </h3>
      </div>

      {currentCoach ? (
        // STATO: COACH ASSEGNATO
        <div className="bg-secondary/30 p-4 rounded-xl border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 border border-primary/20 relative">
                    {currentCoach.avatar_url ? (
                        <Image src={currentCoach.avatar_url} alt="Coach" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-primary">
                            {currentCoach.full_name?.[0]}
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-sm">{currentCoach.full_name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">Coach Certificato</p>
                </div>
            </div>
            
            <button 
                onClick={handleRemove}
                disabled={loading}
                className="text-xs text-red-500 font-bold uppercase hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
            >
                Cambia
            </button>
        </div>
      ) : (
        // STATO: NESSUN COACH (Mostra bottone o lista)
        <div>
            {!isSelecting ? (
                <button 
                    onClick={() => setIsSelecting(true)}
                    className="w-full py-6 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-secondary/30 transition-all group"
                >
                    <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <UserPlus size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase">Seleziona un Coach</span>
                </button>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-2">
                         <span className="text-[10px] font-bold uppercase text-muted-foreground">Coach Disponibili</span>
                         <button onClick={() => setIsSelecting(false)}><X size={16} /></button>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {availableCoaches.map(coach => (
                            <button
                                key={coach.id}
                                onClick={() => handleAssign(coach.id)}
                                disabled={loading}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-primary/5 hover:border-primary transition-all text-left group"
                            >
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                                    {coach.full_name?.[0] || 'C'}
                                </div>
                                <div className="flex-1">
                                    <span className="block text-sm font-bold">{coach.full_name || coach.email}</span>
                                    <span className="block text-[10px] text-muted-foreground">Disponibile</span>
                                </div>
                                <UserCheck size={16} className="text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  )
}