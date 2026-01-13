import { 
  Activity, Bike, Footprints, Waves, Dumbbell, 
  Trophy, Zap, Mountain, Goal, Target, Timer, HeartPulse 
} from 'lucide-react'

// Mappa delle icone disponibili per la creazione dello sport
export const AVAILABLE_ICONS = [
  { key: 'run', icon: Footprints, label: 'Corsa' },
  { key: 'bike', icon: Bike, label: 'Bici' },
  { key: 'swim', icon: Waves, label: 'Nuoto' },
  { key: 'gym', icon: Dumbbell, label: 'Palestra' },
  { key: 'activity', icon: Activity, label: 'Generico' },
  { key: 'trophy', icon: Trophy, label: 'Gara' },
  { key: 'zap', icon: Zap, label: 'Potenza' },
  { key: 'mountain', icon: Mountain, label: 'Salita' },
  { key: 'goal', icon: Goal, label: 'Tecnica' },
  { key: 'target', icon: Target, label: 'Precisione' },
  { key: 'timer', icon: Timer, label: 'Tempo' },
  { key: 'cardio', icon: HeartPulse, label: 'Cardio' },
]

// Helper per ottenere l'icona dinamicamente
export const getSportIcon = (key: string) => {
  const found = AVAILABLE_ICONS.find(i => i.key === key)
  return found ? found.icon : Activity
}