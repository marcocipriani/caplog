import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, Search, Users, ShieldAlert, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import UserListTable from '@/components/manager/UserListTable'

export default async function ManagerUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // 1. Verifica Ruolo Manager
  const { data: currentUser } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'manager') redirect(`/${locale}/dashboard`)

  // 2. Prendi TUTTI i profili (Atleti e Coach)
  // Nota: usiamo un alias per coach_id per capire chi è il coach attuale
  const { data: allUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  // 3. Estrai la lista dei soli Coach (per il dropdown)
  const coachesList = allUsers?.filter(u => u.role === 'coach') || []

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      {/* Intestazione */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-600/10 text-purple-600 rounded-xl">
            <Briefcase size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold font-oswald uppercase leading-none">Quartier Generale</h1>
            <p className="text-xs text-muted-foreground">Gestione centralizzata del personale.</p>
        </div>
      </div>

      {/* Tabella Interattiva (Componente Client) */}
      <UserListTable 
        users={allUsers || []} 
        coaches={coachesList} 
        locale={locale} 
      />
    </div>
  )
}