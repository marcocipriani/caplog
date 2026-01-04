'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, use } from 'react' // 1. Aggiungi 'use' qui
import { User, Shield, Medal, LogOut, Settings } from 'lucide-react'
import { toggleUserRole } from '@/actions/user-actions'
import Image from 'next/image'

// 2. Definisci params come Promise
export default function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  // 3. Spacchetta i params con l'hook use()
  const { locale } = use(params)

  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSwitching, setIsSwitching] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    getData()
  }, [supabase])

  const handleRoleToggle = async () => {
    if (!profile || !user) return
    setIsSwitching(true)
    // 4. Usa la variabile 'locale' spacchettata, non params.locale
    await toggleUserRole(profile.role, user.id, locale)
    setIsSwitching(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Caricamento profilo...</div>

  const isCoach = profile?.role === 'coach'

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      
      {/* HEADER PROFILO */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm">
        <div className="w-24 h-24 rounded-full border-4 border-background shadow-xl mb-4 relative overflow-hidden">
            {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
            ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-3xl font-bold">
                    {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
                </div>
            )}
        </div>
        
        <h2 className="text-2xl font-bold font-oswald uppercase">{profile?.full_name || 'Recluta'}</h2>
        <p className="text-muted-foreground text-sm">{user?.email}</p>

        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5 border ${
             isCoach ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
        }`}>
            {isCoach ? <Shield size={12} /> : <Medal size={12} />}
            {isCoach ? 'Grado: Coach' : 'Grado: Atleta'}
        </div>
      </div>

      {/* AZIONI RAPIDE */}
      <div className="grid gap-4">
          
          {/* CARD CAMBIO RUOLO */}
          <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                    <Settings size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Modalità Operativa</h3>
                    <p className="text-xs text-muted-foreground">Passa da vista Atleta a vista Coach</p>
                </div>
             </div>
             
             <button 
                onClick={handleRoleToggle}
                disabled={isSwitching}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-lg active:scale-95 transition-all"
             >
                {isSwitching ? '...' : 'Cambia'}
             </button>
          </div>

          {/* CARD LOGOUT */}
          <button 
            onClick={handleSignOut}
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center justify-center gap-2 font-bold uppercase text-sm transition-colors"
          >
            <LogOut size={18} /> Disconnessione
          </button>

      </div>
      
      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest opacity-50 pt-8">
        CapLog System v1.0
      </p>
    </div>
  )
}