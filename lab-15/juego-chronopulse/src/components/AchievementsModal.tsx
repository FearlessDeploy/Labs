import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, CheckCircle, Lock, X } from 'lucide-react';
import { Achievement } from '../types/game';

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  language: 'es' | 'en';
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  achievements,
  language,
  onClose,
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <AnimatePresence>
      <div id="achievements-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="achievements-dialog"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[85vh] bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#E0E0E0]">
                  {language === 'es' ? 'Logros & Reconocimientos' : 'Achievements & Badges'}
                </h2>
                <p className="text-xs text-white/40 font-mono">
                  {unlockedCount} / {achievements.length} {language === 'es' ? 'Desbloqueados' : 'Unlocked'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-achievements"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lista de logros */}
          <div className="overflow-y-auto pr-1 my-4 flex flex-col gap-3">
            {achievements.map((ach) => {
              const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
              return (
                <div
                  key={ach.id}
                  id={`achievement-row-${ach.id}`}
                  className={`p-4 rounded-2xl border transition-all ${
                    ach.unlocked
                      ? 'bg-[#050505] border-[#C9A96E]/50 shadow-[0_0_15px_rgba(201,169,110,0.06)]'
                      : 'bg-[#050505]/60 border-white/5 opacity-60'
                  } flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        ach.unlocked
                          ? 'bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40'
                          : 'bg-white/5 text-white/30 border border-white/10'
                      }`}
                    >
                      {ach.unlocked ? <CheckCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm text-[#E0E0E0]">
                          {language === 'es' ? ach.titleEs : ach.title}
                        </h4>
                        {ach.unlocked && (
                          <span className="text-[9px] bg-[#C9A96E]/20 text-[#C9A96E] font-bold px-2 py-0.5 rounded-full border border-[#C9A96E]/30 uppercase tracking-widest">
                            {language === 'es' ? 'COMPLETADO' : 'COMPLETE'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 mt-0.5 font-light">
                        {language === 'es' ? ach.descriptionEs : ach.description}
                      </p>

                      {/* Barra de progreso */}
                      {!ach.unlocked && ach.maxProgress > 1 && (
                        <div className="w-full mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-[#C9A96E] transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">
                            {ach.progress}/{ach.maxProgress}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
