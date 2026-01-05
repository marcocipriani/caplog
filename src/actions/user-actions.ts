'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/client'

export async function switchUserRole(locale: string, newRole: 'coach' | 'athlete') {
  const cookieStore = await cookies()
  
  cookieStore.set('caplog_active_role', newRole, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax' 
  })

  revalidatePath('/')
  redirect(`/${locale}`)
}

export async function upgradeToCoach(userId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'coach' })
    .eq('id', userId)

  if (error) throw new Error('Impossibile aggiornare il ruolo')

  const cookieStore = await cookies()
  cookieStore.set('caplog_active_role', 'coach', { path: '/' })

  revalidatePath('/', 'layout')
}