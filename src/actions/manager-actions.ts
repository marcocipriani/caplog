'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Assegna o Rimuovi un Coach a un atleta
export async function updateCoachAssignment(athleteId: string, newCoachId: string | null) {
  const supabase = await createClient()
  
  // Verifica sicurezza: Chi sta facendo la richiesta è un Manager?
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: currentUser } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUser?.role !== 'manager') {
    throw new Error('Accesso Negato: Richiesto livello Gestore.')
  }

  // Esegui l'aggiornamento (se newCoachId è "unassigned", passiamo null)
  const coachIdToSet = newCoachId === 'unassigned' ? null : newCoachId

  await supabase
    .from('profiles')
    .update({ coach_id: coachIdToSet })
    .eq('id', athleteId)

  revalidatePath('/dashboard/manager/users')
}