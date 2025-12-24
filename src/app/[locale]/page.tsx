import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white p-4">
      {/* Container Centrale */}
      <div className="text-center space-y-6 max-w-md">
        
        {/* Mascotte */}
        <div className="relative w-40 h-40 mx-auto drop-shadow-[0_0_15px_rgba(255,87,34,0.5)]">
           {/* Assicurati di aver messo l'immagine in public/cap-mascot.png */}
          <Image 
            src="/cap-mascot.png" 
            alt="CapLog Mascot" 
            fill 
            className="object-contain"
          />
        </div>

        {/* Titolo e Motto */}
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            CAP<span className="text-[#FF5722]">LOG</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg italic">
            "Your Run. His Orders. One Log."
          </p>
        </div>

        {/* Pulsante CTA */}
        <button className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-4 px-8 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-orange-900/20">
          ACCEDI ALL'AREA TRAINING
        </button>

        <p className="text-xs text-gray-600 mt-8">
          Powered by V2 Max Engine
        </p>
      </div>
    </main>
  );
}