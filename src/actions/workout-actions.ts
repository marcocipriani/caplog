'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateWorkoutReport(formData: FormData) {
  const supabase = await createClient()

  // Recupero dati nascosti
  const workoutId = formData.get('workoutId') as string
  const locale = formData.get('locale') as string
  
  // Dati Form
  const activityLink = formData.get('activityLink') as string
  const distance = formData.get('distance')
  const duration = formData.get('duration')
  const isPartial = formData.get('isPartial') === 'on' // Checkbox restituisce 'on' se checkato
  
  const rpe = formData.get('rpe')
  const feedback = formData.get('feedback') as string
  const weather = formData.get('weather') as string
  const nutrition = formData.get('nutrition') as string
  const shoeId = formData.get('shoeId') as string
  
  // Preparazione Update DB
  const updates = {
    // Dati tecnici eseguiti
    activity_link: activityLink,
    actual_distance: distance ? parseFloat(distance as string) : null,
    actual_duration: duration ? parseInt(duration as string) : null,
    is_partial: isPartial,

    // Dati debriefing
    rpe: rpe ? parseInt(rpe as string) : null,
    athlete_feedback: feedback,
    weather_notes: weather,
    nutrition_notes: nutrition,
    shoe_id: shoeId ? parseInt(shoeId) : null,
    
    // Stato finale
    status: 'completed',
    completed_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('workouts')
    .update(updates)
    .eq('id', workoutId)

  if (error) {
    console.error('ERRORE UPDATE REPORT:', error.message)
    throw new Error(`Errore salvataggio: ${error.message}`)
  }

  // Aggiorna cache
  revalidatePath(`/${locale}/dashboard`)
  revalidatePath(`/${locale}/dashboard/report/${workoutId}`)
  
  redirect(`/${locale}/dashboard`)
}