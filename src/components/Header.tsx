import { ThemeToggle } from '@/components/ThemeToggle'
import HeaderUser from '@/components/HeaderUser'

interface HeaderProps {
  title: string
  subtitle?: string
  user: {
    id: string
    email?: string
  }
  profile: {
    full_name: string | null
    role: 'coach' | 'athlete'
  } | null
}

export default function Header({ title, subtitle, user, profile }: HeaderProps) {
  const userInitial = profile?.full_name 
    ? profile.full_name[0].toUpperCase() 
    : user.email?.[0].toUpperCase() || 'U'

  const currentRole = profile?.role || 'athlete'

  return (
    <div className="px-6 pt-12 pb-4 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border">
      
      <div className="flex flex-col justify-center">
        {subtitle && (
          <h2 className="text-muted-foreground text-[10px] uppercase tracking-wider font-bold mb-0.5 animate-in fade-in slide-in-from-left-2 duration-500">
            {subtitle}
          </h2>
        )}
        <h1 className="text-2xl font-black font-oswald text-foreground tracking-tight leading-none animate-in fade-in slide-in-from-left-2 duration-700 delay-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          
          <HeaderUser 
              userInitial={userInitial} 
              role={currentRole} 
              userId={user.id} 
          />
      </div>
    </div>
  )
}