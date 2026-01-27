'use client'

import { useState } from 'react'
import { toggleUserSport, addSport } from '@/actions/sport-actions'
import { getSportIcon, AVAILABLE_ICONS } from '@/utils/sport-config'
import { Check, Plus, Search, Trophy, Settings, X, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserSportsManagerProps {
  allSports: any[]
  userSportIds: number[]
  userId: string
}

export default function UserSportsManager({ allSports, userSportIds, userId }: UserSportsManagerProps) {
  const [activeIds, setActiveIds] = useState<number[]>(userSportIds)
  const [view, setView] = useState<'mine' | 'all'>('mine')
  const [isCreating, setIsCreating] = useState(false)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  
  // Stati Form Creazione
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState('#f97316')
  const [newIcon, setNewIcon] = useState('generic')
  
  const router = useRouter()

  const handleToggle = async (sportId: number) => {
    setLoadingId(sportId)
    const isCurrentlySelected = activeIds.includes(sportId)
    const newActiveIds = isCurrentlySelected 
      ? activeIds.filter(id => id !== sportId)
      : [...activeIds, sportId]
    
    setActiveIds(newActiveIds)
    await toggleUserSport(sportId, isCurrentlySelected)
    setLoadingId(null)
    router.refresh()
  }

  const handleCreate = async () => {
    if (!newName) return
    const formData = new FormData()
    formData.append('name', newName)
    formData.append('color_hex', newColor)
    formData.append('icon_key', newIcon)
    formData.append('type', 'outdoor') // Default
    formData.append('created_by', userId) // Importante: Sport personale

    await addSport(formData)
    
    setIsCreating(false)
    setNewName('')
    setView('all') // Sposta su 'all' per vederlo e selezionarlo
    router.refresh()
  }

  // Filtra liste
  const mySports = allSports.filter(s => activeIds.includes(s.id))
  // Nel catalogo mostriamo prima i selezionati, poi gli altri
  const sortedAllSports = [...allSports].sort((a, b) => {
      const aSel = activeIds.includes(a.id)
      const bSel = activeIds.includes(b.id)
      if (aSel && !bSel) return -1
      if (!aSel && bSel) return 1
      return a.name.localeCompare(b.name)
  })

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      
      {/* HEADER TABS */}
      <div className="flex border-b border-border">
          <button 
             onClick={() => { setView('mine'); setIsCreating(false) }}
             className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'mine' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-secondary/50'}`}
          >
             I Miei Sport ({activeIds.length})
          </button>
          <button 
             onClick={() => setView('all')}
             className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${view === 'all' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:bg-secondary/50'}`}
          >
             Gestisci / Aggiungi
          </button>
      </div>

      <div className="p-4">
        
        {/* VISTA 1: I MIEI SPORT */}
        {view === 'mine' && !isCreating && (
            <div className="space-y-4 animate-in fade-in">
                {mySports.length === 0 ? (
                    <div className="text-center py-8 opacity-50">
                        <Trophy size={32} className="mx-auto mb-2" />
                        <p className="text-xs">Nessuno sport selezionato.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {mySports.map(sport => {
                            const Icon = getSportIcon(sport.icon_key)
                            return (
                                <div key={sport.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: sport.color_hex }}>
                                        <Icon size={16} />
                                    </div>
                                    <span className="text-xs font-bold truncate">{sport.name}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
                
                <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-secondary/30 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase"
                >
                    <Plus size={16} /> Crea Sport Personalizzato
                </button>
            </div>
        )}

        {/* FORM CREAZIONE */}
        {isCreating && (
            <div className="bg-secondary/20 p-4 rounded-xl border border-border animate-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase text-primary">Nuovo Sport</h3>
                    <button onClick={() => setIsCreating(false)}><X size={16} className="text-muted-foreground" /></button>
                </div>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-60">Nome</label>
                        <input 
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Es. Padel Doppio"
                            className="w-full bg-background border border-border rounded-lg p-2 text-sm mt-1 focus:ring-2 ring-primary outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-60">Colore</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input 
                                type="color" 
                                value={newColor}
                                onChange={e => setNewColor(e.target.value)}
                                className="h-8 w-12 rounded cursor-pointer border-0 p-0"
                            />
                            <span className="text-xs font-mono opacity-50">{newColor}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase opacity-60 mb-2 block">Icona</label>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {AVAILABLE_ICONS.map(i => {
                                const Ico = i.icon
                                return (
                                    <button
                                        key={i.key}
                                        onClick={() => setNewIcon(i.key)}
                                        className={`p-2 rounded-lg border shrink-0 transition-all ${newIcon === i.key ? 'bg-primary text-white border-primary scale-110 shadow-sm' : 'bg-background border-border opacity-60'}`}
                                    >
                                        <Ico size={16} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button 
                        onClick={handleCreate}
                        disabled={!newName}
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold uppercase text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                        <Save size={16} /> Salva Sport
                    </button>
                </div>
            </div>
        )}

        {/* VISTA 2: CATALOGO COMPLETO */}
        {view === 'all' && (
             <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg">
                    <Search size={14} className="opacity-50 ml-1" />
                    <input className="bg-transparent border-none text-xs w-full focus:ring-0 outline-none" placeholder="Cerca sport..." />
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                    {sortedAllSports.map(sport => {
                        const Icon = getSportIcon(sport.icon_key)
                        const isSelected = activeIds.includes(sport.id)
                        const isLoading = loadingId === sport.id

                        return (
                            <button
                                key={sport.id}
                                onClick={() => handleToggle(sport.id)}
                                disabled={isLoading}
                                className={`
                                    flex items-center gap-2 p-2 rounded-lg border text-left transition-all relative overflow-hidden group
                                    ${isSelected 
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                        : 'border-border bg-card hover:bg-secondary opacity-60 hover:opacity-100'
                                    }
                                `}
                            >
                                <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0 transition-all ${!isSelected && 'grayscale group-hover:grayscale-0'}`}
                                    style={{ backgroundColor: sport.color_hex }}
                                >
                                    <Icon size={14} />
                                </div>
                                <span className="text-[11px] font-bold truncate flex-1">{sport.name}</span>
                                {isSelected && <Check size={14} className="text-primary mr-1" />}
                                {isLoading && <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />}
                            </button>
                        )
                    })}
                </div>
                <p className="text-[10px] text-center text-muted-foreground opacity-60">
                    Seleziona gli sport per vederli nella schermata di aggiunta allenamento.
                </p>
             </div>
        )}

      </div>
    </div>
  )
}