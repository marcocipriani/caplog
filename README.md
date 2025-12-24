# 🪖 CapLog - Your Run. His Orders.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Supabase](https://img.shields.io/badge/Supabase-Database-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

**CapLog** non è il solito diario di allenamento. È il tuo Sergente Istruttore digitale.
Un'applicazione web progressiva che colma il divario tra Coach e Atleta con un'interfaccia rigorosa, motivazionale e tecnicamente avanzata.

## 🚀 Missione

L'obiettivo è semplice: trasformare la pianificazione degli allenamenti da una noiosa tabella Excel a un'esperienza coinvolgente.
Ogni giorno è una **Missione**. Ogni feedback è un **Rapporto**.

## 🛠️ Arsenale Tecnico (Tech Stack)

Il progetto è costruito con le tecnologie più recenti e performanti:

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
-   **Database & Auth:** [Supabase](https://supabase.com/)
-   **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
-   **Lingua:** TypeScript
-   **Internazionalizzazione:** `next-intl` (Supporto IT/EN)
-   **Icone:** Lucide React
-   **Font:** Inter & Oswald (per quel tocco militare)

## ⭐ Funzionalità Chiave

### 🔄 Dual Role System (Coach & Atleta)
Lo stesso account può operare come Coach (per assegnare allenamenti) o come Atleta (per eseguirli). Lo switch è immediato e gestito via Server Actions.

### 📅 Dashboard Operativa
-   Visualizzazione "Missione Odierna" con dettagli tecnici.
-   Feedback visivo immediato (Colori sport, Status completamento).
-   Citazioni motivazionali dinamiche del "Cap".

### 📝 Rapporto Missione (Feedback)
-   Form interattivo con slider RPE (Rate of Perceived Exertion) dinamico.
-   Possibilità di segnare allenamenti come "Parziali".
-   Feedback testuale e link alle attività (Strava/Garmin).

### 🌍 Internazionalizzazione
L'app è completamente tradotta in Italiano e Inglese, con routing automatico (`/it/dashboard`, `/en/dashboard`).

## ⚡ Quick Start (Bootcamp)

Segui questi ordini per far partire il progetto in locale:

1.  **Clona il repository:**
    ```bash
    git clone [https://github.com/marcocipriani/caplog.git](https://github.com/marcocipriani/caplog.git)
    cd caplog
    ```

2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```

3.  **Configura l'ambiente:**
    Rinomina `.env.example` in `.env.local` e inserisci le chiavi di Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=la_tua_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=la_tua_key
    ```

4.  **Lancia il server di sviluppo:**
    ```bash
    npm run dev
    ```

5.  **Apri il browser:**
    Vai su `http://localhost:3000`.

## 🗄️ Database Schema (Supabase)

Il progetto richiede le seguenti tabelle su Supabase:
-   `profiles` (Estensione della tabella `auth.users`)
-   `workouts` (Gestione allenamenti, note, feedback e status)
-   `sports` (Tipologie di sport e colori associati)

*(Assicurati di abilitare RLS e le policy di sicurezza appropriate)*.

## 🤝 Contribuire

Le reclute sono benvenute. Se vuoi aggiungere funzionalità o correggere bug:
1.  Forka il progetto.
2.  Crea un branch (`git checkout -b feature/NuovaArma`).
3.  Commitma le modifiche (`git commit -m 'Aggiunta nuova funzionalità'`).
4.  Pusha sul branch (`git push origin feature/NuovaArma`).
5.  Apri una Pull Request.

---

> *"Riposa soldato. Domani si soffre."* — **Cap**