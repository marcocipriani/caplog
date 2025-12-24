'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitWorkoutReport(formData: FormData) {
  const supabase = await createClient()

  const workoutId = formData.get('workoutId') as string
  const distance = formData.get('distance')
  const duration = formData.get('duration')
  const rpe = formData.get('rpe')
  const link = formData.get('link')
  const notes = formData.get('notes')
  const isPartial = formData.get('isPartial') === 'on' 
  const locale = formData.get('locale') as string

  const { error } = await supabase
    .from('workouts')
    .update({
      actual_distance: distance ? parseFloat(distance as string) : null,
      actual_duration: duration ? parseInt(duration as string) : null,
      rpe: rpe ? parseInt(rpe as string) : null,
      is_partial: isPartial,
      activity_link: link as string,
      athlete_feedback: notes as string,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', workoutId)

  if (error) {
    console.error('ERRORE SUPABASE:', error.message)
    throw new Error(`Errore Tecnico: ${error.message}`)
  }

  revalidatePath(`/${locale}/dashboard`)
  redirect(`/${locale}/dashboard`)
}