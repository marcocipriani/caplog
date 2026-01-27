'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSport(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const icon_key = formData.get('icon_key') as string
  const color_hex = formData.get('color_hex') as string
  
  // Gestione opzionale tipo
  const type = formData.get('type') as string || 'outdoor'
  const created_by = formData.get('created_by') as string

  if (!name || !icon_key) return { error: 'Dati mancanti' }

  // Se creato da utente, non è di sistema
  const is_system = !created_by 

  const { error } = await supabase
    .from('sports')
    .insert({ 
        name, 
        icon_key, 
        color_hex, 
        type, 
        is_system, 
        created_by: created_by || null 
    })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/manager/sports')
  revalidatePath('/dashboard/athlete/add')
  return { success: true }
}

export async function deleteSport(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sports').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/manager/sports')
  return { success: true }
}

// NUOVA FUNZIONE PER I PREFERITI
export async function toggleUserSport(sportId: number, isSelected: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorizzato' }

  if (isSelected) {
    // Rimuovi
    const { error } = await supabase
      .from('user_sports')
      .delete()
      .eq('user_id', user.id)
      .eq('sport_id', sportId)
    if (error) return { error: error.message }
  } else {
    // Aggiungi
    const { error } = await supabase
      .from('user_sports')
      .insert({ user_id: user.id, sport_id: sportId })
    if (error) return { error: error.message }
  }

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard/athlete/add')
  return { success: true }
}