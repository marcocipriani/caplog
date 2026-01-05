import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Send, User, Radio, ArrowLeft } from 'lucide-react'
import { sendMessage, markAsRead } from '@/actions/chat-actions'
import Image from 'next/image'
import Link from 'next/link'

export default async function ChatPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>,
  searchParams: Promise<{ userId?: string }> 
}) {
  const { locale } = await params
  const { userId: targetUserId } = await searchParams // Selezionato dal Coach
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}/login`)

  // 1. Dati Utente Corrente
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. LOGICA: Con chi parlo?
  let chatPartnerId = null
  let showInbox = false

  if (profile.role === 'athlete') {
    // Se sono atleta, parlo col mio coach
    chatPartnerId = profile.coach_id
    if (!chatPartnerId) {
       return <div className="p-8 text-center text-muted-foreground font-oswald uppercase">Nessun Coach Assegnato. Impossibile stabilire contatto radio.</div>
    }
  } else {
    // Se sono coach...
    if (targetUserId) {
        // ...e ho selezionato un utente, parlo con lui
        chatPartnerId = targetUserId
    } else {
        // ...altrimenti mostro la INBOX
        showInbox = true
    }
  }

  // --- VISTA INBOX (SOLO COACH) ---
  if (showInbox) {
    // Prendi tutti gli atleti assegnati
    const { data: myAthletes } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .eq('coach_id', user.id)

    // Prendi contatori messaggi non letti per ogni atleta (query grezza per velocità)
    const { data: unreadMessages } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .eq('is_read', false)

    return (
        <div className="max-w-2xl mx-auto p-4 pb-24 min-h-screen">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-xl"><Radio size={24} /></div>
                <div>
                    <h1 className="text-2xl font-bold font-oswald uppercase">Canali Radio Attivi</h1>
                    <p className="text-xs text-muted-foreground">Seleziona una recluta per aprire il canale.</p>
                </div>
            </div>

            <div className="space-y-2">
                {myAthletes?.map(athlete => {
                    const unreadCount = unreadMessages?.filter(m => m.sender_id === athlete.id).length || 0
                    return (
                        <Link 
                            key={athlete.id} 
                            href={`/${locale}/dashboard/chat?userId=${athlete.id}`}
                            className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:bg-secondary/50 transition-colors"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold font-oswald overflow-hidden">
                                    {athlete.avatar_url ? <Image src={athlete.avatar_url} fill alt="av" className="object-cover"/> : athlete.full_name[0]}
                                </div>
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-background">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold uppercase text-sm">{athlete.full_name}</h3>
                                <p className="text-xs text-muted-foreground">{athlete.email}</p>
                            </div>
                            <div className="text-xs font-bold uppercase text-muted-foreground">Apri</div>
                        </Link>
                    )
                })}
                {myAthletes?.length === 0 && <p className="text-center text-muted-foreground py-8">Nessuna recluta assegnata.</p>}
            </div>
        </div>
    )
  }

  // --- VISTA CHAT (ATLETA O COACH SELEZIONATO) ---
  
  // 1. Segna messaggi come letti
  await markAsRead(chatPartnerId)

  // 2. Recupera Info Partner
  const { data: partner } = await supabase.from('profiles').select('*').eq('id', chatPartnerId).single()

  // 3. Recupera Messaggi
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},receiver_id.eq.${user.id})`)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      
      {/* HEADER CHAT */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur flex items-center gap-3 shrink-0">
        {profile.role === 'coach' && (
            <Link href={`/${locale}/dashboard/chat`} className="p-2 hover:bg-secondary rounded-full mr-1">
                <ArrowLeft size={20} />
            </Link>
        )}
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold font-oswald overflow-hidden border border-border">
            {partner?.avatar_url ? <Image src={partner.avatar_url} fill alt="av" className="object-cover"/> : partner?.full_name?.[0]}
        </div>
        <div>
            <h2 className="font-bold font-oswald uppercase text-sm leading-none">{partner?.full_name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] uppercase text-muted-foreground tracking-widest">Radio Comms Active</span>
            </div>
        </div>
      </div>

      {/* MESSAGGI (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => {
            const isMe = msg.sender_id === user.id
            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                        isMe 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-secondary text-secondary-foreground rounded-tl-none'
                    }`}>
                        <p>{msg.content}</p>
                        <p className={`text-[9px] mt-1 text-right opacity-70 uppercase font-bold`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                </div>
            )
        })}
        {messages?.length === 0 && (
            <div className="text-center opacity-30 mt-12">
                <Radio size={48} className="mx-auto mb-2" />
                <p className="font-oswald uppercase">Canale Aperto. Nessuna trasmissione.</p>
            </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div className="p-4 border-t border-border bg-background shrink-0 pb-safe">
        <form action={sendMessage} className="flex gap-2">
            <input type="hidden" name="receiverId" value={chatPartnerId} />
            <input 
                name="content" 
                required 
                autoComplete="off"
                placeholder="Trasmetti messaggio..." 
                className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
            <button type="submit" className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity">
                <Send size={20} />
            </button>
        </form>
      </div>

    </div>
  )
}