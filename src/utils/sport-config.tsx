import { 
  Activity, Bike, Footprints, Waves, Dumbbell, 
  Trophy, Mountain, CircleDot, Timer, HeartPulse,
  Gamepad2, Dribbble, Sword
} from 'lucide-react'

// Mappa estesa delle icone
export const AVAILABLE_ICONS = [
  { key: 'run', icon: Footprints, label: 'Corsa' },
  { key: 'walk', icon: Footprints, label: 'Camminata' },
  { key: 'bike', icon: Bike, label: 'Bici' },
  { key: 'swim', icon: Waves, label: 'Nuoto' },
  { key: 'dumbbell', icon: Dumbbell, label: 'Pesi/Gym' },
  { key: 'ball', icon: Dribbble, label: 'Sport Palla' },
  { key: 'tennis', icon: CircleDot, label: 'Racchetta' },
  { key: 'mountain', icon: Mountain, label: 'Montagna' },
  { key: 'boxing', icon: Sword, label: 'Combattimento' },
  { key: 'yoga', icon: Activity, label: 'Flex/Yoga' },
  { key: 'rowing', icon: Waves, label: 'Remi' },
  { key: 'trophy', icon: Trophy, label: 'Gara' },
  { key: 'cardio', icon: HeartPulse, label: 'Cardio' },
  { key: 'generic', icon: Timer, label: 'Altro' },
]

export const getSportIcon = (key: string) => {
  const found = AVAILABLE_ICONS.find(i => i.key === key)
  return found ? found.icon : Activity
}