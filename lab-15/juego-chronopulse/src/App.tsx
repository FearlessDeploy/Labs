import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { UpgradeModal } from './components/UpgradeModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialModal } from './components/TutorialModal';
import { SandboxLab } from './components/SandboxLab';
import { LeaderboardModal } from './components/LeaderboardModal';
import {
  Achievement,
  AudioSettings,
  GameMode,
  GameState,
  GameUpgradeStats,
  LeaderboardEntry,
  Upgrade,
  UserGameStats,
} from './types/game';
import {
  getRandomUpgrades,
  INITIAL_UPGRADE_STATS,
  UPGRADES_DATABASE,
} from './utils/upgrades';
import {
  addLeaderboardEntry,
  loadAchievements,
  loadAudioSettings,
  loadLanguage,
  loadLeaderboard,
  loadPlayerName,
  loadUserStats,
  saveAchievements,
  saveAudioSettings,
  saveLanguage,
  savePlayerName,
  saveUserStats,
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  // Estado principal del juego
  const [gameState, setGameState] = useState<GameState>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('survival');
  const [sessionKey, setSessionKey] = useState(0);

  // Estadísticas y progreso
  const [upgradeStats, setUpgradeStats] = useState<GameUpgradeStats>({ ...INITIAL_UPGRADE_STATS });
  const [activeUpgrades, setActiveUpgrades] = useState<Upgrade[]>([]);
  const [userStats, setUserStats] = useState<UserGameStats>(loadUserStats);
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(loadAudioSettings);
  const [language, setLanguage] = useState<'es' | 'en'>(loadLanguage);

  // Variables en tiempo real para el HUD
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [shield, setShield] = useState(50);
  const [maxShield, setMaxShield] = useState(50);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy, setMaxEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [exp, setExp] = useState(0);
  const [nextExp, setNextExp] = useState(80);
  const [level, setLevel] = useState(1);

  // Modales y paneles
  const [upgradeOptions, setUpgradeOptions] = useState<Upgrade[]>([]);
  const [rerollsAvailable, setRerollsAvailable] = useState(2);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isInfiniteEnergy, setIsInfiniteEnergy] = useState(false);
  const [isGodMode, setIsGodMode] = useState(false);
  const [timeAttackTimeLeft, setTimeAttackTimeLeft] = useState(180);

  // Perfil de jugador y clasificación
  const [playerName, setPlayerName] = useState<string>(loadPlayerName);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(loadLeaderboard);

  // Resumen de la partida
  const [runSummary, setRunSummary] = useState({
    score: 0,
    wave: 1,
    combo: 0,
    kills: 0,
    isNewHighScore: false,
  });

  // Configuración inicial de sonido
  useEffect(() => {
    sound.setVolumes(
      audioSettings.masterVolume,
      audioSettings.sfxVolume,
      audioSettings.musicVolume,
      audioSettings.muted
    );
  }, [audioSettings]);

  const handleToggleMute = useCallback(() => {
    setAudioSettings((prev) => {
      const updated = { ...prev, muted: !prev.muted };
      saveAudioSettings(updated);
      sound.setVolumes(updated.masterVolume, updated.sfxVolume, updated.musicVolume, updated.muted);
      return updated;
    });
  }, []);

  const handleUpdateLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  // Iniciar nueva partida
  const handleStartGame = (mode: GameMode) => {
    sound.init();
    sound.startMusic();

    setGameMode(mode);
    setUpgradeStats({ ...INITIAL_UPGRADE_STATS });
    setActiveUpgrades([]);
    setIsInfiniteEnergy(false);
    setIsGodMode(false);
    setIsSandboxOpen(false);

    // Reiniciar trucos activos del sandbox
    window.dispatchEvent(
      new CustomEvent('chronopulse_sandbox_action', {
        detail: { type: 'reset_cheats' },
      })
    );

    setRerollsAvailable(2);
    setScore(0);
    setWave(1);
    setCombo(0);
    setLevel(1);
    setExp(0);
    setNextExp(80);
    setSessionKey((prev) => prev + 1);

    setGameState('playing');
  };

  // Pausar o reanudar juego
  const handleTogglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      sound.stopMusic();
    } else if (gameState === 'paused') {
      setGameState('playing');
      sound.startMusic();
    }
  };

  // Selección de mejora al subir de nivel
  const handleLevelUp = useCallback(() => {
    const options = getRandomUpgrades(upgradeStats, activeUpgrades, 3);
    setUpgradeOptions(options);
    setGameState('upgrade_select');
  }, [upgradeStats, activeUpgrades]);

  // Seleccionar mejora
  const handleSelectUpgrade = (upgrade: Upgrade) => {
    const newStats = { ...upgradeStats };
    upgrade.apply(newStats);
    setUpgradeStats(newStats);

    setActiveUpgrades((prev) => {
      const existing = prev.find((u) => u.id === upgrade.id);
      if (existing) {
        return prev.map((u) => (u.id === upgrade.id ? { ...u, level: u.level + 1 } : u));
      } else {
        return [...prev, { ...upgrade, level: 1 }];
      }
    });

    checkAchievements({
      synergyUnlocked: upgrade.rarity === 'synergy',
      bladeCount: newStats.bladeCount,
    });

    setGameState('playing');
  };

  // Recargar opciones de mejora
  const handleRerollUpgrades = () => {
    if (rerollsAvailable <= 0) return;
    setRerollsAvailable((prev) => prev - 1);
    const options = getRandomUpgrades(upgradeStats, activeUpgrades, 3);
    setUpgradeOptions(options);
  };

  // Omitir mejora
  const handleSkipUpgrade = () => {
    setScore((prev) => prev + 500);
    setGameState('playing');
  };

  // Manejo de fin de partida
  const handleGameOver = useCallback(
    (run: { score: number; wave: number; combo: number; kills: number }) => {
      sound.stopMusic();

      const isNewHighScore = run.score > userStats.highScore;
      const updatedUserStats: UserGameStats = {
        highScore: Math.max(userStats.highScore, run.score),
        maxWave: Math.max(userStats.maxWave, run.wave),
        totalKills: userStats.totalKills + run.kills,
        bossesKilled: userStats.bossesKilled + Math.floor(run.wave / 5),
        maxCombo: Math.max(userStats.maxCombo, run.combo),
        totalReflections: userStats.totalReflections + Math.floor(run.score / 200),
        totalTimeSlowSeconds: userStats.totalTimeSlowSeconds + 20,
        gamesPlayed: userStats.gamesPlayed + 1,
        victories: userStats.victories,
      };

      setUserStats(updatedUserStats);
      saveUserStats(updatedUserStats);

      // Guardar en la tabla de clasificación
      if (run.score > 0 && gameMode !== 'sandbox') {
        const { entries } = addLeaderboardEntry({
          playerName: playerName || 'Piloto-01',
          score: run.score,
          mode: gameMode,
          wave: run.wave,
          combo: run.combo,
          kills: run.kills,
        });
        setLeaderboardEntries(entries);
      }

      setRunSummary({
        ...run,
        isNewHighScore,
      });

      checkAchievements({
        kills: updatedUserStats.totalKills,
        combo: run.combo,
        wave: run.wave,
      });

      setGameState('game_over');
    },
    [userStats, playerName, gameMode]
  );

  // Manejo de victoria
  const handleVictory = useCallback(
    (run: { score: number; wave: number; combo: number; kills: number }) => {
      sound.stopMusic();

      const updatedUserStats: UserGameStats = {
        highScore: Math.max(userStats.highScore, run.score),
        maxWave: Math.max(userStats.maxWave, run.wave),
        totalKills: userStats.totalKills + run.kills,
        bossesKilled: userStats.bossesKilled + 3,
        maxCombo: Math.max(userStats.maxCombo, run.combo),
        totalReflections: userStats.totalReflections + 50,
        totalTimeSlowSeconds: userStats.totalTimeSlowSeconds + 45,
        gamesPlayed: userStats.gamesPlayed + 1,
        victories: userStats.victories + 1,
      };

      setUserStats(updatedUserStats);
      saveUserStats(updatedUserStats);

      if (run.score > 0 && gameMode !== 'sandbox') {
        const { entries } = addLeaderboardEntry({
          playerName: playerName || 'Piloto-01',
          score: run.score,
          mode: gameMode,
          wave: run.wave,
          combo: run.combo,
          kills: run.kills,
        });
        setLeaderboardEntries(entries);
      }

      setRunSummary({
        ...run,
        isNewHighScore: run.score > userStats.highScore,
      });

      checkAchievements({
        wave: 15,
        kills: updatedUserStats.totalKills,
        combo: run.combo,
      });

      setGameState('victory');
    },
    [userStats, playerName, gameMode]
  );

  const handleHpChange = useCallback((newHp: number, newMaxHp: number, newShield: number, newMaxShield: number) => {
    setHp(newHp);
    setMaxHp(newMaxHp);
    setShield(newShield);
    setMaxShield(newMaxShield);
  }, []);

  const handleEnergyChange = useCallback((newEnergy: number, newMaxEnergy: number) => {
    setEnergy(newEnergy);
    setMaxEnergy(newMaxEnergy);
  }, []);

  const handleComboChange = useCallback((newCombo: number, newMult: number) => {
    setCombo(newCombo);
    setComboMultiplier(newMult);
  }, []);

  const handleExpChange = useCallback((newExp: number, newNextExp: number, newLvl: number) => {
    setExp(newExp);
    setNextExp(newNextExp);
    setLevel(newLvl);
  }, []);

  // Verificación de logros
  const checkAchievements = (data: {
    kills?: number;
    combo?: number;
    wave?: number;
    synergyUnlocked?: boolean;
    bladeCount?: number;
  }) => {
    setAchievements((prev) => {
      let changed = false;
      const next = prev.map((ach) => {
        if (ach.unlocked) return ach;
        let newProg = ach.progress;
        let unlock = false;

        if (ach.id === 'first_blood' && data.kills && data.kills >= 1) {
          newProg = 1;
          unlock = true;
        } else if (ach.id === 'combo_king' && data.combo) {
          newProg = Math.max(newProg, data.combo);
          if (newProg >= 20) unlock = true;
        } else if (ach.id === 'wave_survivor' && data.wave) {
          newProg = Math.max(newProg, data.wave);
          if (newProg >= 10) unlock = true;
        } else if (ach.id === 'synergy_master' && data.synergyUnlocked) {
          newProg = 1;
          unlock = true;
        } else if (ach.id === 'blade_trinity' && data.bladeCount && data.bladeCount >= 3) {
          newProg = 3;
          unlock = true;
        }

        if (unlock && !ach.unlocked) {
          changed = true;
          return { ...ach, progress: newProg, unlocked: true, unlockedAt: Date.now() };
        }
        if (newProg !== ach.progress) {
          changed = true;
          return { ...ach, progress: newProg };
        }
        return ach;
      });

      if (changed) {
        saveAchievements(next);
      }
      return next;
    });
  };

  // Operaciones del laboratorio sandbox
  const handleApplySandboxUpgrade = (upgrade: Upgrade) => {
    const newStats = { ...upgradeStats };
    upgrade.apply(newStats);
    setUpgradeStats(newStats);

    setActiveUpgrades((prev) => {
      const existing = prev.find((u) => u.id === upgrade.id);
      if (existing) {
        return prev.map((u) => (u.id === upgrade.id ? { ...u, level: u.level + 1 } : u));
      } else {
        return [...prev, { ...upgrade, level: 1 }];
      }
    });
  };

  const handleMaxAllPerks = () => {
    const newStats = { ...upgradeStats };
    UPGRADES_DATABASE.forEach((up) => {
      for (let i = 0; i < up.maxLevel; i++) {
        up.apply(newStats);
      }
    });
    setUpgradeStats(newStats);
    setActiveUpgrades(
      UPGRADES_DATABASE.map((up) => ({ ...up, level: up.maxLevel }))
    );
  };

  const handleResetSandboxStats = () => {
    setUpgradeStats({ ...INITIAL_UPGRADE_STATS });
    setActiveUpgrades([]);
  };

  const handleToggleInfiniteEnergy = () => {
    setIsInfiniteEnergy((prev) => {
      const next = !prev;
      if (next) {
        setUpgradeStats((s) => ({ ...s, energyMaxBonus: 9999, energyRegenMultiplier: 99 }));
      } else {
        setUpgradeStats((s) => ({ ...s, energyMaxBonus: 0, energyRegenMultiplier: 1 }));
      }
      return next;
    });
  };

  const handleToggleGodMode = () => {
    setIsGodMode((prev) => {
      const next = !prev;
      window.dispatchEvent(
        new CustomEvent('chronopulse_sandbox_action', {
          detail: { type: 'god_mode', value: next },
        })
      );
      return next;
    });
  };

  const handleSetBladeCount = (count: number) => {
    const validCount = Math.max(1, Math.min(8, count));
    setUpgradeStats((s) => ({ ...s, bladeCount: validCount }));
    window.dispatchEvent(
      new CustomEvent('chronopulse_sandbox_action', {
        detail: { type: 'set_blades', bladeCount: validCount },
      })
    );
  };

  // Atajo de teclado L para el laboratorio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyL' && gameMode === 'sandbox' && gameState === 'playing') {
        setIsSandboxOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, gameState]);

  return (
    <main id="app-root" className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* Pantalla de menú principal */}
      {gameState === 'menu' && (
        <MainMenu
          userStats={userStats}
          language={language}
          isMuted={audioSettings.muted}
          onStartGame={handleStartGame}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSandbox={() => {
            handleStartGame('sandbox');
          }}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* Lienzo de juego y HUD */}
      {gameState !== 'menu' && (
        <div id="game-viewport" className="relative w-full h-full">
          <GameCanvas
            key={`game-session-${sessionKey}`}
            sessionKey={sessionKey}
            gameState={gameState}
            gameMode={gameMode}
            isPaused={
              gameState === 'paused' ||
              gameState === 'upgrade_select' ||
              isSandboxOpen ||
              isLeaderboardOpen ||
              isTutorialOpen ||
              isSettingsOpen ||
              isAchievementsOpen
            }
            isSandboxOpen={isSandboxOpen}
            stats={upgradeStats}
            currentUpgrades={activeUpgrades}
            language={language}
            onLevelUp={handleLevelUp}
            onGameOver={handleGameOver}
            onVictory={handleVictory}
            onWaveChange={setWave}
            onHpChange={handleHpChange}
            onEnergyChange={handleEnergyChange}
            onComboChange={handleComboChange}
            onScoreChange={setScore}
            onExpChange={handleExpChange}
            onTimeChange={setTimeAttackTimeLeft}
          />

          <HUD
            hp={hp}
            maxHp={maxHp}
            shield={shield}
            maxShield={maxShield}
            energy={energy}
            maxEnergy={maxEnergy}
            score={score}
            wave={wave}
            combo={combo}
            comboMultiplier={comboMultiplier}
            exp={exp}
            nextExp={nextExp}
            level={level}
            activeUpgrades={activeUpgrades}
            language={language}
            gameMode={gameMode}
            timeLeft={timeAttackTimeLeft}
            isPaused={gameState === 'paused'}
            isMuted={audioSettings.muted}
            onTogglePause={handleTogglePause}
            onToggleMute={handleToggleMute}
            onOpenUpgradesLog={() => {}}
            onOpenSandbox={gameMode === 'sandbox' ? () => setIsSandboxOpen(true) : undefined}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />

          {/* Pantalla de pausa */}
          {gameState === 'paused' && (
            <div
              id="pause-overlay"
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center"
            >
              <h2 className="text-4xl font-black text-slate-100 uppercase tracking-wider mb-2">
                {language === 'es' ? 'Simulación en Pausa' : 'Simulation Paused'}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {language === 'es' ? 'Pulsa Reanudar o ESPACIO para continuar' : 'Press Resume or SPACE to continue'}
              </p>

              <div className="flex flex-col gap-3 w-64">
                <button
                  id="btn-resume-game"
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {language === 'es' ? 'REANUDAR' : 'RESUME'}
                </button>
                <button
                  id="btn-quit-to-menu"
                  onClick={() => {
                    sound.stopMusic();
                    setGameState('menu');
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
                >
                  {language === 'es' ? 'Salir al Menú' : 'Quit to Menu'}
                </button>
              </div>
            </div>
          )}

          {/* Modal de mejoras */}
          <UpgradeModal
            isOpen={gameState === 'upgrade_select'}
            options={upgradeOptions}
            language={language}
            rerollsAvailable={rerollsAvailable}
            onSelect={handleSelectUpgrade}
            onReroll={handleRerollUpgrades}
            onSkip={handleSkipUpgrade}
          />

          {/* Pantalla de fin de juego */}
          <GameOverModal
            isOpen={gameState === 'game_over'}
            score={runSummary.score}
            wave={runSummary.wave}
            combo={runSummary.combo}
            kills={runSummary.kills}
            isNewHighScore={runSummary.isNewHighScore}
            language={language}
            playerName={playerName}
            onRetry={() => handleStartGame(gameMode)}
            onHome={() => setGameState('menu')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />

          {/* Pantalla de victoria */}
          <VictoryModal
            isOpen={gameState === 'victory'}
            score={runSummary.score}
            wave={runSummary.wave}
            combo={runSummary.combo}
            kills={runSummary.kills}
            language={language}
            onRetry={() => handleStartGame(gameMode)}
            onHome={() => setGameState('menu')}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          />
        </div>
      )}

      {/* Modales globales */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        entries={leaderboardEntries}
        playerName={playerName}
        language={language}
        onClose={() => setIsLeaderboardOpen(false)}
        onUpdatePlayerName={(name) => {
          setPlayerName(name);
          savePlayerName(name);
        }}
      />
      <AchievementsModal
        isOpen={isAchievementsOpen}
        achievements={achievements}
        language={language}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        audioSettings={audioSettings}
        language={language}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateAudio={(newAudio) => {
          setAudioSettings(newAudio);
          saveAudioSettings(newAudio);
          sound.setVolumes(newAudio.masterVolume, newAudio.sfxVolume, newAudio.musicVolume, newAudio.muted);
        }}
        onUpdateLanguage={handleUpdateLanguage}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        language={language}
        onClose={() => setIsTutorialOpen(false)}
      />

      <SandboxLab
        isOpen={isSandboxOpen}
        stats={upgradeStats}
        currentUpgrades={activeUpgrades}
        language={language}
        onClose={() => setIsSandboxOpen(false)}
        onApplyUpgrade={handleApplySandboxUpgrade}
        onMaxAllPerks={handleMaxAllPerks}
        onResetStats={handleResetSandboxStats}
        onToggleInfiniteEnergy={handleToggleInfiniteEnergy}
        isInfiniteEnergy={isInfiniteEnergy}
        onToggleGodMode={handleToggleGodMode}
        isGodMode={isGodMode}
        onSetBladeCount={handleSetBladeCount}
      />
    </main>
  );
}
