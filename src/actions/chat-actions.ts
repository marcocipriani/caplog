'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Invia Messaggio
export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  const content = formData.get('content') as string
  const receiverId = formData.get('receiverId') as string
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('messages').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: content
  })

  revalidatePath('/dashboard/chat')
}

// Segna messaggi come letti (aprendo la chat)
export async function markAsRead(senderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('messages')
    .update({ is_read: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', user.id)
    .eq('is_read', false)
  
  revalidatePath('/dashboard/chat')
}

// Ottieni numero messaggi non letti (per l'Header)
export async function getUnreadCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false)

  return count || 0
}