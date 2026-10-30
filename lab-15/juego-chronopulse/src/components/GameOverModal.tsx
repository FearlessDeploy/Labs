import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Home, Trophy, Skull, Flame, Activity } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  wave: number;
  combo: number;
  kills: number;
  isNewHighScore: boolean;
  language: 'es' | 'en';
  playerName?: string;
  onRetry: () => void;
  onHome: () => void;
  onOpenLeaderboard?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps & { isOpen: boolean }> = ({
  isOpen,
  score,
  wave,
  combo,
  kills,
  isNewHighScore,
  language,
  playerName,
  onRetry,
  onHome,
  onOpenLeaderboard,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="game-over-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        {/* Capa de líneas de escaneo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="game-over-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col items-center text-center"
        >
          {/* Icono de calavera */}
          <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-4 shadow-lg">
            <Skull className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-medium tracking-[0.25em] uppercase text-rose-400/80 mb-1">
            {language === 'es' ? 'NEXO CRÍTICO DESCONECTADO' : 'CRITICAL NEXUS OVERRUN'}
          </span>

          <h2 className="text-3xl font-serif text-[#E0E0E0] mb-6">
            {language === 'es' ? 'Fin de la Simulación' : 'Simulation Terminated'}
          </h2>

          {isNewHighScore && (
            <div className="mb-4 px-4 py-1.5 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/50 text-[#C9A96E] text-xs font-serif font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-[#C9A96E]" />
              {language === 'es' ? '¡NUEVO RÉCORD HISTÓRICO!' : 'NEW HIGH SCORE!'}
            </div>
          )}

          {/* Desglose de estadísticas */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#C9A96E]" />
                {language === 'es' ? 'Puntuación' : 'Score'}
              </div>
              <div className="text-lg font-serif font-bold text-[#C9A96E]">
                {score.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
                <Activity className="w-3 h-3 text-white/70" />
                {language === 'es' ? 'Sector' : 'Sector'}
              </div>
              <div className="text-lg font-mono font-bold text-white/90">
                {wave}
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#C9A96E]" />
                {language === 'es' ? 'Mayor Racha' : 'Max Streak'}
              </div>
              <div className="text-lg font-mono font-bold text-[#C9A96E]">
                {combo}x
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 rounded-xl p-3">
              <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.15em] mb-0.5 flex items-center gap-1">
                <Skull className="w-3 h-3 text-rose-400" />
                {language === 'es' ? 'Bajas' : 'Eliminations'}
              </div>
              <div className="text-lg font-mono font-bold text-white/90">
                {kills}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2.5 w-full">
            <button
              id="btn-game-over-retry"
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#b89555] text-black font-serif font-bold tracking-[0.2em] text-xs uppercase transition-colors cursor-pointer shadow-[0_0_20px_rgba(201,169,110,0.2)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'es' ? 'REINTENTAR SIMULACIÓN' : 'RETRY SIMULATION'}</span>
            </button>

            {onOpenLeaderboard && (
              <button
                id="btn-game-over-leaderboard"
                onClick={onOpenLeaderboard}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] text-xs uppercase tracking-[0.15em] font-serif font-semibold transition-colors cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{language === 'es' ? 'Ver Salón de la Fama' : 'View Hall of Fame'}</span>
              </button>
            )}

            <button
              id="btn-game-over-home"
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
