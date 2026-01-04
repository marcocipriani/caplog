'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWorkout(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'coach') {
    throw new Error('Accesso Negato: Solo il Coach può assegnare allenamenti.')
  }

  const athleteId = formData.get('athleteId') as string
  const sportId = formData.get('sportId') as string
  const date = formData.get('date') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const notes = formData.get('notes') as string
  const locale = formData.get('locale') as string

  const audioFile = formData.get('audioFile') as File | null
  let audioPublicUrl = null

  if (audioFile && audioFile.size > 0) {
    const fileExt = 'webm'
    const fileName = `${user.id}/${Date.now()}-note.${fileExt}`
    
    const { error: uploadError } = await supabase
      .storage
      .from('workout-audio')
      .upload(fileName, audioFile, {
        upsert: false
      })

    if (!uploadError) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('workout-audio')
        .getPublicUrl(fileName)
        
      audioPublicUrl = publicUrl
    }
  }

  const { error } = await supabase
    .from('workouts')
    .insert({
      coach_id: user.id,
      athlete_id: athleteId,
      sport_id: parseInt(sportId), 
      scheduled_date: date,
      title: title,
      planned_description: description,
      coach_notes: notes,
      audio_note_url: audioPublicUrl,
      status: 'scheduled'
    })

  if (error) {
    throw new Error('Errore durante la trasmissione degli ordini.')
  }

  revalidatePath(`/${locale}/dashboard`)
  redirect(`/${locale}/dashboard`)
}