'use client'

import { useState } from 'react'
import { Search, User, Shield, Briefcase, ArrowRightLeft } from 'lucide-react'
import Image from 'next/image'
import { updateCoachAssignment } from '@/actions/manager-actions'

interface Props {
  users: any[]
  coaches: any[]
  locale: string
}

export default function UserListTable({ users, coaches, locale }: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all') // all, athlete, coach

  // Logica di Filtraggio
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  // Gestione Cambio Coach
  const handleCoachChange = async (athleteId: string, newCoachId: string) => {
    // Feedback visivo immediato o toast qui se vuoi
    await updateCoachAssignment(athleteId, newCoachId)
  }

  return (
    <div className="space-y-4">
      
      {/* BARRA DI RICERCA E FILTRI */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
                type="text" 
                placeholder="Cerca nome o email..." 
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex bg-card border border-border rounded-xl p-1 shrink-0">
            {['all', 'athlete', 'coach'].map((role) => (
                <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
                        filterRole === role ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {role === 'all' ? 'Tutti' : role}
                </button>
            ))}
        </div>
      </div>

      {/* LISTA UTENTI */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
            <div key={user.id} className="bg-card border border-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
                
                {/* Info Utente */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-oswald font-bold overflow-hidden shrink-0">
                        {user.avatar_url ? <Image src={user.avatar_url} width={40} height={40} alt="av" /> : user.full_name?.[0]}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm truncate">{user.full_name}</h3>
                            {/* Badge Ruolo Piccolo */}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-black ${
                                user.role === 'manager' ? 'bg-purple-500/10 text-purple-600' :
                                user.role === 'coach' ? 'bg-blue-500/10 text-blue-600' :
                                'bg-orange-500/10 text-orange-600'
                            }`}>
                                {user.role === 'manager' ? 'GEST' : user.role === 'coach' ? 'COACH' : 'ATL'}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>

                {/* Assegnazione Coach (Solo per Atleti) */}
                {user.role === 'athlete' && (
                    <div className="sm:w-64 shrink-0">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Assegnato a:</label>
                        <div className="relative">
                            <select 
                                className="w-full bg-secondary/50 border border-transparent hover:border-purple-500 rounded-lg py-2 pl-3 pr-8 text-xs font-bold appearance-none cursor-pointer outline-none transition-all"
                                value={user.coach_id || 'unassigned'}
                                onChange={(e) => handleCoachChange(user.id, e.target.value)}
                            >
                                <option value="unassigned" className="text-red-500">⚠ Nessun Coach</option>
                                <hr />
                                {coaches.map(coach => (
                                    <option key={coach.id} value={coach.id}>
                                        Coach {coach.full_name}
                                    </option>
                                ))}
                            </select>
                            <ArrowRightLeft size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>
        ))}

        {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm uppercase">
                Nessun personale trovato nei registri.
            </div>
        )}
      </div>
    </div>
  )
}