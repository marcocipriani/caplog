'use client'

import { useState, useRef, useEffect } from 'react'
import { LogOut, Settings, Moon, Sun, Megaphone, Footprints, RotateCw } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toggleUserRole } from '@/actions/user-actions'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  profile: any
  user: any
}

export default function Header({ profile, user }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleRoleToggle = async () => {
    setIsSwitching(true)
    // Estrae il locale dall'url (es /it/...) o default a 'it'
    const currentLocale = pathname.split('/')[1] || 'it'
    await toggleUserRole(profile.role, user.id, currentLocale)
    setIsSwitching(false)
  }

  const isCoach = profile?.role === 'coach'

  // Logica Titoli Aggiornata
  const getPageTitle = () => {
    // Se siamo in Dashboard / Home
    if (pathname.endsWith('/dashboard') || pathname === '/' || pathname.match(/\/[a-z]{2}$/)) {
      return (
        <div className="flex flex-col">
            {/* Logica Benvenuto richiesta */}
            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                Benvenuto,
            </span>
            <span className={`text-sm font-black uppercase font-oswald leading-none ${isCoach ? 'text-primary' : 'text-foreground'}`}>
                {isCoach ? 'Coach' : 'Recluta'} {profile?.full_name?.split(' ')[0]}
            </span>
        </div>
      )
    }
    
    // Titoli altre pagine
    if (pathname.includes('/schedule')) return <span className="font-oswald font-bold uppercase text-lg">Pianificazione</span>
    if (pathname.includes('/stats')) return <span className="font-oswald font-bold uppercase text-lg">Statistiche</span>
    if (pathname.includes('/profile')) return <span className="font-oswald font-bold uppercase text-lg">Profilo</span>
    if (pathname.includes('/report')) return <span className="font-oswald font-bold uppercase text-lg">Rapporto</span>
    
    return <span className="font-oswald font-bold uppercase text-lg">CapLog</span>
  }

  if (!mounted) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border h-16 transition-all">
      <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* --- SX: MASCOTTE + TITOLO --- */}
        <div className="flex items-center gap-3">
          <Link href="/" className="relative w-8 h-8 drop-shadow-md hover:scale-110 transition-transform">
             <Image src="/cap-mascot.png" alt="Cap" fill className="object-contain" />
          </Link>
          <div className="h-6 w-[1px] bg-border mx-1"></div>
          <div className="text-foreground">
            {getPageTitle()}
          </div>
        </div>

        {/* --- DX: STRUMENTI --- */}
        <div className="flex items-center gap-2">

          {/* 1. THEME SWITCHER (A Sinistra del bottone ruolo) */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
            title="Cambia Tema"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* 2. SWITCH RUOLO (Con etichetta interna) */}
          <button 
            onClick={handleRoleToggle}
            disabled={isSwitching}
            className={`px-3 py-1.5 rounded-lg border transition-all active:scale-95 flex items-center gap-2 shadow-sm ${
                isCoach 
                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' 
                : 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20'
            }`}
          >
             {isSwitching ? (
                 <RotateCw size={16} className="animate-spin" />
             ) : (
                 // ICONE RICHIESTE: Megafono (Coach) / Impronte (Atleta)
                 isCoach ? <Megaphone size={16} /> : <Footprints size={16} />
             )}
             
             {/* TESTO MODALITÀ */}
             <span className="text-[10px] font-black uppercase tracking-wide hidden sm:inline-block">
                {isCoach ? 'Mod. Coach' : 'Mod. Atleta'}
             </span>
             {/* Solo icona su mobile piccolissimo, ma 'hidden sm:inline-block' sopra gestisce il testo */}
          </button>

          {/* 3. AVATAR & MENU */}
          <div className="relative ml-1" ref={menuRef}>
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all ${isMenuOpen ? 'border-primary' : 'border-border'}`}
            >
                {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="Avatar" width={36} height={36} />
                ) : (
                    <span className="font-bold text-sm">{profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}</span>
                )}
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
                <div className="absolute right-0 top-12 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-border bg-secondary/30">
                        <p className="text-sm font-bold truncate">{profile?.full_name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    
                    <div className="p-1">
                        <Link 
                            href="/dashboard/profile" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                            <Settings size={16} /> Impostazioni
                        </Link>
                    </div>

                    <div className="p-1 border-t border-border">
                        <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                        >
                            <LogOut size={16} /> Esci
                        </button>
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}