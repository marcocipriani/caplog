'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      
      const isDismissed = window.localStorage.getItem('caplog-pwa-dismissed') === 'true'
      if (isDismissed) return

      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleDismiss = () => {
    window.localStorage.setItem('caplog-pwa-dismissed', 'true')
    setIsVisible(false)
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsVisible(false)
      window.localStorage.setItem('caplog-pwa-dismissed', 'true')
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 z-[60] px-4 flex justify-center pointer-events-none">
      <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-border/20 w-full max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
             <Download size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold font-oswald uppercase text-[10px] sm:text-xs text-primary leading-tight">Installa CapLog</h3>
            <p className="text-[10px] opacity-80 leading-tight">Aggiungi alla Home</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={handleDismiss}
                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
            >
                <X size={18} />
            </button>
            <button 
                onClick={handleInstallClick}
                className="px-3 py-2 bg-primary text-primary-foreground font-bold uppercase text-[10px] rounded-lg shadow-lg active:scale-95 transition-transform shrink-0"
            >
                Installa
            </button>
        </div>
      </div>
    </div>
  )
}