import Link from 'next/link'
import { Calendar, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

// Funzione helper per ottenere colore se manca dal DB (opzionale)
const getSportColor = (sport: any) => sport?.color_hex || '#cbd5e1';

export default function WorkoutCard({ workout, locale }: { workout: any, locale: string }) {
  const borderColor = getSportColor(workout.sports);
  const isCompleted = workout.status === 'completed';

  return (
    <div 
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-3 relative group transition-all hover:shadow-md"
      style={{ borderLeftWidth: '6px', borderLeftColor: borderColor }}
    >
      <Link href={`/${locale}/dashboard/report/${workout.id}`} className="block p-4">
        
        {/* Intestazione: Data e Stato */}
        <div className="flex justify-between items-start mb-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
             <Calendar size={12} />
             {new Date(workout.scheduled_date).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          
          {isCompleted ? (
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={10} /> COMPLETATA
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle size={10} /> DA ESEGUIRE
            </span>
          )}
        </div>

        {/* Titolo e Sport */}
        <div className="mb-3">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
            {workout.title}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: borderColor }}>
            {workout.sports?.name || 'Allenamento'}
          </span>
        </div>

        {/* Ordini del capitano (Anteprima) */}
        <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-border mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Ordini del Capitano:</p>
            <p className="text-sm text-foreground/80 line-clamp-2">
                {workout.planned_description}
            </p>
        </div>
        
        {/* Footer Card */}
        <div className="mt-3 flex items-center justify-end text-primary text-xs font-bold uppercase tracking-wide">
            {isCompleted ? 'Modifica Rapporto' : 'Rapporto Missione'} <ChevronRight size={14} />
        </div>
      </Link>
    </div>
  )
}