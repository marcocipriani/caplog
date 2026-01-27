import Link from 'next/link'
import { Calendar, ChevronRight, CheckCircle2, AlertCircle, User, Shield } from 'lucide-react'
import { getSportIcon } from '@/utils/sport-config'

export default function WorkoutCard({ workout, locale }: { workout: any, locale: string }) {
  const sport = workout.sports || {}
  const color = sport.color_hex || '#cbd5e1'
  const isCompleted = workout.status === 'completed'
  const isCoachOrder = workout.origin === 'coach' // DISTINZIONE FONDAMENTALE

  const Icon = getSportIcon(sport.icon_key)

  return (
    <div 
      className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-3 relative group transition-all w-full"
      style={{ borderLeftWidth: '6px', borderLeftColor: color }}
    >
      <Link href={`/${locale}/dashboard/report/${workout.id}`} className="block p-4">
        
        {/* HEADER: Data + Badge Origine */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1 min-w-0">
             <Calendar size={12} className="shrink-0" />
             <span className="truncate">
               {new Date(workout.scheduled_date).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}
             </span>
          </div>
          
          <div className="shrink-0 flex gap-1">
            {/* BADGE ORIGINE: Coach vs Atleta */}
            {isCoachOrder ? (
                <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                    <Shield size={8} /> COACH
                </span>
            ) : (
                <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
                    <User size={8} /> EXTRA
                </span>
            )}

            {isCompleted ? (
              <span className="text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> FATTO
              </span>
            ) : (
              <span className="text-[9px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle size={10} /> DA FARE
              </span>
            )}
          </div>
        </div>

        {/* CONTENUTO */}
        <div className="flex items-start gap-3 mb-2">
            <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ backgroundColor: color }}
            >
                <Icon size={20} />
            </div>
            <div>
                <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {workout.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                    {sport.name || 'Allenamento'} • {sport.type}
                </span>
            </div>
        </div>

        {/* DESCRIZIONE (Solo se coach order o c'è descrizione) */}
        {workout.planned_description && (
            <div className="bg-muted/30 p-2 rounded-lg border border-dashed border-border mb-1 mt-2">
                <p className="text-[10px] text-foreground/80 line-clamp-2 leading-relaxed italic">
                    "{workout.planned_description}"
                </p>
            </div>
        )}
        
        {/* FOOTER */}
        <div className="mt-2 flex items-center justify-end text-primary text-[10px] font-bold uppercase tracking-wide">
             Vedi Dettagli <ChevronRight size={12} />
        </div>
      </Link>
    </div>
  )
}