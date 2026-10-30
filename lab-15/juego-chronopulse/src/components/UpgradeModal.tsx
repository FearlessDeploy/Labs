import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Sword, RefreshCw } from 'lucide-react';
import { Upgrade } from '../types/game';

interface UpgradeModalProps {
  isOpen: boolean;
  options: Upgrade[];
  language: 'es' | 'en';
  rerollsAvailable: number;
  onSelect: (upgrade: Upgrade) => void;
  onReroll: () => void;
  onSkip: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  options,
  language,
  rerollsAvailable,
  onSelect,
  onReroll,
  onSkip,
}) => {
  if (!isOpen) return null;

  const getRarityColors = (rarity: Upgrade['rarity']) => {
    switch (rarity) {
      case 'synergy':
        return {
          border: 'border-[#C9A96E]',
          bg: 'bg-[#050505]',
          glow: 'shadow-[0_0_20px_rgba(201,169,110,0.25)]',
          badge: 'bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/40',
          text: 'text-[#C9A96E]',
        };
      case 'legendary':
        return {
          border: 'border-[#C9A96E]/80',
          bg: 'bg-[#050505]',
          glow: 'shadow-[0_0_15px_rgba(201,169,110,0.15)]',
          badge: 'bg-[#C9A96E]/15 text-[#C9A96E] border border-[#C9A96E]/30',
          text: 'text-[#C9A96E]',
        };
      case 'epic':
        return {
          border: 'border-white/30',
          bg: 'bg-[#050505]',
          glow: 'shadow-md',
          badge: 'bg-white/10 text-white/90 border border-white/20',
          text: 'text-white/90',
        };
      case 'rare':
        return {
          border: 'border-[#C9A96E]/30',
          bg: 'bg-[#050505]',
          glow: 'shadow-sm',
          badge: 'bg-[#C9A96E]/10 text-[#C9A96E] border border-[#C9A96E]/20',
          text: 'text-[#C9A96E]',
        };
      default:
        return {
          border: 'border-white/10',
          bg: 'bg-[#050505]',
          glow: '',
          badge: 'bg-white/5 text-white/50 border border-white/10',
          text: 'text-[#E0E0E0]',
        };
    }
  };

  return (
    <AnimatePresence>
      <div id="upgrade-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="upgrade-modal-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-4xl bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col items-center"
        >
          {/* Encabezado */}
          <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E] animate-pulse" />
            <span className="text-[10px] font-medium tracking-[0.25em] uppercase">
              {language === 'es' ? 'MATRIZ DE MEJORAS CUÁNTICAS' : 'QUANTUM UPGRADE MATRIX'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight text-[#E0E0E0] mb-6 text-center">
            {language === 'es' ? 'Elige tu Evolución Táctica' : 'Select Your Tactical Evolution'}
          </h2>

          {/* Matriz de cartas de mejora */}
          <div id="upgrade-cards-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-6">
            {options.map((upgrade) => {
              const colors = getRarityColors(upgrade.rarity);
              return (
                <motion.button
                  key={upgrade.id}
                  id={`upgrade-card-${upgrade.id}`}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(upgrade)}
                  className={`relative flex flex-col text-left p-5 rounded-2xl ${colors.bg} border ${colors.border} ${colors.glow} hover:border-[#C9A96E] cursor-pointer transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-medium px-2.5 py-0.5 rounded-md ${colors.badge}`}>
                      {upgrade.rarity}
                    </span>
                    <span className="text-[10px] font-mono text-white/40">
                      {upgrade.level > 0 ? `LVL ${upgrade.level} → ${upgrade.level + 1}` : (language === 'es' ? 'NUEVO' : 'NEW')}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#C9A96E] group-hover:scale-105 transition-transform">
                      {upgrade.rarity === 'synergy' ? (
                        <Zap className="w-4 h-4 text-[#C9A96E]" />
                      ) : upgrade.rarity === 'legendary' ? (
                        <Sparkles className="w-4 h-4 text-[#C9A96E]" />
                      ) : (
                        <Sword className="w-4 h-4 text-[#C9A96E]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-serif text-base leading-tight text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors">
                        {language === 'es' ? upgrade.nameEs : upgrade.name}
                      </h3>
                      <span className="text-[10px] text-white/40 font-mono">
                        Tier {upgrade.tier}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-white/50 leading-relaxed mt-2 flex-1 font-light">
                    {language === 'es' ? upgrade.descriptionEs : upgrade.description}
                  </p>

                  {upgrade.synergyRequires && (
                    <div className="mt-3 pt-2 border-t border-[#C9A96E]/20 text-[10px] text-[#C9A96E] flex items-center gap-1 font-medium tracking-wide">
                      <Sparkles className="w-3 h-3 text-[#C9A96E]" />
                      {language === 'es' ? '¡Sinergia Activa Combinada!' : 'Synergy Combined Power!'}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Controles inferiores */}
          <div className="flex items-center justify-between w-full border-t border-white/10 pt-4">
            <button
              id="btn-reroll-upgrades"
              disabled={rerollsAvailable <= 0}
              onClick={onReroll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-[0.15em] font-medium border transition-colors cursor-pointer ${
                rerollsAvailable > 0
                  ? 'bg-white/5 hover:bg-[#C9A96E]/10 border-white/10 hover:border-[#C9A96E]/40 text-white/80 hover:text-[#C9A96E]'
                  : 'bg-white/5 border-transparent text-white/20 cursor-not-allowed'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>{language === 'es' ? `Recargar (${rerollsAvailable})` : `Reroll (${rerollsAvailable})`}</span>
            </button>

            <button
              id="btn-skip-upgrade"
              onClick={onSkip}
              className="text-xs uppercase tracking-[0.15em] font-medium text-white/40 hover:text-white/80 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Saltar (+500 Puntos)' : 'Skip (+500 Points)'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
