'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { switchUserRole } from '@/actions/user-actions'
import { updateProfileData, updateAvatarUrl, downgradeToAthlete } from '@/actions/profile-actions'
import { Camera, Edit2, Check, X, Shield, Dumbbell, AlertTriangle, ChevronRight, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProfileManagerProps {
  user: any
  profile: any
  activeRole: string
  locale: string
}

export default function ProfileManager({ user, profile, activeRole, locale }: ProfileManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showDowngradeModal, setShowDowngradeModal] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const isRealCoach = profile?.role === 'coach'

  // --- GESTIONE UPLOAD IMMAGINE ---
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    setIsUploading(true)
    
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    // 1. Upload su Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars') // Assicurati che questo bucket esista su Supabase e sia pubblico
      .upload(fileName, file)

    if (!uploadError) {
      // 2. Ottieni URL Pubblico
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      // 3. Salva nel DB
      await updateAvatarUrl(publicUrl)
    }
    setIsUploading(false)
  }

  // --- SWITCH VISIVO RUOLO ---
  const handleRoleSwitch = async (targetRole: 'coach' | 'athlete') => {
    if (activeRole === targetRole) return // Già attivo
    await switchUserRole(locale, targetRole)
  }

  return (
    <div className="space-y-6">
      
      {/* --- CARD PRINCIPALE (HEADER + EDIT) --- */}
      <div className="bg-card border border-border rounded-3xl p-6 relative overflow-hidden shadow-sm">
        {/* Sfondo dinamico in base al ruolo attivo */}
        <div className={`absolute top-0 left-0 w-full h-24 opacity-10 ${activeRole === 'coach' ? 'bg-blue-600' : 'bg-orange-500'}`} />

        <div className="relative z-10 flex flex-col items-center">
            
            {/* AVATAR CON UPLOAD */}
            <div className="relative group">
                <div className="w-28 h-28 rounded-full border-4 border-background shadow-2xl overflow-hidden bg-secondary">
                    {profile?.avatar_url ? (
                        <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground font-oswald">
                            {profile?.full_name?.[0]}
                        </div>
                    )}
                </div>
                {/* Bottone Upload (visibile on hover o click) */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                    {isUploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera size={16} />}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    className="hidden" 
                    accept="image/*"
                />
            </div>

            {/* DATI UTENTE (EDITABILI) */}
            {isEditing ? (
                <form action={async (formData) => { await updateProfileData(formData); setIsEditing(false) }} className="w-full mt-4 space-y-3 animate-in fade-in">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Nome in Codice</label>
                        <input 
                            name="fullName" 
                            defaultValue={profile?.full_name} 
                            className="w-full bg-secondary p-2 rounded-lg text-center font-oswald font-bold uppercase"
                        />
                    </div>
                    {/* Nota sulla mail */}
                    <div className="opacity-50 pointer-events-none">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Canale (Email)</label>
                        <input defaultValue={user?.email} className="w-full bg-secondary p-2 rounded-lg text-center text-sm" readOnly />
                    </div>
                    
                    <div className="flex gap-2 justify-center mt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-secondary"><X size={20} /></button>
                        <button type="submit" className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20"><Check size={20} /></button>
                    </div>
                </form>
            ) : (
                <div className="text-center mt-4 group relative w-full">
                    <h2 className="text-2xl font-bold font-oswald uppercase">{profile?.full_name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="absolute top-0 right-0 sm:right-10 p-2 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* --- SWITCHER RUOLI (SOLO PER COACH) --- */}
      {isRealCoach && (
        <div>
            <h3 className="text-xs font-bold uppercase text-muted-foreground ml-2 mb-2">Stato Operativo</h3>
            <div className="grid grid-cols-2 gap-3">
                {/* CARD ATLETA */}
                <button
                    onClick={() => handleRoleSwitch('athlete')}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden group
                        ${activeRole === 'athlete' 
                            ? 'bg-orange-500 text-white border-orange-600 shadow-lg ring-2 ring-orange-500 ring-offset-2' 
                            : 'bg-card border-border text-muted-foreground hover:bg-orange-500/5 hover:border-orange-500/30 grayscale hover:grayscale-0'
                        }`}
                >
                    <Dumbbell size={24} className={activeRole === 'athlete' ? 'animate-pulse' : ''} />
                    <span className="font-bold font-oswald uppercase text-sm">Atleta</span>
                    {activeRole === 'athlete' && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                </button>

                {/* CARD COACH */}
                <button
                    onClick={() => handleRoleSwitch('coach')}
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 overflow-hidden group
                        ${activeRole === 'coach' 
                            ? 'bg-blue-600 text-white border-blue-700 shadow-lg ring-2 ring-blue-600 ring-offset-2' 
                            : 'bg-card border-border text-muted-foreground hover:bg-blue-600/5 hover:border-blue-600/30 grayscale hover:grayscale-0'
                        }`}
                >
                    <Shield size={24} className={activeRole === 'coach' ? 'animate-pulse' : ''} />
                    <span className="font-bold font-oswald uppercase text-sm">Coach</span>
                    {activeRole === 'coach' && <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
                </button>
            </div>
        </div>
      )}

      {/* --- PREFERENZE & PERICOLO --- */}
      <div className="space-y-4 pt-4">
        
        {/* Esempio Preferenze */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
             <button className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors border-b border-border">
                <div className="flex items-center gap-3">
                    <User size={18} className="text-muted-foreground"/>
                    <span className="text-sm font-bold uppercase">Dati Biometrici</span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
             </button>
             {/* Qui potresti aggiungere link a Lingua, Notifiche, etc */}
        </div>

        {/* DOWNGRADE COACH -> ATLETA */}
        {isRealCoach && (
             <button 
                onClick={() => setShowDowngradeModal(true)}
                className="w-full p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-600 flex items-center justify-between hover:bg-red-500/10 transition-colors"
             >
                <div className="flex items-center gap-3">
                    <AlertTriangle size={18} />
                    <div className="text-left">
                        <span className="block text-xs font-bold uppercase">Rinuncia al comando</span>
                        <span className="block text-[10px] opacity-70">Torna al grado di semplice Atleta</span>
                    </div>
                </div>
             </button>
        )}
      </div>

      {/* --- MODALE DOWNGRADE --- */}
      {showDowngradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 relative">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-2">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold font-oswald uppercase text-red-600">Attenzione Soldato!</h2>
                    <p className="text-sm text-muted-foreground">
                        Stai per rinunciare al grado di Coach. <br/>
                        <strong>Tutti gli atleti sotto il tuo comando verranno lasciati senza guida (orfani).</strong>
                        <br/><br/>
                        Questa azione è irreversibile.
                    </p>
                    <div className="grid grid-cols-2 gap-3 w-full mt-4">
                        <button onClick={() => setShowDowngradeModal(false)} className="py-3 rounded-xl border font-bold uppercase text-xs">Annulla</button>
                        <button 
                            onClick={async () => { await downgradeToAthlete(); setShowDowngradeModal(false); }}
                            className="py-3 rounded-xl bg-red-600 text-white font-bold uppercase text-xs hover:bg-red-700"
                        >
                            Confermo Rinuncia
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}