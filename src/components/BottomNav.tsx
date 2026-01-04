'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, BarChart2, User as UserIcon, Users, PlusCircle } from 'lucide-react'

interface Props {
  role: 'coach' | 'athlete'
  locale: string
}

export default function BottomNav({ role, locale }: Props) {
  const pathname = usePathname()

  // Helper per classe attiva
  const isActive = (path: string) => pathname === `/${locale}${path}` ? 'text-primary' : 'text-muted-foreground'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-t border-border pb-safe">
      <div className="flex justify-around items-center p-3 max-w-md mx-auto">
        
        {/* --- MENU COMUNE: HOME --- */}
        <Link href={`/${locale}`} className={`flex flex-col items-center gap-1 ${pathname === `/${locale}` ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home size={22} strokeWidth={pathname === `/${locale}` ? 2.5 : 2} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        {/* --- MENU COACH --- */}
        {role === 'coach' && (
          <>
            <Link href={`/${locale}/dashboard/coach/add`} className={`flex flex-col items-center gap-1 ${isActive('/dashboard/coach/add')}`}>
              <PlusCircle size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">Nuova</span>
            </Link>

            <Link href={`/${locale}/dashboard/coach/squad`} className={`flex flex-col items-center gap-1 ${isActive('/dashboard/coach/squad')}`}>
              <Users size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">Squadra</span>
            </Link>
          </>
        )}

        {/* --- MENU ATLETA --- */}
        {role === 'athlete' && (
          <>
            <Link href={`/${locale}/dashboard/schedule`} className={`flex flex-col items-center gap-1 ${isActive('/dashboard/schedule')}`}>
              <CalendarDays size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">Piano</span>
            </Link>

            <Link href={`/${locale}/dashboard/stats`} className={`flex flex-col items-center gap-1 ${isActive('/dashboard/stats')}`}>
              <BarChart2 size={22} strokeWidth={2} />
              <span className="text-[10px] font-medium">Stats</span>
            </Link>
          </>
        )}

        {/* --- MENU COMUNE: PROFILO --- */}
        <Link href={`/${locale}/dashboard/profile`} className={`flex flex-col items-center gap-1 ${isActive('/dashboard/profile')}`}>
          <UserIcon size={22} strokeWidth={2} />
          <span className="text-[10px] font-medium">Profilo</span>
        </Link>

      </div>
    </nav>
  )
}