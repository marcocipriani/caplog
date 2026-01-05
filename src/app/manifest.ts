import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CapLog Training System',
    short_name: 'CapLog',
    description: 'Il sistema di allenamento definitivo per coach e atleti.',
    start_url: '/',
    display: 'standalone', // Nasconde la barra del browser
    background_color: '#09090b', // Colore di sfondo (Dark)
    theme_color: '#f97316', // Colore primario (Arancione Atleta)
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/maskable-icon.png', // Icona adattabile (Android)
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: "Login",
        url: "/it/login",
        description: "Accedi al sistema"
      },
      {
        name: "Oggi",
        url: "/it/dashboard/schedule",
        description: "Vedi allenamento di oggi"
      }
    ]
  }
}