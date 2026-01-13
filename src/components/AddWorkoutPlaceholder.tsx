import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function AddWorkoutPlaceholder({ locale }: { locale: string }) {
  return (
    <Link 
      href={`/${locale}/dashboard/coach/add`} // O una pagina specifica per atleta se diversa
      className="group block w-full"
    >
      <div className="h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-transparent hover:bg-secondary/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer">
         <div className="w-8 h-8 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Plus size={18} className="text-muted-foreground group-hover:text-primary" />
         </div>
         <span className="text-xs font-bold uppercase text-muted-foreground group-hover:text-primary transition-colors">
            Aggiungi Extra
         </span>
      </div>
    </Link>
  )
}