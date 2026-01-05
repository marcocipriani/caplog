import Link from 'next/link'
import { Calendar, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

const getSportColor = (sport: any) => sport?.color_hex || '#cbd5e1';

export default function WorkoutCard({ workout, locale }: { workout: any, locale: string }) {
  const borderColor = getSportColor(workout.sports);
  const isCompleted = workout.status === 'completed';

  return (
    <div 
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-3 relative group transition-all hover:shadow-md w-full"
      style={{ borderLeftWidth: '6px', borderLeftColor: borderColor }}
    >
      <Link href={`/${locale}/dashboard/report/${workout.id}`} className="block p-4">
        
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground flex items-center gap-1 min-w-0">
             <Calendar size={12} className="shrink-0" />
             <span className="truncate">
               {new Date(workout.scheduled_date).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}
             </span>
          </div>
          
          <div className="shrink-0">
            {isCompleted ? (
              <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> FATTO
              </span>
            ) : (
              <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle size={10} /> MISSIONE
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {workout.title}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: borderColor }}>
            {workout.sports?.name || 'Allenamento'}
          </span>
        </div>

        <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-border mb-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Ordini:</p>
            <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed">
                {workout.planned_description}
            </p>
        </div>
        
        <div className="mt-2 flex items-center justify-end text-primary text-[10px] font-bold uppercase tracking-wide">
            {isCompleted ? 'Dettagli' : 'Inizia Missione'} <ChevronRight size={12} />
        </div>
      </Link>
    </div>
  )
}