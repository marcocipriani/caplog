'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import { Moon, Sun, Megaphone, Footprints, RotateCw, LogOut, Settings, Radio } from 'lucide-react'
import { switchUserRole } from '@/actions/user-actions'
import { getUnreadCount } from '@/actions/chat-actions'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  user: any
  profile: any
  activeRole: string
  locale: string
}

export default function Header({ user, profile, activeRole, locale }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false) // 1. Stato per l'idratazione
  const [isSwitching, setIsSwitching] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const supabase = createClient()
  const router = useRouter()

  const isRealCoach = profile?.role === 'coach'
  const isCoachMode = activeRole === 'coach'

  // 2. useEffect per segnare il componente come montato
  useEffect(() => {
    setMounted(true)
    
    const fetchUnread = async () => {
      const count = await getUnreadCount()
      setUnreadCount(count)
    }
    fetchUnread()
    
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRoleToggle = async () => {
    if (!isRealCoach) return
    setIsSwitching(true)
    const nextRole = isCoachMode ? 'athlete' : 'coach'
    await switchUserRole(locale, nextRole)
    setIsSwitching(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border h-16 transition-all">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* --- SX: MASCOTTE --- */}
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="relative w-10 h-10 hover:scale-105 transition-transform">
             <Image src="/cap-mascot.png" alt="Cap" fill className="object-contain" sizes="50px"/>
          </Link>
          <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block"></div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider leading-none mb-0.5">
                Benvenuto,
            </span>
            <span className={`text-sm font-black uppercase font-oswald leading-none tracking-wide ${isCoachMode ? 'text-blue-500' : 'text-foreground'}`}>
                {isRealCoach ? 'Comandante' : 'Recluta'} {profile?.full_name?.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* --- DX: STRUMENTI --- */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* 1. THEME SWITCHER (Corretto con controllo mounted) */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            {/* Se non è ancora montato, mostra un placeholder o l'icona di default (Sun) per evitare mismatch */}
            {!mounted ? (
                <Sun size={18} />
            ) : (
                theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />
            )}
          </button>

          {/* 2. SWITCH RUOLO (Solo Coach) */}
          {isRealCoach && (
            <button 
                onClick={handleRoleToggle}
                disabled={isSwitching}
                className={`hidden sm:flex px-3 py-1.5 rounded-lg border transition-all active:scale-95 items-center gap-2 shadow-sm ${
                    isCoachMode 
                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                }`}
            >
                {isSwitching ? <RotateCw size={14} className="animate-spin" /> : (isCoachMode ? <Megaphone size={14} /> : <Footprints size={14} />)}
                <span className="text-[10px] font-black uppercase tracking-wide">
                    {isCoachMode ? 'Mod. Coach' : 'Mod. Atleta'}
                </span>
            </button>
          )}

          {/* 3. RADIO COMMS (CHAT) */}
          <Link 
            href={`/${locale}/dashboard/chat`}
            className="relative p-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Radio size={20} />
            {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-background">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
          </Link>

          {/* 4. AVATAR */}
          <div className="relative pl-2 border-l border-border">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors"
            >
                 <span className="font-oswald font-bold text-sm">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                 </span>
            </button>
             {isMenuOpen && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-1">
                        <Link 
                            href={`/${locale}/dashboard/profile`} 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase hover:bg-secondary rounded-lg"
                        >
                            <Settings size={14} /> Profilo
                        </Link>
                        <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                            <LogOut size={14} /> Esci
                        </button>
                    </div>
                </div>
                </>
             )}
          </div>

        </div>
      </div>
    </header>
  )
}