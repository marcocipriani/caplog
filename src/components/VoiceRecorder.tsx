'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Play, Trash2, StopCircle } from 'lucide-react'

interface Props {
  onAudioRecorded: (audioBlob: Blob | null) => void
}

export default function VoiceRecorder({ onAudioRecorded }: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onAudioRecorded(blob) // Passa il file al padre
        
        // Ferma tutti i track del microfono
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Errore accesso microfono:', err)
      alert('Impossibile accedere al microfono. Verifica i permessi.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const deleteRecording = () => {
    setAudioUrl(null)
    onAudioRecorded(null)
  }

  return (
    <div className="w-full bg-card border border-border rounded-xl p-3 flex items-center justify-between gap-3">
      
      {!audioUrl ? (
        // STATO: PRONTO O IN REGISTRAZIONE
        <div className="flex items-center gap-3 w-full">
          <button
            type="button" // Importante: type button per non inviare il form
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
          </button>
          
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {isRecording ? 'Registrazione in corso...' : 'Tocca per registrare nota vocale'}
          </span>
        </div>
      ) : (
        // STATO: REGISTRATO (ANTEPRIMA)
        <div className="flex items-center gap-2 w-full">
          <audio src={audioUrl} controls className="h-8 flex-1 w-full max-w-[200px]" />
          
          <button
            type="button"
            onClick={deleteRecording}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
          
          <span className="text-xs text-green-600 font-bold ml-auto uppercase">
            Pronto all'invio
          </span>
        </div>
      )}
    </div>
  )
}