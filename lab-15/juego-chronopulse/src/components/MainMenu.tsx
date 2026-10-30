import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Trophy,
  HelpCircle,
  Settings,
  Clock,
  Skull,
  FlaskConical,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { GameMode, UserGameStats } from '../types/game';

interface MainMenuProps {
  userStats: UserGameStats;
  language: 'es' | 'en';
  isMuted: boolean;
  onStartGame: (mode: GameMode) => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenTutorial: () => void;
  onOpenSettings: () => void;
  onOpenSandbox: () => void;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  userStats,
  language,
  isMuted,
  onStartGame,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenTutorial,
  onOpenSettings,
  onOpenSandbox,
  onToggleMute,
}) => {
  return (
    <div
      id="main-menu-root"
      className="relative w-full h-full min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col items-center justify-between p-6 sm:p-10 overflow-y-auto select-none font-sans"
    >
      <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay z-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A96E]/10 via-[#050505] to-[#050505] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C9A96E]/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Barra superior */}
      <div id="main-menu-header" className="relative z-10 w-full max-w-5xl flex items-center justify-between border-b border-white/10 pb-4 bg-[#080808]/60 px-5 py-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-lg text-[#C9A96E] font-bold tracking-tight">ChronoPulse</span>
          <div className="h-3.5 w-[1px] bg-white/20" />
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-mono text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
              <span>SYS: <span className="text-white/80">ONLINE</span></span>
            </span>
            <span className="hidden sm:inline">v1.0.4</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-menu-mute"
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#C9A96E] transition-colors cursor-pointer"
            title="Mute / Unmute"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#C9A96E]" />}
          </button>

          <button
            id="btn-menu-tutorial"
            onClick={onOpenTutorial}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#C9A96E]/10 border border-white/10 hover:border-[#C9A96E]/40 text-white/70 hover:text-[#C9A96E] text-xs font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="hidden sm:inline">{language === 'es' ? 'Manual' : 'Manual'}</span>
          </button>

          <button
            id="btn-menu-leaderboard"
            onClick={onOpenLeaderboard}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 border border-[#C9A96E]/40 hover:border-[#C9A96E] text-[#C9A96E] text-xs font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer shadow-[0_0_12px_rgba(201,169,110,0.15)]"
          >
            <Trophy className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="hidden sm:inline">{language === 'es' ? 'Ránking' : 'Leaderboard'}</span>
          </button>

          <button
            id="btn-menu-achievements"
            onClick={onOpenAchievements}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#C9A96E]/10 border border-white/10 hover:border-[#C9A96E]/40 text-white/70 hover:text-[#C9A96E] text-xs font-semibold uppercase tracking-[0.15em] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span className="hidden sm:inline">{language === 'es' ? 'Logros' : 'Records'}</span>
          </button>

          <button
            id="btn-menu-settings"
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-[#C9A96E] transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-[#C9A96E]" />
          </button>
        </div>
      </div>

      {/* Encabezado principal */}
      <div id="main-menu-hero" className="relative z-10 my-auto flex flex-col items-center text-center max-w-2xl py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E] text-[11px] uppercase tracking-[0.25em] font-medium mb-4 shadow-[0_0_20px_rgba(201,169,110,0.1)]"
        >
          <Sparkles className="w-3 h-3 text-[#C9A96E]" />
          {language === 'es' ? 'FÍSICA ORBITAL & TÁCTICA TEMPORAL' : 'QUANTUM ORBITAL BULLET-TIME'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-serif tracking-tight text-[#E0E0E0] mb-3"
        >
          Chrono<span className="font-serif italic text-[#C9A96E]">Pulse</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs sm:text-sm text-white/60 max-w-lg mb-8 leading-relaxed font-light"
        >
          {language === 'es'
            ? 'Manipula la velocidad del tiempo, sincroniza el corte de hojas cinéticas y desvía trayectorias balísticas en un tejido cuántico reactivo.'
            : 'Manipulate temporal dilation, slingshot resonance blades, and deflect bullet-hell trajectories in an elegant quantum arena.'}
        </motion.p>

        {/* Tarjetas de modos de juego */}
        <div id="game-modes-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl">
          <motion.button
            id="btn-mode-survival"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartGame('survival')}
            className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080808] border border-[#C9A96E]/60 hover:border-[#C9A96E] text-left shadow-[0_0_25px_rgba(201,169,110,0.12)] cursor-pointer transition-all group relative overflow-hidden h-full min-h-[80px]"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A96E]/5 rounded-bl-full pointer-events-none" />
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#C9A96E] text-black flex items-center justify-center font-bold shadow-md shadow-[#C9A96E]/30 group-hover:scale-105 transition-transform shrink-0">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-serif text-sm sm:text-base text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors font-semibold truncate">
                  {language === 'es' ? 'Supervivencia Rogue' : 'Rogue Survival'}
                </h3>
                <span className="text-[8px] sm:text-[9px] bg-[#C9A96E]/20 text-[#C9A96E] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
                  INFINITO
                </span>
              </div>
              <p className="text-[11px] text-white/45 mt-0.5 font-light truncate">
                {language === 'es'
                  ? 'Sectores infinitos y mejoras cuánticas'
                  : 'Infinite sectors & quantum perks'}
              </p>
            </div>
          </motion.button>

          <motion.button
            id="btn-mode-boss-rush"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartGame('boss_rush')}
            className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080808] hover:bg-white/5 border border-white/10 hover:border-[#C9A96E]/40 text-left shadow-md cursor-pointer transition-all group h-full min-h-[80px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 text-[#C9A96E] border border-white/10 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shrink-0">
              <Skull className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors font-semibold truncate">
                {language === 'es' ? 'Desafío de Titanes' : 'Titan Protocol'}
              </h3>
              <p className="text-[11px] text-white/45 mt-0.5 font-light truncate">
                {language === 'es' ? 'Combates continuos contra Jefes' : 'Consecutive Titan Boss battles'}
              </p>
            </div>
          </motion.button>

          <motion.button
            id="btn-mode-time-attack"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStartGame('time_attack')}
            className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080808] hover:bg-white/5 border border-white/10 hover:border-[#C9A96E]/40 text-left shadow-md cursor-pointer transition-all group h-full min-h-[80px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 text-[#C9A96E] border border-white/10 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors font-semibold truncate">
                {language === 'es' ? 'Contrarreloj' : 'Time Attack'}
              </h3>
              <p className="text-[11px] text-white/45 mt-0.5 font-light truncate">
                {language === 'es' ? 'Puntuación máxima en 3 minutos' : 'Score blitz in 3-minute limit'}
              </p>
            </div>
          </motion.button>

          <motion.button
            id="btn-mode-sandbox"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSandbox}
            className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#080808] hover:bg-white/5 border border-white/10 hover:border-[#C9A96E]/40 text-left shadow-md cursor-pointer transition-all group h-full min-h-[80px]"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 text-[#C9A96E] border border-white/10 flex items-center justify-center font-bold group-hover:scale-105 transition-transform shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-sm sm:text-base text-[#E0E0E0] group-hover:text-[#C9A96E] transition-colors font-semibold truncate">
                {language === 'es' ? 'Laboratorio Matrix' : 'Quantum Lab'}
              </h3>
              <p className="text-[11px] text-white/45 mt-0.5 font-light truncate">
                {language === 'es' ? 'Pruebas libres, titanes y trucos' : 'Free testing, titans & cheats'}
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Panel de estadísticas */}
      <div id="main-menu-stats" className="relative z-10 w-full max-w-3xl mt-4">
        <div className="p-4 rounded-2xl bg-[#080808]/90 border border-white/10 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">
              {language === 'es' ? 'Récord Histórico' : 'High Score'}
            </div>
            <div className="text-base sm:text-lg font-serif font-bold text-[#C9A96E] mt-0.5">
              {userStats.highScore.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">
              {language === 'es' ? 'Sector Máximo' : 'Max Sector'}
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white/90 mt-0.5">
              {userStats.maxWave || 1}
            </div>
          </div>

          <div>
            <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">
              {language === 'es' ? 'Mayor Racha' : 'Max Streak'}
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#C9A96E] mt-0.5">
              {userStats.maxCombo}x
            </div>
          </div>

          <div>
            <div className="text-[9px] text-white/40 font-medium uppercase tracking-[0.2em]">
              {language === 'es' ? 'Bajas Totales' : 'Total Kills'}
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white/90 mt-0.5">
              {userStats.totalKills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
