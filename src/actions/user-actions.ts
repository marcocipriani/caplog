'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function switchUserRole(userId: string, newRole: 'coach' | 'athlete') {
  const supabase = await createClient()

  // 1. Aggiorna il ruolo nel DB
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    throw new Error('Impossibile cambiare grado, soldato.')
  }

  // 2. Ricarica la pagina per mostrare le nuove opzioni
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/profile')
}