'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User, RefreshCw, ChevronDown } from 'lucide-react'
import { switchUserRole } from '@/actions/user-actions'

interface HeaderUserProps {
  userInitial: string
  role: 'coach' | 'athlete'
  userId: string
}

export default function HeaderUser({ userInitial, role, userId }: HeaderUserProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSwitchRole = async () => {
    const newRole = role === 'athlete' ? 'coach' : 'athlete'
    await switchUserRole(userId, newRole)
    setIsOpen(false)
  }

  const roleBadgeColor = role === 'coach' 
    ? 'bg-orange-500 text-white border-orange-600' 
    : 'bg-blue-600 text-white border-blue-700'

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none group"
      >
        <div className="text-right hidden sm:block">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${roleBadgeColor} shadow-sm`}>
                {role}
            </span>
        </div>

        <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary border-2 border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden">
                <span className="font-oswald font-bold text-lg text-foreground">{userInitial}</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${role === 'coach' ? 'bg-orange-500' : 'bg-blue-600'} sm:hidden`} />
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-border bg-muted/50">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Stai operando come</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${roleBadgeColor}`}>
                    {role}
                </span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </div>
            </div>

            <div className="p-1">
              <Link 
                href="/dashboard/profile" 
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                Il mio Profilo
              </Link>

              <button 
                onClick={handleSwitchRole} 
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors text-left"
              >
                <RefreshCw size={16} />
                Cambia in {role === 'athlete' ? 'Coach' : 'Atleta'}
              </button>

              <div className="h-px bg-border my-1" />

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium"
              >
                <LogOut size={16} />
                Disconnetti
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}