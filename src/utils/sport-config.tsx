import { Bike, Footprints, Activity, Dumbbell, Waves } from "lucide-react";

// Definisci i tipi di sport supportati
export type SportType = 'ciclismo' | 'corsa' | 'palestra' | 'nuoto' | 'altro';

export const SPORT_CONFIG: Record<SportType, { 
  label: string; 
  color: string;      // Colore sfondo
  textColor: string;  // Colore testo
  borderColor: string;
  icon: any; 
}> = {
  ciclismo: {
    label: "Ciclismo",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    icon: Bike,
  },
  corsa: {
    label: "Corsa",
    color: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    icon: Footprints,
  },
  palestra: {
    label: "Palestra",
    color: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    icon: Dumbbell,
  },
  nuoto: {
    label: "Nuoto",
    color: "bg-cyan-100",
    textColor: "text-cyan-700",
    borderColor: "border-cyan-200",
    icon: Waves,
  },
  altro: {
    label: "Altro",
    color: "bg-gray-100",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    icon: Activity,
  },
};

// Helper per ottenere la config in sicurezza (fallback su 'altro')
export const getSportConfig = (sport: string) => {
  const key = sport?.toLowerCase() as SportType;
  return SPORT_CONFIG[key] || SPORT_CONFIG['altro'];
};