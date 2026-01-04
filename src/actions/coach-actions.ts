'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function createWorkout(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 1. Verifica ruolo (la colonna 'role' esiste in public.profiles)
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'coach') {
    throw new Error('Accesso Negato: Solo il Coach può assegnare allenamenti.')
  }

  // Estrazione Dati
  const athleteId = formData.get('athleteId') as string
  const sportId = formData.get('sportId') as string // Questo arriva come stringa dal form
  const date = formData.get('date') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const notes = formData.get('notes') as string
  const locale = formData.get('locale') as string

  // GESTIONE AUDIO UPLOAD
  const audioFile = formData.get('audioFile') as File | null
  let audioPublicUrl = null

  if (audioFile && audioFile.size > 0) {
    const fileExt = 'webm' // O estrai dal tipo file
    const fileName = `${user.id}/${Date.now()}-note.${fileExt}` // Crea un path unico
    
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('workout-audio') // Nome del bucket creato prima
      .upload(fileName, audioFile, {
        upsert: false
      })

    if (uploadError) {
      console.error('Upload audio fallito:', uploadError)
      // Decidi se bloccare tutto o continuare senza audio. Qui continuiamo.
    } else {
      // Ottieni URL pubblico
      const { data: { publicUrl } } = supabase
        .storage
        .from('workout-audio')
        .getPublicUrl(fileName)
        
      audioPublicUrl = publicUrl
    }
}

  // 2. Inserimento DB (Adattato al tuo schema REALE)
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
    console.error('Errore creazione workout:', error)
    throw new Error('Errore durante la trasmissione degli ordini.')
  }

  revalidatePath(`/${locale}/dashboard`)
  redirect(`/${locale}/dashboard`)
}