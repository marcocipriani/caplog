'use client'

import { useState } from 'react'
import { addSport, deleteSport } from '@/app/actions/sport-actions'
import { AVAILABLE_ICONS, getSportIcon } from '@/utils/sport-config'
import { Trash2, Plus, Check } from 'lucide-react'

export default function SportManager({ sports }: { sports: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState('activity')
  const [selectedColor, setSelectedColor] = useState('#f97316') // Default arancione

  const handleSubmit = async (formData: FormData) => {
    // Aggiungiamo manualmente stato e icona al formData se non gestiti da input nascosti standard
    formData.set('icon_key', selectedIcon)
    formData.set('color_hex', selectedColor)
    
    await addSport(formData)
    setIsAdding(false)
    // Reset form visivo
    setSelectedIcon('activity')
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER + BUTTON */}
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold uppercase text-muted-foreground">Sport ConfiguratI</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* FORM DI AGGIUNTA */}
      {isAdding && (
        <form action={handleSubmit} className="bg-card border border-border p-4 rounded-xl shadow-md animate-in slide-in-from-top-2">
          <h3 className="text-xs font-bold uppercase mb-4">Nuovo Sport</h3>
          
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">Nome Sport</label>
              <input 
                name="name" 
                type="text" 
                placeholder="Es. Corsa in Montagna" 
                className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:ring-2 ring-primary outline-none"
                required 
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">Seleziona Icona</label>
              <div className="grid grid-cols-6 gap-2">
                {AVAILABLE_ICONS.map((item) => {
                  const Icon = item.icon
                  const isSelected = selectedIcon === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setSelectedIcon(item.key)}
                      className={`p-2 rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-transparent hover:bg-secondary/80'}`}
                      title={item.label}
                    >
                      <Icon size={18} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color Picker Semplificato */}
            <div>
               <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-2">Colore Distintivo</label>
               <div className="flex items-center gap-3">
                 <input 
                    type="color" 
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="h-10 w-10 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                 />
                 <span className="text-xs font-mono opacity-60">{selectedColor}</span>
               </div>
            </div>

            <button type="submit" className="w-full bg-foreground text-background font-bold uppercase text-xs py-3 rounded-lg hover:opacity-90">
              Salva Configurazione
            </button>
          </div>
        </form>
      )}

      {/* LISTA SPORT */}
      <div className="grid gap-3">
        {sports.map((sport) => {
          const Icon = getSportIcon(sport.icon_key)
          return (
            <div key={sport.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: sport.color_hex }}
                >
                  <Icon size={20} />
                </div>
                <div>
                   <h4 className="font-bold text-sm">{sport.name}</h4>
                   <p className="text-[10px] text-muted-foreground uppercase">{sport.icon_key}</p>
                </div>
              </div>
              
              <button 
                onClick={() => deleteSport(sport.id)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )
        })}

        {sports.length === 0 && !isAdding && (
          <p className="text-center text-sm text-muted-foreground py-10">Nessuno sport configurato.</p>
        )}
      </div>
    </div>
  )
}