import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FlaskConical,
  X,
  Plus,
  RotateCcw,
  Zap,
  Sparkles,
  Skull,
  ShieldAlert,
  Trash2,
  Sliders,
  PlayCircle,
  Heart,
  Crosshair,
  Award,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { GameUpgradeStats, Upgrade } from '../types/game';
import { UPGRADES_DATABASE } from '../utils/upgrades';

interface SandboxLabProps {
  isOpen: boolean;
  stats: GameUpgradeStats;
  currentUpgrades: Upgrade[];
  language: 'es' | 'en';
  onClose: () => void;
  onApplyUpgrade: (upgrade: Upgrade) => void;
  onMaxAllPerks?: () => void;
  onResetStats: () => void;
  onToggleInfiniteEnergy: () => void;
  isInfiniteEnergy: boolean;
  onToggleGodMode?: () => void;
  isGodMode?: boolean;
  onSetBladeCount?: (count: number) => void;
}

export const SandboxLab: React.FC<SandboxLabProps> = ({
  isOpen,
  stats,
  currentUpgrades,
  language,
  onClose,
  onApplyUpgrade,
  onMaxAllPerks,
  onResetStats,
  onToggleInfiniteEnergy,
  isInfiniteEnergy,
  onToggleGodMode,
  isGodMode = false,
  onSetBladeCount,
}) => {
  const [activeTab, setActiveTab] = useState<'spawner' | 'cheats' | 'perks'>('spawner');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'offensive' | 'defensive' | 'temporal' | 'orbital'>('all');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [activeBtnId, setActiveBtnId] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerFeedback = (btnId: string, msg: string) => {
    setActiveBtnId(btnId);
    setActionFeedback(msg);
    setTimeout(() => {
      setActiveBtnId((curr) => (curr === btnId ? null : curr));
    }, 900);
    setTimeout(() => {
      setActionFeedback((curr) => (curr === msg ? null : curr));
    }, 2200);
  };

  const emitSandboxAction = (type: string, payload?: Record<string, unknown>) => {
    window.dispatchEvent(
      new CustomEvent('chronopulse_sandbox_action', {
        detail: { type, ...payload },
      })
    );
  };

  const handleToggleGod = () => {
    if (onToggleGodMode) {
      onToggleGodMode();
    } else {
      emitSandboxAction('god_mode', { value: !isGodMode });
    }
    triggerFeedback('god_mode', !isGodMode ? '¡MODO DIOS ACTIVADO (Inmortal)!' : 'Modo Dios Desactivado');
  };

  const handleToggleInfEnergy = () => {
    onToggleInfiniteEnergy();
    triggerFeedback('inf_energy', !isInfiniteEnergy ? '¡ENERGÍA INFINITA ACTIVADA!' : 'Energía Normal Restaurada');
  };

  const handleFullHeal = () => {
    emitSandboxAction('full_heal');
    triggerFeedback('full_heal', '¡Salud & Escudo Restaurados al 100%!');
  };

  const handleSpawnDummy = () => {
    emitSandboxAction('spawn_dummy');
    triggerFeedback('dummy', '¡Blanco Dummy de Pruebas Invocado en la Arena!');
  };

  const handleSpawnBoss = (bossType: string, name: string) => {
    emitSandboxAction('spawn_boss', { bossType });
    triggerFeedback(bossType, `¡${name} Invocado en la Arena!`);
  };

  const handleSpawnEnemies = (enemyType: string, count: number, label: string) => {
    emitSandboxAction('spawn_enemy', { enemyType, count });
    triggerFeedback(`${enemyType}_${count}`, `¡${label} Invocados en la Arena!`);
  };

  const handleClearAll = () => {
    emitSandboxAction('clear_all');
    triggerFeedback('clear_all', '¡Arena Despejada con Pulso EMP Cuántico!');
  };

  const handleSetBlades = (bladeCount: number) => {
    if (onSetBladeCount) {
      onSetBladeCount(bladeCount);
    } else {
      emitSandboxAction('set_blades', { bladeCount });
    }
    triggerFeedback(`blade_${bladeCount}`, `¡Hojas Orbitales fijadas en ${bladeCount}!`);
  };

  const handleInstantLevelUp = () => {
    emitSandboxAction('instant_levelup');
    triggerFeedback('levelup', '¡Subida de Nivel Inmediata Activada!');
  };

  const handleApplyPerk = (up: Upgrade) => {
    onApplyUpgrade(up);
    const perkName = language === 'es' ? up.nameEs : up.name;
    triggerFeedback(up.id, `+1 Nivel Aplicado a: ${perkName}`);
  };

  const handleMaxAll = () => {
    if (onMaxAllPerks) {
      onMaxAllPerks();
      triggerFeedback('max_all', '¡Todas las Mejoras Cuánticas Maximizadas!');
    }
  };

  const handleReset = () => {
    onResetStats();
    triggerFeedback('reset_stats', '¡Estadísticas y Mejoras Restablecidas a Base!');
  };

  const filteredUpgrades = UPGRADES_DATABASE.filter((up) => {
    const nameMatch =
      up.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      up.nameEs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      up.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      up.descriptionEs.toLowerCase().includes(searchQuery.toLowerCase());

    if (!nameMatch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'offensive') return up.id.includes('dmg') || up.id.includes('crit') || up.id.includes('parry') || up.id.includes('blade') || up.id.includes('combo') || up.id.includes('frenzy');
    if (selectedCategory === 'defensive') return up.id.includes('shield') || up.id.includes('def') || up.id.includes('absorb') || up.id.includes('nano') || up.id.includes('plating');
    if (selectedCategory === 'temporal') return up.id.includes('time') || up.id.includes('energy') || up.id.includes('chrono') || up.id.includes('dilation') || up.id.includes('flux');
    if (selectedCategory === 'orbital') return up.id.includes('blade') || up.id.includes('orbit') || up.id.includes('mass') || up.id.includes('resonance');

    return true;
  });

  return (
    <AnimatePresence>
      <div id="sandbox-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="sandbox-dialog"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#080808] border border-purple-900/50 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black relative z-10 flex flex-col"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif text-[#E0E0E0] flex items-center gap-2">
                  <span>{language === 'es' ? 'Laboratorio Matrix' : 'Matrix Quantum Lab'}</span>
                  <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-300">
                    DEBUG / SANDBOX
                  </span>
                </h2>
                <p className="text-[11px] text-white/40 font-light">
                  {language === 'es'
                    ? 'Invocación de Titanes, pruebas libres de física, mejoras y trucos cuánticos.'
                    : 'Titan summoning, free testing, cheats & unlimited quantum perks.'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-sandbox"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {actionFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2.5 py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#080808] border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold truncate">{actionFeedback}</span>
            </motion.div>
          )}

          {/* Solapas de navegación */}
          <div className="flex items-center gap-2 mt-3 pb-2 border-b border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('spawner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-[0.1em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'spawner'
                  ? 'bg-[#C9A96E] text-black font-bold shadow-md shadow-[#C9A96E]/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Invocar Titanes & Hordas' : 'Spawn Entities'}</span>
            </button>

            <button
              onClick={() => setActiveTab('cheats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-[0.1em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cheats'
                  ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Poderes & Matrix Cheats' : 'Matrix Cheats'}</span>
            </button>

            <button
              onClick={() => setActiveTab('perks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-serif tracking-[0.1em] uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'perks'
                  ? 'bg-[#C9A96E] text-black font-bold shadow-md shadow-[#C9A96E]/20'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Inyector de Mejoras' : 'Perks Injector'}</span>
            </button>
          </div>

          {/* Pestaña 1: Invocación */}
          {activeTab === 'spawner' && (
            <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4">
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A96E] mb-2 block">
                  {language === 'es' ? 'Invocar Titanes Supremos (Jefes de Sector):' : 'Summon Supreme Titans (Sector Bosses):'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnBoss('boss_titan', 'TITAN DREADNOUGHT')}
                    className={`p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer border ${
                      activeBtnId === 'boss_titan'
                        ? 'bg-rose-900/60 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-rose-950/30 hover:bg-rose-950/70 border-rose-800/40 hover:border-rose-500'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-rose-300 flex items-center gap-2">
                        <span>TITAN DREADNOUGHT</span>
                        {activeBtnId === 'boss_titan' && <span className="text-[9px] bg-rose-500 text-black px-1.5 py-0.2 rounded font-mono font-bold">¡INVOCADO!</span>}
                      </div>
                      <div className="text-[11px] text-white/50">Láser orbital cuádruple & escudos reflectantes</div>
                    </div>
                    <Skull className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnBoss('boss_weaver', 'CHRONO WEAVER')}
                    className={`p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer border ${
                      activeBtnId === 'boss_weaver'
                        ? 'bg-sky-900/60 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-sky-950/30 hover:bg-sky-950/70 border-sky-800/40 hover:border-sky-500'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-sky-300 flex items-center gap-2">
                        <span>CHRONO WEAVER</span>
                        {activeBtnId === 'boss_weaver' && <span className="text-[9px] bg-sky-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">¡INVOCADO!</span>}
                      </div>
                      <div className="text-[11px] text-white/50">Espirales de distorsión temporal & teletransporte</div>
                    </div>
                    <Skull className="w-5 h-5 text-sky-400 shrink-0 ml-2" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnBoss('boss_hexcore', 'HEX-CORE OVERLORD')}
                    className={`p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer border ${
                      activeBtnId === 'boss_hexcore'
                        ? 'bg-purple-900/60 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                        : 'bg-purple-950/30 hover:bg-purple-950/70 border-purple-800/40 hover:border-purple-500'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-purple-300 flex items-center gap-2">
                        <span>HEX-CORE OVERLORD</span>
                        {activeBtnId === 'boss_hexcore' && <span className="text-[9px] bg-purple-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">¡INVOCADO!</span>}
                      </div>
                      <div className="text-[11px] text-white/50">Barrera prismática hexagonal & misiles guiados</div>
                    </div>
                    <Skull className="w-5 h-5 text-purple-400 shrink-0 ml-2" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnBoss('boss_valkyrie', 'OBSIDIAN VALKYRIE')}
                    className={`p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer border ${
                      activeBtnId === 'boss_valkyrie'
                        ? 'bg-pink-900/60 border-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-pink-950/30 hover:bg-pink-950/70 border-pink-800/40 hover:border-pink-500'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-pink-300 flex items-center gap-2">
                        <span>OBSIDIAN VALKYRIE</span>
                        {activeBtnId === 'boss_valkyrie' && <span className="text-[9px] bg-pink-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">¡INVOCADO!</span>}
                      </div>
                      <div className="text-[11px] text-white/50">Doble espada de plasma & ráfagas sónicas</div>
                    </div>
                    <Skull className="w-5 h-5 text-pink-400 shrink-0 ml-2" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnBoss('boss_singularity', 'APEX NULL-SINGULARITY')}
                    className={`p-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer border sm:col-span-2 ${
                      activeBtnId === 'boss_singularity'
                        ? 'bg-amber-900/60 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-amber-950/30 hover:bg-amber-950/70 border-amber-800/40 hover:border-amber-500'
                    }`}
                  >
                    <div>
                      <div className="font-serif text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                        <span>APEX NULL-SINGULARITY</span>
                        {activeBtnId === 'boss_singularity' && <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-mono font-bold">¡INVOCADO!</span>}
                      </div>
                      <div className="text-[11px] text-white/50">Vórtice gravitatorio negro & supernova letal en anillo</div>
                    </div>
                    <Skull className="w-5 h-5 text-amber-400 shrink-0 ml-2" />
                  </motion.button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 mb-2 block">
                  {language === 'es' ? 'Pruebas de Tiro y Hordas:' : 'Target Practice & Standard Swarms:'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSpawnDummy}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeBtnId === 'dummy'
                        ? 'bg-emerald-900/80 border-emerald-400 text-emerald-200'
                        : 'bg-emerald-950/30 hover:bg-emerald-950/60 border-emerald-700/40 hover:border-emerald-500 text-emerald-300'
                    }`}
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{language === 'es' ? 'Blanco Dummy (25k HP)' : 'Dummy Target (25k HP)'}</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnEnemies('chaser', 5, '5x Enjambre Rápido')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                      activeBtnId === 'chaser_5'
                        ? 'bg-[#C9A96E]/40 border-[#C9A96E] text-white'
                        : 'bg-[#050505] hover:bg-white/10 border-white/10 hover:border-[#C9A96E]/50 text-white/80'
                    }`}
                  >
                    +5 Enjambre Rápido
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnEnemies('shooter', 4, '4x Artilleros Láser')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                      activeBtnId === 'shooter_4'
                        ? 'bg-[#C9A96E]/40 border-[#C9A96E] text-white'
                        : 'bg-[#050505] hover:bg-white/10 border-white/10 hover:border-[#C9A96E]/50 text-white/80'
                    }`}
                  >
                    +4 Artilleros Láser
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnEnemies('pulse_colossus', 2, '2x Colosos de Pulso')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                      activeBtnId === 'pulse_colossus_2'
                        ? 'bg-[#C9A96E]/40 border-[#C9A96E] text-white'
                        : 'bg-[#050505] hover:bg-white/10 border-white/10 hover:border-[#C9A96E]/50 text-white/80'
                    }`}
                  >
                    +2 Colosos de Pulso
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnEnemies('sniper', 3, '3x Francotiradores')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                      activeBtnId === 'sniper_3'
                        ? 'bg-[#C9A96E]/40 border-[#C9A96E] text-white'
                        : 'bg-[#050505] hover:bg-white/10 border-white/10 hover:border-[#C9A96E]/50 text-white/80'
                    }`}
                  >
                    +3 Francotiradores
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSpawnEnemies('elite_juggernaut', 1, '1x Juggernaut Élite')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-mono transition-all cursor-pointer ${
                      activeBtnId === 'elite_juggernaut_1'
                        ? 'bg-[#C9A96E]/40 border-[#C9A96E] text-white'
                        : 'bg-[#050505] hover:bg-white/10 border-white/10 hover:border-[#C9A96E]/50 text-white/80'
                    }`}
                  >
                    +1 Juggernaut Élite
                  </motion.button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClearAll}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 hover:border-rose-500 text-rose-300 font-serif font-bold text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>{language === 'es' ? 'Despejar Toda la Arena (EMP)' : 'Clear Arena (EMP Blast)'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFullHeal}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 hover:border-emerald-500 text-emerald-300 font-serif font-bold text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'es' ? 'Restaurar Salud & Escudo' : 'Full Health & Shield'}</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Pestaña 2: Trucos y estadísticas */}
          {activeTab === 'cheats' && (
            <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleGod}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isGodMode
                      ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-[#050505] hover:bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isGodMode ? 'bg-rose-500 text-black' : 'bg-white/5 text-rose-400'}`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-[#E0E0E0]">
                        {language === 'es' ? 'Modo Dios (Inmortalidad)' : 'God Mode (Invulnerability)'}
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        {language === 'es' ? 'Inmune a balas, láseres y colisiones' : 'No damage from bullets or lasers'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isGodMode ? 'bg-rose-500 text-black border-rose-400' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {isGodMode ? 'ON' : 'OFF'}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleInfEnergy}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isInfiniteEnergy
                      ? 'bg-cyan-950/60 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-[#050505] hover:bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isInfiniteEnergy ? 'bg-cyan-400 text-black' : 'bg-white/5 text-cyan-400'}`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-[#E0E0E0]">
                        {language === 'es' ? 'Energía Temporal Infinita' : 'Infinite Chrono Energy'}
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        {language === 'es' ? 'Ralentización sin límite de duración' : 'Unlimited Matrix bullet-time slow mo'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isInfiniteEnergy ? 'bg-cyan-400 text-black border-cyan-300' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                    {isInfiniteEnergy ? 'ON' : 'OFF'}
                  </span>
                </motion.button>
              </div>

              {onMaxAllPerks && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMaxAll}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    activeBtnId === 'max_all'
                      ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                      : 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-700/40 hover:border-amber-500'
                  }`}
                >
                  <div>
                    <div className="font-serif text-sm font-bold flex items-center gap-2 text-amber-300">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{language === 'es' ? 'Maximizar Todas las Mejoras Cuánticas' : 'Max Out All Perks (God Build)'}</span>
                    </div>
                    <div className="text-[11px] text-white/40 mt-1">
                      {language === 'es' ? 'Aplica nivel máximo a todos los 28+ aumentos' : 'Instantly levels up all 28+ perks to max level'}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 bg-amber-950/60 rounded-lg border border-amber-800/40">
                    MAX ALL
                  </span>
                </motion.button>
              )}

              <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A96E] mb-2 block">
                  {language === 'es' ? 'Configurar Cantidad de Hojas Orbitales en Órbita (1 a 8):' : 'Configure Active Orbital Blade Count (1 to 8):'}
                </span>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSetBlades(num)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        stats.bladeCount === num
                          ? 'bg-[#C9A96E] text-black border-[#C9A96E] shadow-md shadow-[#C9A96E]/20 scale-105'
                          : 'bg-[#080808] border-white/10 text-white/70 hover:text-white hover:border-[#C9A96E]/40 hover:bg-white/5'
                      }`}
                    >
                      {num} {num === 1 ? 'Hoja' : 'Hojas'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstantLevelUp}
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700/50 hover:border-purple-400 text-purple-300 font-serif font-bold text-xs uppercase tracking-[0.15em] transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{language === 'es' ? 'Subir Nivel Inmediato (+Elegir Carta)' : 'Instant Level Up (+Pick Card)'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-serif uppercase tracking-[0.15em] bg-[#050505] hover:bg-rose-950/40 border border-white/10 hover:border-rose-800/60 text-rose-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'es' ? 'Restablecer Base' : 'Reset Base'}</span>
                </motion.button>
              </div>
            </div>
          )}

          {/* Pestaña 3: Inyector de mejoras */}
          {activeTab === 'perks' && (
            <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'es' ? 'Buscar mejora cuántica...' : 'Search quantum perk...'}
                    className="w-full bg-[#050505] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C9A96E]"
                  />
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['all', 'offensive', 'defensive', 'temporal', 'orbital'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-mono tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-[#C9A96E] text-black font-bold'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredUpgrades.map((up) => {
                  const currentLevel = currentUpgrades.find((c) => c.id === up.id)?.level || 0;
                  const isMaxed = currentLevel >= up.maxLevel;
                  const isRecentlyClicked = activeBtnId === up.id;
                  return (
                    <motion.button
                      key={up.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApplyPerk(up)}
                      className={`p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all group cursor-pointer border ${
                        isRecentlyClicked
                          ? 'bg-[#C9A96E]/20 border-[#C9A96E] shadow-md shadow-[#C9A96E]/20'
                          : isMaxed
                          ? 'bg-[#0a0a0a] border-emerald-900/40 hover:border-emerald-500/50'
                          : 'bg-[#050505] hover:bg-[#0c0c0c] border-white/10 hover:border-[#C9A96E]/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-xs text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors truncate">
                            {language === 'es' ? up.nameEs : up.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
                            isMaxed
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                              : currentLevel > 0
                              ? 'bg-[#C9A96E]/20 text-[#C9A96E] border-[#C9A96E]/40'
                              : 'bg-white/5 text-white/40 border-white/5'
                          }`}>
                            L{currentLevel}/{up.maxLevel}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40 mt-0.5 line-clamp-1 font-light">
                          {language === 'es' ? up.descriptionEs : up.description}
                        </p>
                      </div>

                      <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                        isRecentlyClicked
                          ? 'bg-[#C9A96E] text-black'
                          : 'bg-white/5 group-hover:bg-[#C9A96E] group-hover:text-black text-white/40'
                      }`}>
                        <Plus className="w-4 h-4" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pie con resumen de estadísticas */}
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Hojas</div>
              <div className="text-[#C9A96E] font-bold">{stats.bladeCount}</div>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Daño Hoja</div>
              <div className="text-[#C9A96E] font-bold">{Math.round(stats.bladeDamageMultiplier * 100)}%</div>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Reflejos</div>
              <div className="text-white/90 font-bold">+{stats.reflectSplitCount} div</div>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Crítico</div>
              <div className="text-[#C9A96E] font-bold">{Math.round(stats.critChance * 100)}%</div>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Escudo</div>
              <div className="text-white/90 font-bold">{stats.shieldMax} HP</div>
            </div>
            <div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest">Dilatación</div>
              <div className="text-[#C9A96E] font-bold">{Math.round(stats.slowMoDilationFactor * 100)}%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
