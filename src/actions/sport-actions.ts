'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addSport(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const icon_key = formData.get('icon_key') as string
  const color_hex = formData.get('color_hex') as string

  if (!name || !icon_key) return { error: 'Dati mancanti' }

  const { error } = await supabase
    .from('sports')
    .insert({ name, icon_key, color_hex })

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/manager/sports')
  return { success: true }
}

export async function deleteSport(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('sports')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/manager/sports')
  return { success: true }
}