import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ShieldAlert, Sparkles, Sword, Zap, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  language: 'es' | 'en';
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  language,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      titleEs: '1. Dilatación Temporal (Bullet-Time)',
      titleEn: '1. Time-Dilation (Bullet-Time)',
      icon: <Clock className="w-7 h-7 text-[#C9A96E]" />,
      descEs: 'Mantén presionado SHIFT para ralentizar el tiempo al 10% consumiendo energía del Core. Úsalo como recurso táctico activo para esquivar ráfagas a alta velocidad, reaccionar a emboscadas y calcular ángulos de corte perfectos.',
      descEn: 'Hold SHIFT to slow time to 10% speed by consuming Core energy. Use this active tactical resource to weave through intense bullet hell storms and line up precision blade reflections.',
      accent: 'border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]',
    },
    {
      titleEs: '2. Hoja Orbital & Lanzamiento Cinético',
      titleEn: '2. Orbital Blade & Kinetic Slingshot',
      icon: <Sword className="w-7 h-7 text-[#C9A96E]" />,
      descEs: 'Tu dron está conectado por un rayo de resonancia a una o varias hojas afiladas que orbitan en rotación continua. Haz Click Izquierdo o Toca la pantalla hacia donde apuntes para lanzar la hoja en un corte devastador de largo alcance.',
      descEn: 'Your ship is tethered to razor-sharp resonant blades that orbit around you. Left Click or Tap anywhere to slingshot your blade outwards in a high-damage piercing strike.',
      accent: 'border-white/20 bg-white/5 text-white/90',
    },
    {
      titleEs: '3. Desvío & Reflejo Prismático',
      titleEn: '3. Deflection & Prism Reflection',
      icon: <ShieldAlert className="w-7 h-7 text-[#C9A96E]" />,
      descEs: '¡Corta los proyectiles enemigos con tu hoja para reflejarlos! Las balas reflejadas se vuelven hiper-veloces, obtienen daño masivo y multiplican tu racha de combo (2x, 4x, 8x, 16x) otorgando puntuaciones colosales.',
      descEn: 'Slash through incoming enemy bullets with your blade to reflect them! Deflected bullets convert into supercharged prism bolts with massive damage and increase your combo multiplier.',
      accent: 'border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]',
    },
    {
      titleEs: '4. Sinergias Cuánticas & Roguelite',
      titleEn: '4. Quantum Synergies & Roguelite Perks',
      icon: <Sparkles className="w-7 h-7 text-[#C9A96E]" />,
      descEs: 'Recoge fragmentos cuánticos para subir de nivel y desbloquear mejoras como Redes Eléctricas Tesla, Fantasmas Temporales, Agujeros Negros de Singularidad e Ignición Térmica. ¡Combina perks compatibles para desatar Sinergias legendarias!',
      descEn: 'Collect quantum energy shards to level up and unlock upgrades like Tesla Chain Lightning, Chrono Ghost Phantoms, Black Hole Singularities, and Thermal Burn. Combine perks to unlock special Synergies!',
      accent: 'border-white/20 bg-white/5 text-[#C9A96E]',
    },
  ];

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <div id="tutorial-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="tutorial-dialog"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-[#C9A96E] font-medium text-[10px] tracking-[0.25em] uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'MANUAL DE COMBATE TÁCTICO' : 'TACTICAL COMBAT MANUAL'}</span>
            </div>

            <button
              id="btn-close-tutorial"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contenido del paso */}
          <div className="my-6 flex flex-col items-center text-center">
            <div className={`p-4 rounded-2xl border mb-4 ${step.accent} shadow-md`}>
              {step.icon}
            </div>

            <h3 className="text-xl font-serif text-[#E0E0E0] mb-2.5">
              {language === 'es' ? step.titleEs : step.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-md font-light">
              {language === 'es' ? step.descEs : step.descEn}
            </p>
          </div>

          {/* Indicador de páginas */}
          <div className="flex justify-center items-center gap-2 mb-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === currentStep ? 'w-6 bg-[#C9A96E]' : 'w-1.5 bg-white/10 hover:bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              id="btn-tutorial-prev"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              className={`flex items-center gap-1 text-xs uppercase tracking-[0.15em] font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                currentStep === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'es' ? 'Anterior' : 'Previous'}</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                id="btn-tutorial-next"
                onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center gap-1 text-xs font-serif font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#b89555] text-black transition-colors cursor-pointer shadow-md shadow-[#C9A96E]/20"
              >
                <span>{language === 'es' ? 'Siguiente' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-tutorial-finish"
                onClick={onClose}
                className="flex items-center gap-1 text-xs font-serif font-bold uppercase tracking-[0.15em] px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#b89555] text-black transition-colors cursor-pointer shadow-md shadow-[#C9A96E]/20"
              >
                <span>{language === 'es' ? 'Comenzar Misión' : 'Launch Simulation'}</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
