'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleUserRole(currentRole: string, userId: string, locale: string) {
  const supabase = await createClient()

  const newRole = currentRole === 'coach' ? 'athlete' : 'coach'

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Errore cambio ruolo:', error)
    return
  }

  // Ricarica la pagina per mostrare la nuova dashboard
  revalidatePath('/', 'layout')
}