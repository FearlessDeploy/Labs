import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Zap,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Skull,
  Clock,
  FlaskConical,
  Trophy,
  Sword,
  ShieldPlus,
  ShieldAlert,
  Wind,
  Target,
  Magnet,
  Layers,
  Flame,
  Snowflake,
  FastForward,
  Maximize2,
} from 'lucide-react';
import { GameMode, Upgrade } from '../types/game';

interface HUDProps {
  hp: number;
  maxHp: number;
  shield: number;
  maxShield: number;
  energy: number;
  maxEnergy: number;
  score: number;
  wave: number;
  combo: number;
  comboMultiplier: number;
  exp: number;
  nextExp: number;
  level: number;
  activeUpgrades: Upgrade[];
  language: 'es' | 'en';
  gameMode?: GameMode;
  timeLeft?: number;
  isPaused: boolean;
  isMuted: boolean;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenUpgradesLog?: () => void;
  onOpenSandbox?: () => void;
  onOpenLeaderboard?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hp,
  maxHp,
  shield,
  maxShield,
  energy,
  maxEnergy,
  score,
  wave,
  combo,
  comboMultiplier,
  exp,
  nextExp,
  level,
  activeUpgrades,
  language,
  gameMode = 'survival',
  timeLeft = 180,
  isPaused,
  isMuted,
  onTogglePause,
  onToggleMute,
  onOpenSandbox,
  onOpenLeaderboard,
}) => {
  const [hoveredUpgrade, setHoveredUpgrade] = useState<Upgrade | null>(null);

  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const shieldPercent = Math.max(0, Math.min(100, (shield / maxShield) * 100));
  const energyPercent = Math.max(0, Math.min(100, (energy / maxEnergy) * 100));
  const expPercent = Math.max(0, Math.min(100, (exp / nextExp) * 100));

  // Formato de tiempo MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Asistente de iconos para mejoras
  const renderUpgradeIcon = (iconName: string, className = 'w-3.5 h-3.5') => {
    switch (iconName) {
      case 'Sword':
        return <Sword className={className} />;
      case 'ShieldPlus':
        return <ShieldPlus className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Magnet':
        return <Magnet className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'FastForward':
        return <FastForward className={className} />;
      case 'Maximize2':
        return <Maximize2 className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Snowflake':
        return <Snowflake className={className} />;
      default:
        return <Zap className={className} />;
    }
  };

  // Color de borde de los iconos según su rareza
  const getRarityBadgeColor = (rarity: Upgrade['rarity']) => {
    switch (rarity) {
      case 'synergy':
        return 'border-[#C9A96E] text-[#C9A96E] bg-[#C9A96E]/15 shadow-[0_0_8px_rgba(201,169,110,0.35)]';
      case 'legendary':
        return 'border-[#C9A96E]/80 text-[#C9A96E] bg-[#C9A96E]/10';
      case 'epic':
        return 'border-purple-400 text-purple-300 bg-purple-950/40';
      case 'rare':
        return 'border-sky-400 text-sky-300 bg-sky-950/40';
      default:
        return 'border-white/20 text-white/80 bg-white/5';
    }
  };

  return (
    <div id="hud-root" className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-10 select-none">
      {/* Capa de líneas de escaneo CRT */}
      <div className="absolute inset-0 pointer-events-none opacity-15 scanlines-overlay z-0" />

      {/* BARRA SUPERIOR */}
      <div id="hud-top-bar" className="relative z-10 flex items-start justify-between gap-4">
        {/* Indicadores vitales: Salud, Escudo, Energía del Núcleo */}
        <div id="hud-vitals" className="flex flex-col gap-2 w-56 sm:w-72">
          {/* Barra de Salud y Escudo */}
          <div className="relative bg-[#080808]/90 border border-white/10 rounded-xl p-2.5 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-rose-400 text-[10px] uppercase tracking-[0.2em] font-mono">
                <Activity className="w-3.5 h-3.5" />
                {language === 'es' ? 'INTEGRIDAD' : 'INTEGRITY'}
              </span>
              <span className="text-white/80 font-mono text-[11px]">
                {Math.round(hp)} <span className="text-white/30">/ {maxHp}</span>
                {maxShield > 0 && (
                  <span className="text-[#C9A96E] ml-1.5 font-mono">+{Math.round(shield)}</span>
                )}
              </span>
            </div>

            {/* Pista de la barra de salud */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex relative">
              <div
                className="h-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-150"
                style={{ width: `${hpPercent}%` }}
              />
              {/* Barra superpuesta de escudo */}
              {shieldPercent > 0 && (
                <div
                  className="absolute inset-y-0 left-0 bg-[#C9A96E]/90 border-r border-white/80 transition-all duration-150"
                  style={{ width: `${shieldPercent}%` }}
                />
              )}
            </div>
          </div>

          {/* Barra de Energía (Cámara lenta y habilidades) */}
          <div className="bg-[#080808]/90 border border-white/10 rounded-xl p-2.5 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-[#C9A96E] text-[10px] uppercase tracking-[0.2em] font-mono">
                <Zap className="w-3.5 h-3.5" />
                {language === 'es' ? 'ENERGÍA CORE' : 'CORE ENERGY'}
              </span>
              <span className="text-[#C9A96E] font-mono text-[11px]">
                {Math.round(energy)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A96E] shadow-[0_0_8px_#C9A96E] transition-all duration-100"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Centro: Información de Sector / Modo / Temporizador */}
        <div id="hud-center-sector" className="flex flex-col items-center">
          {/* Distintivo de modo específico */}
          {gameMode === 'boss_rush' && (
            <div className="mb-1.5 px-3 py-0.5 rounded-full bg-rose-950/80 border border-rose-600/70 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-[0_0_12px_rgba(225,29,72,0.3)]">
              <Skull className="w-3 h-3 text-rose-400" />
              <span>{language === 'es' ? 'DESAFÍO DE TITANES (INFINITO)' : 'TITAN PROTOCOL (ENDLESS)'}</span>
            </div>
          )}

          {gameMode === 'time_attack' && (
            <div className={`mb-1.5 px-4 py-1 rounded-2xl border backdrop-blur-md font-mono font-bold flex items-center gap-2 shadow-lg transition-all ${timeLeft <= 30
                ? 'bg-rose-950/90 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-sky-950/90 border-sky-500/50 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
              }`}>
              <Clock className="w-4 h-4 text-sky-400" />
              <span className="text-sm sm:text-base tracking-wider">{formatTime(timeLeft)}</span>
              <span className="text-[9px] uppercase tracking-widest text-sky-200/60 hidden sm:inline">
                {language === 'es' ? 'RESTANTE' : 'LEFT'}
              </span>
            </div>
          )}

          {gameMode === 'sandbox' && (
            <div className="mb-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-600/70 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-[0_0_12px_rgba(192,132,252,0.3)]">
              <FlaskConical className="w-3 h-3 text-purple-400" />
              <span>{language === 'es' ? 'LABORATORIO MATRIX' : 'MATRIX LAB'}</span>
            </div>
          )}

          <div className="px-5 py-1.5 rounded-2xl bg-[#080808]/90 border border-[#C9A96E]/40 backdrop-blur-md shadow-[0_0_15px_rgba(201,169,110,0.1)] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-ping" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-[#C9A96E] font-serif font-bold">
              {gameMode === 'boss_rush'
                ? (language === 'es' ? `FASE TITÁN ${wave}` : `TITAN PHASE ${wave}`)
                : (language === 'es' ? `SECTOR ${wave}` : `SECTOR ${wave}`)}
            </span>
          </div>

          {/* Barra de progreso de experiencia */}
          <div className="mt-2 w-40 sm:w-56 flex flex-col items-center">
            <div className="w-full flex justify-between text-[9px] text-white/40 font-mono tracking-wider mb-0.5 uppercase">
              <span>{language === 'es' ? `NIVEL ${level}` : `LVL ${level}`}</span>
              <span>{Math.round(exp)} / {nextExp} EXP</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-[#C9A96E] shadow-[0_0_6px_#C9A96E] transition-all duration-200"
                style={{ width: `${expPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Derecha: Puntuación, Controles y Botón de Laboratorio */}
        <div id="hud-controls-score" className="flex flex-col items-end gap-2">
          {/* Muestra de puntuación */}
          <div className="bg-[#080808]/90 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md shadow-lg text-right">
            <div className="text-[9px] tracking-[0.25em] uppercase text-white/30 font-medium">
              {language === 'es' ? 'CRÉDITOS / PTS' : 'SCORE CREDITS'}
            </div>
            <div className="text-xl sm:text-2xl font-serif text-[#C9A96E] tracking-tight">
              {score.toLocaleString()}
            </div>
          </div>

          {/* Botones de acción rápida */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Botón rápido del Laboratorio Matrix */}
            {onOpenSandbox && (
              <button
                id="btn-hud-sandbox-toggle"
                onClick={onOpenSandbox}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/50 text-purple-300 text-xs font-mono transition-colors cursor-pointer shadow-md"
                title="Matrix Debug Lab"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-bold">LAB</span>
              </button>
            )}

            {onOpenLeaderboard && (
              <button
                id="btn-hud-leaderboard"
                onClick={onOpenLeaderboard}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#C9A96E] transition-colors cursor-pointer"
                title="Hall of Fame / Leaderboard"
              >
                <Trophy className="w-4 h-4 text-[#C9A96E]" />
              </button>
            )}

            <button
              id="btn-toggle-sound"
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#C9A96E] transition-colors cursor-pointer"
              title="Mute / Unmute"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C9A96E]" />}
            </button>

            <button
              id="btn-toggle-pause"
              onClick={onTogglePause}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#C9A96E] transition-colors cursor-pointer"
              title="Pause"
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* BARRA INFERIOR: Muelle compacto de mejoras + Tooltip emergente + Racha */}
      <div id="hud-bottom-bar" className="relative z-10 flex items-end justify-between gap-4 mt-auto">
        {/* Muelle de iconos de mejoras */}
        <div id="hud-perks-dock" className="flex flex-col items-start gap-1 relative max-w-[70%]">
          {/* Tarjeta de tooltip al pasar el cursor */}
          {hoveredUpgrade && (
            <div
              id="hud-perk-hover-tooltip"
              className="pointer-events-none absolute bottom-11 left-0 z-30 w-64 bg-[#0a0a0e]/95 border border-[#C9A96E]/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-md transition-all animate-fadeIn"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-serif text-xs font-bold text-[#E0E0E0]">
                  {language === 'es' ? hoveredUpgrade.nameEs : hoveredUpgrade.name}
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-[#C9A96E]">
                  L{hoveredUpgrade.level} / {hoveredUpgrade.maxLevel}
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed font-light">
                {language === 'es' ? hoveredUpgrade.descriptionEs : hoveredUpgrade.description}
              </p>
            </div>
          )}

          {/* Franja de iconos */}
          {activeUpgrades.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap p-1.5 rounded-xl bg-[#080808]/80 border border-white/10 backdrop-blur-md pointer-events-auto">
              {activeUpgrades.map((up) => (
                <div
                  key={up.id}
                  id={`hud-upgrade-icon-${up.id}`}
                  onMouseEnter={() => setHoveredUpgrade(up)}
                  onMouseLeave={() => setHoveredUpgrade(null)}
                  className={`relative w-8 h-8 rounded-lg border flex items-center justify-center cursor-help transition-all duration-150 hover:scale-110 ${getRarityBadgeColor(
                    up.rarity
                  )}`}
                >
                  {renderUpgradeIcon(up.icon, 'w-4 h-4')}

                  {/* Indicador de nivel */}
                  <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold px-1 bg-[#050505] border border-white/20 rounded-full text-white/90">
                    {up.level}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Widget del multiplicador de racha */}
        {combo > 1 && (
          <div
            id="hud-combo-badge"
            className="flex flex-col items-end bg-[#080808]/95 border border-[#C9A96E] px-4 py-2 rounded-2xl backdrop-blur-md shadow-[0_0_25px_rgba(201,169,110,0.2)] ml-auto"
          >
            <div className="text-[9px] tracking-[0.3em] uppercase text-[#C9A96E] font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C9A96E]" />
              {language === 'es' ? 'SINCRONÍA / STREAK' : 'NEURAL SYNC'}
            </div>
            <div className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] tracking-tight">
              {combo}x <span className="text-xs font-mono text-[#C9A96E]">({comboMultiplier}x pts)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
