// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false) // Toggle tra Login e Registrazione
  
  const router = useRouter()
  const supabase = createClient()

  // Funzione principale: Login o Registrazione
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (isSignUp) {
      // REGISTRAZIONE
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // Salviamo il nome completo nei metadati (opzionale per ora usiamo la mail)
            data: { full_name: email.split('@')[0] } 
        }
      })
      if (error) {
        setMessage(`Errore: ${error.message}. Fai 10 flessioni e riprova.`)
      } else {
        setMessage('Controlla la tua email per confermare. Muoviti!')
      }
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage('Password errata. Sicuro di essere un atleta?')
      } else {
        router.push('/dashboard') // Reindirizza alla dashboard (che faremo dopo)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] p-4">
      
      {/* Mascotte che ti guarda male */}
      <div className="relative w-32 h-32 mb-6 drop-shadow-[0_0_10px_rgba(255,87,34,0.3)]">
        <Image 
            src="/cap-mascot.png" 
            alt="Cap Mascot" 
            fill 
            className="object-contain"
        />
      </div>

      <div className="w-full max-w-md bg-[#1E1E1E] border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {isSignUp ? 'Reclutamento' : 'Identificati'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isSignUp 
              ? "Entra nella squadra. Non si torna indietro." 
              : "Bentornato. Spero tu abbia riposato."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#FF5722] uppercase mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121212] border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#FF5722] transition-colors"
              placeholder="tuonome@atleta.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-[#FF5722] uppercase mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#121212] border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:border-[#FF5722] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Messaggi di Errore/Successo */}
          {message && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('Errore') || message.includes('errata') ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}>
              <AlertCircle size={16} />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'ISCRIVITI' : 'ACCEDI')}
          </button>
        </form>

        {/* Toggle Login/Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {isSignUp ? "Hai già un account?" : "Non sei ancora nel team?"}{" "}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
            className="text-white underline hover:text-[#FF5722] font-bold"
          >
            {isSignUp ? "Accedi" : "Registrati"}
          </button>
        </div>
      </div>
    </div>
  )
}