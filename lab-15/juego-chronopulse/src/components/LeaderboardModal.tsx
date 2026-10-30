import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, X, Medal, Shield, Skull, Clock, User, Sparkles, Filter, ChevronRight } from 'lucide-react';
import { GameMode, LeaderboardEntry } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  entries: LeaderboardEntry[];
  currentScore?: number;
  currentWave?: number;
  currentCombo?: number;
  currentKills?: number;
  currentMode?: GameMode;
  playerName: string;
  language: 'es' | 'en';
  onClose: () => void;
  onUpdatePlayerName: (name: string) => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  entries,
  playerName,
  language,
  onClose,
  onUpdatePlayerName,
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | GameMode>('all');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(playerName);

  if (!isOpen) return null;

  const competitiveEntries = entries.filter((e) => e.mode !== 'sandbox');

  const filteredEntries = competitiveEntries.filter((e) => {
    if (selectedTab === 'all') return true;
    return e.mode === selectedTab;
  });

  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed.length > 0) {
      onUpdatePlayerName(trimmed);
    }
    setIsEditingName(false);
  };

  const getModeBadge = (mode: GameMode) => {
    switch (mode) {
      case 'boss_rush':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/50 text-rose-400">
            <Skull className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'es' ? 'Titanes' : 'Titans'}</span>
          </span>
        );
      case 'time_attack':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-800/50 text-sky-400">
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'es' ? 'Contrarreloj' : 'Time Attack'}</span>
          </span>
        );
      case 'sandbox':
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/50 text-purple-400">
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">Matrix</span>
          </span>
        );
      case 'survival':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[#C9A96E]/10 border border-[#C9A96E]/40 text-[#C9A96E]">
            <Shield className="w-3 h-3" />
            <span className="hidden sm:inline">{language === 'es' ? 'Supervivencia' : 'Survival'}</span>
          </span>
        );
    }
  };

  return (
    <AnimatePresence>
      <div id="leaderboard-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        {/* Capa de líneas de escaneo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="leaderboard-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col"
        >
          {/* Encabezado */}
          <div className="shrink-0 flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] shadow-[0_0_15px_rgba(201,169,110,0.15)]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#E0E0E0] flex items-center gap-2">
                  <span>{language === 'es' ? 'Salón de la Fama Cuántica' : 'Quantum Hall of Fame'}</span>
                </h2>
                <p className="text-xs text-white/40 font-light">
                  {language === 'es'
                    ? 'Clasificación global de pilotos y récords del Nexo Temporal.'
                    : 'Global pilot rankings & high scores across all continuous timeline sectors.'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-leaderboard"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Banner de identificación del piloto */}
          <div className="shrink-0 my-3 p-3.5 rounded-2xl bg-[#030303] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/20 border border-[#C9A96E]/40 text-[#C9A96E] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] font-mono text-white/40">
                  {language === 'es' ? 'TU DISTINTIVO DE PILOTO' : 'YOUR PILOT CALLSIGN'}
                </div>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      maxLength={18}
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      className="px-3 py-1 text-sm bg-black border border-[#C9A96E] rounded-lg text-white font-serif outline-none focus:ring-1 focus:ring-[#C9A96E]"
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-3 py-1 text-xs bg-[#C9A96E] text-black font-semibold rounded-lg hover:bg-white cursor-pointer transition-colors"
                    >
                      {language === 'es' ? 'Guardar' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-serif text-base text-[#C9A96E] font-bold">
                      {playerName}
                    </span>
                    <button
                      onClick={() => {
                        setTempName(playerName);
                        setIsEditingName(true);
                      }}
                      className="text-[11px] text-white/40 hover:text-[#C9A96E] underline cursor-pointer transition-colors"
                    >
                      {language === 'es' ? 'Cambiar nombre' : 'Edit name'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/50 font-mono bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>{language === 'es' ? 'Récords registrados:' : 'Logged entries:'} <strong className="text-white">{competitiveEntries.length}</strong></span>
            </div>
          </div>

          {/* Pestañas de filtrado de modos */}
          <div className="shrink-0 mb-3 p-1.5 rounded-2xl bg-[#030303] border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-inner">
            <button
              id="btn-filter-all"
              onClick={() => setSelectedTab('all')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-serif tracking-[0.08em] uppercase transition-all cursor-pointer text-center ${selectedTab === 'all'
                  ? 'bg-[#C9A96E] text-black font-bold shadow-md shadow-[#C9A96E]/20'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Todos' : 'All Modes'}</span>
            </button>
            <button
              id="btn-filter-survival"
              onClick={() => setSelectedTab('survival')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-serif tracking-[0.08em] uppercase transition-all cursor-pointer text-center ${selectedTab === 'survival'
                  ? 'bg-[#C9A96E] text-black font-bold shadow-md shadow-[#C9A96E]/20'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Supervivencia' : 'Survival'}</span>
            </button>
            <button
              id="btn-filter-boss-rush"
              onClick={() => setSelectedTab('boss_rush')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-serif tracking-[0.08em] uppercase transition-all cursor-pointer text-center ${selectedTab === 'boss_rush'
                  ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
            >
              <Skull className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Titanes' : 'Titans'}</span>
            </button>
            <button
              id="btn-filter-time-attack"
              onClick={() => setSelectedTab('time_attack')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-serif tracking-[0.08em] uppercase transition-all cursor-pointer text-center ${selectedTab === 'time_attack'
                  ? 'bg-sky-500 text-black font-bold shadow-md shadow-sky-500/20'
                  : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Contrarreloj' : 'Time Attack'}</span>
            </button>
          </div>

          {/* Tabla de puntuaciones */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-white/30 text-xs font-mono">
                {language === 'es' ? 'No hay registros en esta categoría.' : 'No entries logged in this category yet.'}
              </div>
            ) : (
              filteredEntries.map((entry, index) => {
                const isTop1 = index === 0;
                const isTop2 = index === 1;
                const isTop3 = index === 2;
                const isCurrentPlayer = entry.isPlayer || entry.playerName === playerName;

                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${isCurrentPlayer
                        ? 'bg-[#C9A96E]/10 border-[#C9A96E]/60 shadow-[0_0_15px_rgba(201,169,110,0.15)]'
                        : isTop1
                          ? 'bg-[#050505] border-[#C9A96E]/40 shadow-sm'
                          : 'bg-[#050505] border-white/5 hover:border-white/15'
                      }`}
                  >
                    {/* Izquierda: Rango y Nombre */}
                    <div className="flex items-center gap-3">
                      {/* Icono de rango / posición */}
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0">
                        {isTop1 ? (
                          <div className="w-full h-full rounded-xl bg-amber-400 text-black flex items-center justify-center shadow-md shadow-amber-400/30">
                            <Medal className="w-4 h-4" />
                          </div>
                        ) : isTop2 ? (
                          <div className="w-full h-full rounded-xl bg-slate-300 text-black flex items-center justify-center">
                            2
                          </div>
                        ) : isTop3 ? (
                          <div className="w-full h-full rounded-xl bg-amber-700 text-white flex items-center justify-center">
                            3
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs">#{index + 1}</span>
                        )}
                      </div>

                      {/* Detalles del jugador */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-serif text-sm font-bold ${isCurrentPlayer ? 'text-[#C9A96E]' : 'text-[#E0E0E0]'}`}>
                            {entry.playerName}
                          </span>
                          {isCurrentPlayer && (
                            <span className="text-[9px] font-mono uppercase bg-[#C9A96E] text-black px-1.5 py-0.2 rounded font-bold">
                              {language === 'es' ? 'TÚ' : 'YOU'}
                            </span>
                          )}
                          {getModeBadge(entry.mode)}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-mono mt-0.5">
                          <span>{language === 'es' ? 'Sector' : 'Sector'}: <strong className="text-white/80">{entry.wave}</strong></span>
                          <span>•</span>
                          <span>{language === 'es' ? 'Racha' : 'Combo'}: <strong className="text-[#C9A96E]">{entry.combo}x</strong></span>
                          <span>•</span>
                          <span>{language === 'es' ? 'Bajas' : 'Kills'}: <strong className="text-white/80">{entry.kills}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Derecha: Puntuación y Fecha */}
                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-serif font-bold text-[#C9A96E]">
                        {entry.score.toLocaleString()} <span className="text-[10px] font-mono text-white/30">PTS</span>
                      </div>
                      <div className="text-[10px] text-white/30 font-mono">
                        {entry.date}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Nota al pie */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <span className="text-[11px] font-mono">
              {language === 'es' ? 'Los récords se actualizan automáticamente al finalizar cada partida.' : 'Scores save automatically upon run completion.'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-serif uppercase tracking-[0.1em] cursor-pointer"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
