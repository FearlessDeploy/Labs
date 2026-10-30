import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  wave: number;
  combo: number;
  kills: number;
  language: 'es' | 'en';
  onRetry: () => void;
  onHome: () => void;
  onOpenLeaderboard?: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps & { isOpen: boolean }> = ({
  isOpen,
  score,
  wave,
  combo,
  kills,
  language,
  onRetry,
  onHome,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C9A96E', '#FFFFFF', '#E5C07B', '#8C7853'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="victory-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="victory-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#080808] border border-[#C9A96E] rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(201,169,110,0.2)] relative z-10 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#C9A96E]/20 border border-[#C9A96E] flex items-center justify-center text-[#C9A96E] mb-4 shadow-[0_0_20px_rgba(201,169,110,0.3)]">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-[#C9A96E] mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'es' ? 'TRIUNFO CUÁNTICO ABSOLUTO' : 'ABSOLUTE QUANTUM VICTORY'}
          </span>

          <h2 className="text-3xl font-serif text-[#E0E0E0] mb-2">
            {language === 'es' ? 'Nexo Purificado' : 'Nexus Cleared'}
          </h2>

          <p className="text-xs text-white/50 mb-6 font-light">
            {language === 'es'
              ? 'Has sincronizado el flujo temporal y neutralizado a todos los titanes del continuo.'
              : 'You have mastered the time stream and defeated all sector titans.'}
          </p>

          {/* Desglose de estadísticas */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5">
                {language === 'es' ? 'Puntuación Final' : 'Final Score'}
              </div>
              <div className="text-lg font-serif font-bold text-[#C9A96E]">
                {score.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5">
                {language === 'es' ? 'Sectores' : 'Sectors'}
              </div>
              <div className="text-lg font-mono font-bold text-white/90">
                {wave}
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5">
                {language === 'es' ? 'Mayor Racha' : 'Max Streak'}
              </div>
              <div className="text-lg font-mono font-bold text-[#C9A96E]">
                {combo}x
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5">
                {language === 'es' ? 'Bajas' : 'Total Kills'}
              </div>
              <div className="text-lg font-mono font-bold text-white/90">
                {kills}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2.5 w-full">
            <button
              id="btn-victory-retry"
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#b89555] text-black font-serif font-bold tracking-[0.2em] text-xs uppercase transition-colors cursor-pointer shadow-[0_0_20px_rgba(201,169,110,0.25)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'es' ? 'JUGAR OTRA VEZ' : 'PLAY AGAIN'}</span>
            </button>

            {onOpenLeaderboard && (
              <button
                id="btn-victory-leaderboard"
                onClick={onOpenLeaderboard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs uppercase tracking-[0.15em] font-serif font-semibold transition-colors cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Ver Salón de la Fama' : 'View Hall of Fame'}</span>
              </button>
            )}

            <button
              id="btn-victory-home"
              onClick={onHome}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Menú Principal' : 'Main Menu'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
