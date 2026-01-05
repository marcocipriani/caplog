import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, ArrowRightLeft, Trash2, Users } from 'lucide-react'
import { removeAthlete, transferAthlete } from '@/actions/coach-actions'

export default async function ManageAthletesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'coach') {
    redirect(`/${locale}/dashboard`)
  }

  const { data: myAthletes } = await supabase
    .from('profiles')
    .select('*')
    .eq('coach_id', user.id)

  const { data: allCoaches } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'coach')
    .neq('id', user.id)

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-600/10 text-blue-600 rounded-xl">
            <Users size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold font-oswald uppercase leading-none">Gestione Squadra</h1>
            <p className="text-xs text-muted-foreground">Assegna o rimuovi atleti dal comando</p>
        </div>
      </div>

      <div className="space-y-4">
        {myAthletes?.map((athlete) => (
          <div key={athlete.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold font-oswald text-foreground">
                {athlete.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg leading-none truncate">{athlete.full_name}</h3>
                <p className="text-xs text-muted-foreground truncate">{athlete.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 pt-3 border-t border-border">
              
              <form action={transferAthlete} className="flex gap-2 w-full">
                <input type="hidden" name="athleteId" value={athlete.id} />
                <div className="relative flex-1">
                    <select 
                        name="newCoachId" 
                        required
                        className="w-full appearance-none bg-secondary/50 hover:bg-secondary rounded-xl px-4 py-3 text-xs font-bold border border-transparent focus:border-primary outline-none transition-colors"
                    >
                        <option value="" disabled selected>Trasferisci a...</option>
                        {allCoaches?.map(c => (
                            <option key={c.id} value={c.id}>{c.full_name}</option>
                        ))}
                    </select>
                    <ArrowRightLeft size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <button type="submit" className="p-3 bg-secondary hover:bg-primary hover:text-white rounded-xl transition-colors">
                    <ArrowRightLeft size={18} />
                </button>
              </form>

              <form action={removeAthlete}>
                <input type="hidden" name="athleteId" value={athlete.id} />
                <button 
                    type="submit" 
                    className="w-full h-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} />
                    <span className="sm:hidden">Rimuovi</span>
                </button>
              </form>

            </div>
          </div>
        ))}

        {myAthletes?.length === 0 && (
            <div className="text-center p-12 bg-card border border-dashed border-border rounded-3xl">
                <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-bold uppercase">Nessuna recluta assegnata</p>
                <p className="text-xs text-muted-foreground mt-1">Le nuove reclute appariranno qui quando assegnate.</p>
            </div>
        )}
      </div>
    </div>
  )
}