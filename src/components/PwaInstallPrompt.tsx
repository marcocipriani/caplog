'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Previene il banner brutto automatico di Chrome
      e.preventDefault()
      // Salva l'evento per attivarlo dopo col nostro tasto
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()

    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-border/20">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
             <Download size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold font-oswald uppercase text-sm text-primary">Installa CapLog</h3>
            <p className="text-xs opacity-80">Aggiungi alla Home per un accesso rapido</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setIsVisible(false)}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
            >
                <X size={18} />
            </button>
            <button 
                onClick={handleInstallClick}
                className="px-4 py-2 bg-primary text-primary-foreground font-bold uppercase text-xs rounded-lg shadow-lg active:scale-95 transition-transform"
            >
                Installa
            </button>
        </div>
      </div>
    </div>
  )
}