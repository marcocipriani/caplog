'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  BarChart2, 
  MessageSquare, 
  PlusCircle, 
  Users, 
  Briefcase, 
  Home 
} from 'lucide-react'

interface HeaderProps {
  user: any
  profile: any
  activeRole: string
  locale: string
}

export default function Header({ user, profile, activeRole, locale }: HeaderProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '') {
        return pathname === `/${locale}` 
            ? 'bg-background text-primary shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
    }
    return pathname.startsWith(`/${locale}${path}`) 
        ? 'bg-background text-primary shadow-sm' 
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
  }

  // Classe base per i link del menu
  const linkClass = (path: string) => 
    `flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${isActive(path)}`

  const renderMenu = () => {
    // Menu COACH
    if (activeRole === 'coach') {
      return (
        <>
          <Link href={`/${locale}`} className={linkClass('')} title="Home">
            <Home size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Home</span>
          </Link>
          <Link href={`/${locale}/dashboard/coach/add`} className={linkClass('/dashboard/coach/add')} title="Nuova Missione">
            <PlusCircle size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Missione</span>
          </Link>
          <Link href={`/${locale}/dashboard/coach/athletes`} className={linkClass('/dashboard/coach/athletes')} title="Atleti">
            <Users size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Atleti</span>
          </Link>
        </>
      )
    }

    // Menu MANAGER
    if (activeRole === 'manager') {
      return (
        <>
          <Link href={`/${locale}`} className={linkClass('')} title="Home">
            <Home size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Home</span>
          </Link>
          <Link href={`/${locale}/dashboard/manager/users`} className={linkClass('/dashboard/manager/users')} title="Utenti">
            <Briefcase size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Utenti</span>
          </Link>
          <Link href={`/${locale}/dashboard/stats`} className={linkClass('/dashboard/stats')} title="Statistiche">
            <BarChart2 size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Stats</span>
          </Link>
        </>
      )
    }

    // Default: ATLETA (Home, Chat, Stats)
    return (
      <>
        <Link href={`/${locale}`} className={linkClass('')} title="Home">
            <Home size={18} />
            <span className="hidden sm:block text-xs font-bold uppercase">Home</span>
        </Link>
        
        <Link href={`/${locale}/dashboard/chat`} className={linkClass('/dashboard/chat')} title="Chat Coach">
          <MessageSquare size={18} />
          <span className="hidden sm:block text-xs font-bold uppercase">Chat</span>
        </Link>
        
        <Link href={`/${locale}/dashboard/stats`} className={linkClass('/dashboard/stats')} title="Statistiche">
          <BarChart2 size={18} />
          <span className="hidden sm:block text-xs font-bold uppercase">Stats</span>
        </Link>
      </>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none">
      <div className="w-full max-w-lg p-4 flex items-center justify-between pointer-events-auto bg-background/80 backdrop-blur-md">
        
        {/* SINISTRA: Mascotte + Saluto */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                <Image 
                    src="/cap-mascot.png" 
                    alt="CapLog" 
                    fill 
                    className="object-contain"
                    sizes="32px"
                />
            </div>
            <div className="flex flex-col">
                <span className="font-oswald font-bold text-lg leading-none text-primary">CAP<span className="text-foreground">LOG</span></span>
                <span className="text-[10px] text-muted-foreground leading-none">
                    Benvenuto, {profile?.full_name?.split(' ')[0] || 'Atleta'}
                </span>
            </div>
        </Link>

        {/* DESTRA: Navigazione a Pillola Responsive */}
        <nav className="flex items-center p-1 rounded-full bg-secondary/60 border border-border/50 backdrop-blur-md shadow-sm">
            
            {/* Voci Menu */}
            <div className="flex items-center gap-1 pr-2 border-r border-border/40 mr-2">
                {renderMenu()}
            </div>

            {/* Avatar Utente */}
            <Link href={`/${locale}/dashboard/profile`} className="relative group">
                <div className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${isActive('/dashboard/profile').includes('bg-background') ? 'border-primary' : 'border-transparent group-hover:border-primary/50'}`}>
                    {profile?.avatar_url ? (
                        <Image 
                            src={profile.avatar_url} 
                            alt="Profile" 
                            width={32} 
                            height={32} 
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                            {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
            </Link>
        </nav>

      </div>
    </header>
  )
}