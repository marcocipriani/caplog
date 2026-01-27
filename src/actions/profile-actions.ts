'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// 1. Aggiorna Dati Base (Nome)
export async function updateProfileData(formData: FormData) {
  const supabase = await createClient()
  const fullName = formData.get('fullName') as string
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  revalidatePath('/dashboard/profile')
}

// 2. Aggiorna Avatar (Dopo upload client-side)
export async function updateAvatarUrl(publicUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  revalidatePath('/dashboard/profile')
}

// 3. Downgrade (Da Coach ad Atleta) - PERICOLOSO
export async function downgradeToAthlete() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // A. Scollega tutti gli atleti di questo coach (rimangono orfani, ma non cancellati)
  await supabase
    .from('profiles')
    .update({ coach_id: null })
    .eq('coach_id', user.id)

  // B. Cambia ruolo in 'athlete'
  await supabase
    .from('profiles')
    .update({ role: 'athlete' })
    .eq('id', user.id)

  // C. Aggiorna Cookie
  const cookieStore = await cookies()
  cookieStore.set('caplog_active_role', 'athlete')

  revalidatePath('/', 'layout')
}

export async function assignCoach(coachId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Non autorizzato' }

  const { error } = await supabase
    .from('profiles')
    .update({ coach_id: coachId })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard/chat') // Aggiorna anche la chat
  return { success: true }
}

export async function removeCoach() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Non autorizzato' }

  const { error } = await supabase
    .from('profiles')
    .update({ coach_id: null })
    .eq('id', user.id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/profile')
  return { success: true }
}