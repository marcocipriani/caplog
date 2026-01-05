'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, X } from 'lucide-react'
import { upgradeToCoach } from '@/actions/user-actions'

export default function RoleManager({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    await upgradeToCoach(userId)
  }

  return (
    <>
      <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 rounded-2xl p-6 mt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <Shield size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold font-oswald uppercase text-lg text-blue-400">Vuoi diventare un Coach?</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Attivando questa modalità potrai gestire atleti, creare schede e assegnare allenamenti. 
            </p>
            <button 
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
              Attiva Modalità Coach
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            
            <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
                <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-2">
                <AlertTriangle size={32} />
              </div>
              
              <h2 className="text-xl font-bold font-oswald uppercase">Conferma Promozione</h2>
              
              <p className="text-sm text-muted-foreground">
                Stai per cambiare il tuo ruolo in <strong>COACH</strong>.<br/>
                Questa azione sbloccherà funzionalità avanzate di gestione. Sei sicuro di voler procedere?
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="py-3 rounded-xl border border-border font-bold uppercase text-xs hover:bg-secondary transition-colors"
                >
                    Annulla
                </button>
                <button 
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? 'Attivazione...' : 'Conferma'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}