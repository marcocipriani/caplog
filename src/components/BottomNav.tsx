'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, BarChart2, Users, PlusCircle, Briefcase } from 'lucide-react'

interface BottomNavProps {
  role: string
  locale: string
}

export default function BottomNav({ role, locale }: BottomNavProps) {
  const pathname = usePathname()
  const isManager = role === 'manager'
  const isCoach = role === 'coach'

  const isActive = (path: string) => pathname === `/${locale}${path}` ? 'text-primary' : 'text-muted-foreground hover:text-foreground'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border pb-safe transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        
        <Link href={`/${locale}`} className={`flex flex-col items-center gap-1 w-20 ${pathname === `/${locale}` ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home size={24} strokeWidth={pathname === `/${locale}` ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>

        {isManager ? (
            <Link href={`/${locale}/dashboard/manager/users`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/manager/users')}`}>
              <div className="bg-purple-600/10 p-2 rounded-full mb-1">
                <Briefcase size={24} className="text-purple-600" />
              </div>
            </Link>
        ) : isCoach ? (
            <Link href={`/${locale}/dashboard/coach/add`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/coach/add')}`}>
              <div className="bg-primary/10 p-2 rounded-full mb-1">
                <PlusCircle size={24} className="text-primary" />
              </div>
            </Link>
        ) : (
            <Link href={`/${locale}/dashboard/schedule`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/schedule')}`}>
              <CalendarDays size={24} />
              <span className="text-[10px] font-bold uppercase">Piano</span>
            </Link>
        )}

        {isManager ? (
             <Link href={`/${locale}/dashboard/stats`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/stats')}`}>
              <BarChart2 size={24} />
              <span className="text-[10px] font-bold uppercase">Stats</span>
            </Link>
        ) : isCoach ? (
             <Link href={`/${locale}/dashboard/coach/athletes`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/coach/athletes')}`}>
              <Users size={24} />
              <span className="text-[10px] font-bold uppercase">Reclute</span>
            </Link>
        ) : (
            <Link href={`/${locale}/dashboard/stats`} className={`flex flex-col items-center gap-1 w-20 ${isActive('/dashboard/stats')}`}>
              <BarChart2 size={24} />
              <span className="text-[10px] font-bold uppercase">Stats</span>
            </Link>
        )}

      </div>
    </nav>
  )
}