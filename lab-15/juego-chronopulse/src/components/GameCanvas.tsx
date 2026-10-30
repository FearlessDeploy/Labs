import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Blade,
  DropShard,
  Enemy,
  FloatingText,
  GameMode,
  GameState,
  GameUpgradeStats,
  Particle,
  Player,
  Projectile,
  Shockwave,
  Singularity,
  TemporalEcho,
  Upgrade,
} from '../types/game';
import { sound } from '../utils/audio';
import { drawEnemy } from '../utils/enemyRenderer';
import { updateEnemyTactics } from '../utils/enemyAI';

interface GameCanvasProps {
  sessionKey?: number;
  gameState: GameState;
  gameMode: GameMode;
  isPaused?: boolean;
  isSandboxOpen?: boolean;
  stats: GameUpgradeStats;
  currentUpgrades: Upgrade[];
  language: 'es' | 'en';
  isInfiniteEnergy?: boolean;
  onLevelUp: () => void;
  onGameOver: (runStats: { score: number; wave: number; combo: number; kills: number }) => void;
  onVictory: (runStats: { score: number; wave: number; combo: number; kills: number }) => void;
  onWaveChange: (wave: number) => void;
  onHpChange: (hp: number, maxHp: number, shield: number, maxShield: number) => void;
  onEnergyChange: (energy: number, maxEnergy: number) => void;
  onComboChange: (combo: number, multiplier: number) => void;
  onScoreChange: (score: number) => void;
  onExpChange: (exp: number, nextExp: number, level: number) => void;
  onTimeChange?: (timeLeft: number) => void;
}

// Límites de la Arena Cuántica
const WORLD_WIDTH = 2600;
const WORLD_HEIGHT = 2000;
const ARENA_PADDING = 50;

// Generador de jefes procedimentales e información de titanes
const getBossInfoForWave = (wave: number, mode: GameMode = 'survival', slotOffset = 0) => {
  const bossCatalog = [
    {
      baseType: 'boss_titan' as const,
      baseName: 'TITAN DREADNOUGHT',
      descEs: 'COLOSO ACORAZADO // RAYOS GATLING Y ONDAS DE CHOQUE',
      descEn: 'ARMORED COLOSSUS // GATLING LASERS & SHOCKWAVES',
      color: '#ef4444',
      radius: 52,
    },
    {
      baseType: 'boss_weaver' as const,
      baseName: 'CHRONO WEAVER',
      descEs: 'ANOMALÍA TEMPORAL // TELETRANSPORTE Y AGUJAS CUÁNTICAS',
      descEn: 'TEMPORAL ANOMALY // WARP TELEPORT & QUANTUM NEEDLES',
      color: '#38bdf8',
      radius: 46,
    },
    {
      baseType: 'boss_hexcore' as const,
      baseName: 'HEX-CORE OVERLORD',
      descEs: 'MATRIZ BASTIÓN // ESCUDOS ORBITALES Y HAZ TRIPARTITO',
      descEn: 'BASTION MATRIX // ORBITAL SHIELDS & TRIPLE BEAM',
      color: '#c084fc',
      radius: 54,
    },
    {
      baseType: 'boss_valkyrie' as const,
      baseName: 'OBSIDIAN VALKYRIE',
      descEs: 'CAZA HIPERSÓNICO // CORTE EN EMBESTIDA Y BUMERANES',
      descEn: 'HYPERSONIC FIGHTER // DASH SLASHES & BOOMERANGS',
      color: '#f43f5e',
      radius: 44,
    },
    {
      baseType: 'boss_singularity' as const,
      baseName: 'APEX NULL-SINGULARITY',
      descEs: 'NEXO GRAVITACIONAL // VÓRTICES Y TORMENTA DE MATERIA OSCURA',
      descEn: 'FINAL GRAVITATIONAL NEXUS // VORTICES & DARK STORM',
      color: '#fbbf24',
      radius: 58,
    },
  ];

  const baseBossCount = mode === 'boss_rush' ? Math.max(0, wave - 1) : Math.max(0, Math.floor(wave / 3) - 1);
  const bossCount = baseBossCount + slotOffset;
  const bossIndex = bossCount % bossCatalog.length;
  const bossLoop = Math.floor(bossCount / bossCatalog.length);
  const chosenBoss = bossCatalog[bossIndex] || bossCatalog[0];

  const loopPrefixes = ['', 'HYPER-', 'QUANTUM-', 'NEXUS-', 'ECLIPSE-', 'VOID-PRIME-', 'OMEGA-', 'APEX-', 'CHRONO-LORD-', 'INFINITY-'];
  const prefix = loopPrefixes[Math.min(bossLoop, loopPrefixes.length - 1)] || `TIER-${bossLoop + 1} `;
  const bossName = `${prefix}${chosenBoss.baseName}`;
  const bossDescEs = bossLoop > 0 ? `${chosenBoss.descEs} [CICLO ${bossLoop + 1}]` : chosenBoss.descEs;
  const bossDescEn = bossLoop > 0 ? `${chosenBoss.descEn} [LOOP ${bossLoop + 1}]` : chosenBoss.descEn;

  return {
    ...chosenBoss,
    bossName,
    bossDescEs,
    bossDescEn,
    bossLoop,
  };
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  sessionKey = 0,
  gameState,
  gameMode,
  isPaused = false,
  isSandboxOpen = false,
  stats,
  language,
  onLevelUp,
  onGameOver,
  onVictory,
  onWaveChange,
  onHpChange,
  onEnergyChange,
  onComboChange,
  onScoreChange,
  onExpChange,
  onTimeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isSimulationPaused = Boolean(
    isPaused ||
    gameState === 'paused' ||
    gameState === 'upgrade_select' ||
    isSandboxOpen
  );
  const isSimulationPausedRef = useRef(isSimulationPaused);
  isSimulationPausedRef.current = isSimulationPaused;

  // Referencias estables a callbacks y estadísticas para prevenir reinicios
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const callbacksRef = useRef({
    onLevelUp,
    onGameOver,
    onVictory,
    onWaveChange,
    onHpChange,
    onEnergyChange,
    onComboChange,
    onScoreChange,
    onExpChange,
    onTimeChange,
  });
  callbacksRef.current = {
    onLevelUp,
    onGameOver,
    onVictory,
    onWaveChange,
    onHpChange,
    onEnergyChange,
    onComboChange,
    onScoreChange,
    onExpChange,
    onTimeChange,
  };

  // Estado de la partida actual
  const waveRef = useRef(1);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRunRef = useRef(0);
  const comboTimerRef = useRef(0);
  const killsRef = useRef(0);
  const expRef = useRef(0);
  const levelRef = useRef(1);
  const expNeededRef = useRef(80);
  const gameTimeRef = useRef(0);
  const timeRemainingRef = useRef(180); // Para modo Contrarreloj
  const isGodModeRef = useRef(false); // Para Laboratorio Sandbox
  const isInfiniteEnergyRef = useRef(false);
  const isSlowMoActiveRef = useRef(false);
  const timeDilationRef = useRef(1.0);

  // Estado de la cámara dinámica (seguimiento suave + dirección de apuntado)
  const cameraRef = useRef<{
    x: number;
    y: number;
    targetX: number;
    targetY: number;
  }>({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    targetX: WORLD_WIDTH / 2,
    targetY: WORLD_HEIGHT / 2,
  });

  // Entidades
  const playerRef = useRef<Player>({
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    vx: 0,
    vy: 0,
    radius: 18,
    maxHp: 100,
    hp: 100,
    maxEnergy: 100,
    energy: 100,
    energyRegen: 15,
    speed: 300,
    dashCooldown: 1.2,
    lastDashTime: -10,
    isDashing: false,
    dashDuration: 0.22,
    dashStartTime: 0,
    invulnerableTime: 0,
    lastDamageTime: 0,
    rotation: 0,
    shieldHp: 50,
    maxShieldHp: 50,
  });

  const bladesRef = useRef<Blade[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const singularitiesRef = useRef<Singularity[]>([]);
  const echoesRef = useRef<TemporalEcho[]>([]);
  const shardsRef = useRef<DropShard[]>([]);

  // Estrellas de fondo con paralaje
  const bgStarsRef = useRef<Array<{ x: number; y: number; radius: number; alpha: number; speed: number }>>([]);

  // Controles y entradas
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const mouseScreenPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseWorldPosRef = useRef<{ x: number; y: number }>({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 });
  const screenShakeRef = useRef(0);

  // Controles táctiles móviles
  const [touchActive, setTouchActive] = useState(false);
  const touchJoystickRef = useRef<{ active: boolean; startX: number; startY: number; currX: number; currY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
  });
  const touchSlowMoRef = useRef(false);
  const lastSlowMoReleaseTimeRef = useRef(0);

  // Banner de anuncio de sector
  const sectorBannerRef = useRef<{
    active: boolean;
    timer: number;
    maxTimer: number;
    wave: number;
    title: string;
    subtitle: string;
    isBoss: boolean;
  }>({
    active: false,
    timer: 0,
    maxTimer: 3.2,
    wave: 1,
    title: '',
    subtitle: '',
    isBoss: false,
  });

  // Estado del generador de oleadas
  const waveSpawningRef = useRef(false);
  const enemiesLeftInWaveRef = useRef(0);
  const waveTimerRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  // Inicializar fondo estelar y eventos del Sandbox
  useEffect(() => {
    const stars: Array<{ x: number; y: number; radius: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * (WORLD_WIDTH + 800) - 400,
        y: Math.random() * (WORLD_HEIGHT + 800) - 400,
        radius: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    bgStarsRef.current = stars;

    const handleSandboxAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const detail = customEvent.detail;
      if (!detail) return;

      const p = playerRef.current;

      if (detail.type === 'clear_all') {
        enemiesRef.current = [];
        projectilesRef.current = [];
        shockwavesRef.current.push({
          x: p.x,
          y: p.y,
          radius: 20,
          maxRadius: 1200,
          color: '#38bdf8',
          width: 12,
          alpha: 1,
          speed: 1200,
        });
        sound.playEmpBlast();
      } else if (detail.type === 'god_mode') {
        isGodModeRef.current = Boolean(detail.value);
      } else if (detail.type === 'infinite_energy') {
        isInfiniteEnergyRef.current = Boolean(detail.value);
      } else if (detail.type === 'reset_cheats') {
        isGodModeRef.current = false;
        isInfiniteEnergyRef.current = false;
      } else if (detail.type === 'full_heal') {
        p.hp = p.maxHp;
        p.shieldHp = p.maxShieldHp;
        shockwavesRef.current.push({
          x: p.x,
          y: p.y,
          radius: 10,
          maxRadius: 300,
          color: '#10b981',
          width: 6,
          alpha: 0.9,
          speed: 600,
        });
        sound.playDash();
      } else if (detail.type === 'instant_levelup') {
        callbacksRef.current.onLevelUp();
      } else if (detail.type === 'spawn_dummy') {
        const ang = Math.random() * Math.PI * 2;
        enemiesRef.current.push({
          id: `dummy_${Date.now()}`,
          type: 'chaser',
          x: p.x + Math.cos(ang) * 200,
          y: p.y + Math.sin(ang) * 200,
          vx: 0,
          vy: 0,
          radius: 28,
          hp: 25000,
          maxHp: 25000,
          speed: 0,
          color: '#10b981',
          shootCooldown: 9999,
          lastShootTime: 0,
          behaviorTimer: 0,
          points: 10,
          statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
        });
      } else if (detail.type === 'spawn_boss') {
        const bType = detail.bossType || 'boss_titan';
        const catalogItem = [
          { type: 'boss_titan' as const, name: 'TITAN DREADNOUGHT', color: '#ef4444', radius: 52 },
          { type: 'boss_weaver' as const, name: 'CHRONO WEAVER', color: '#38bdf8', radius: 46 },
          { type: 'boss_hexcore' as const, name: 'HEX-CORE OVERLORD', color: '#c084fc', radius: 54 },
          { type: 'boss_valkyrie' as const, name: 'OBSIDIAN VALKYRIE', color: '#f43f5e', radius: 44 },
          { type: 'boss_singularity' as const, name: 'APEX NULL-SINGULARITY', color: '#fbbf24', radius: 58 },
        ].find((b) => b.type === bType) || { type: 'boss_titan' as const, name: 'TITAN DREADNOUGHT', color: '#ef4444', radius: 52 };

        enemiesRef.current.push({
          id: `sandbox_boss_${Date.now()}`,
          type: catalogItem.type,
          x: p.x,
          y: Math.max(180, p.y - 320),
          vx: 0,
          vy: 0,
          radius: catalogItem.radius,
          hp: 4500,
          maxHp: 4500,
          speed: 130,
          color: catalogItem.color,
          shootCooldown: 1.0,
          lastShootTime: 0,
          behaviorTimer: 0,
          points: 8000,
          isBoss: true,
          bossPhase: 1,
          bossName: catalogItem.name,
          statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
        });
        sound.playBossAlarm();
      } else if (detail.type === 'spawn_enemy') {
        const eType = detail.enemyType || 'chaser';
        const count = detail.count || 3;
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const dist = 320 + Math.random() * 80;
          enemiesRef.current.push({
            id: `sandbox_enemy_${Date.now()}_${i}`,
            type: eType,
            x: Math.max(ARENA_PADDING + 40, Math.min(WORLD_WIDTH - ARENA_PADDING - 40, p.x + Math.cos(ang) * dist)),
            y: Math.max(ARENA_PADDING + 40, Math.min(WORLD_HEIGHT - ARENA_PADDING - 40, p.y + Math.sin(ang) * dist)),
            vx: 0,
            vy: 0,
            radius: eType === 'pulse_colossus' ? 32 : eType === 'elite_juggernaut' ? 36 : eType === 'sniper' ? 18 : 16,
            hp: eType === 'pulse_colossus' ? 600 : eType === 'elite_juggernaut' ? 1200 : 180,
            maxHp: eType === 'pulse_colossus' ? 600 : eType === 'elite_juggernaut' ? 1200 : 180,
            speed: eType === 'chaser' ? 240 : 180,
            color: '#C9A96E',
            shootCooldown: 1.5,
            lastShootTime: 0,
            behaviorTimer: 0,
            points: 150,
            statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
          });
        }
      } else if (detail.type === 'set_blades') {
        const targetCount = Math.max(1, Math.min(8, detail.bladeCount || 1));
        bladesRef.current = [];
        for (let i = 0; i < targetCount; i++) {
          const angle = (i * 2 * Math.PI) / targetCount;
          bladesRef.current.push({
            id: `sandbox_blade_${i}`,
            orbitRadius: 75,
            baseRadius: 75,
            angle,
            angularVelocity: 4.8 * statsRef.current.bladeOrbitSpeedMultiplier,
            x: p.x + Math.cos(angle) * 75,
            y: p.y + Math.sin(angle) * 75,
            length: 32 * statsRef.current.bladeSizeMultiplier,
            width: 8 * statsRef.current.bladeSizeMultiplier,
            damage: 48 * statsRef.current.bladeDamageMultiplier,
            isThrusting: false,
            isReturning: false,
            thrustSpeed: 1050 * statsRef.current.bladeThrustRangeMultiplier,
            comboReflectCount: 0,
            color: '#C9A96E',
            trail: [],
          });
        }
      }
    };

    window.addEventListener('chronopulse_sandbox_action', handleSandboxAction);
    return () => {
      window.removeEventListener('chronopulse_sandbox_action', handleSandboxAction);
    };
  }, []);

  // Inicializar o reiniciar el juego
  const resetGame = useCallback(() => {
    const currentStats = statsRef.current;
    waveRef.current = 1;
    scoreRef.current = 0;
    comboRef.current = 0;
    maxComboRunRef.current = 0;
    comboTimerRef.current = 0;
    killsRef.current = 0;
    expRef.current = 0;
    levelRef.current = 1;
    expNeededRef.current = 80;
    gameTimeRef.current = 0;
    screenShakeRef.current = 0;
    timeRemainingRef.current = 180;
    isGodModeRef.current = false;

    const startX = WORLD_WIDTH / 2;
    const startY = WORLD_HEIGHT / 2;

    cameraRef.current = {
      x: startX,
      y: startY,
      targetX: startX,
      targetY: startY,
    };

    playerRef.current = {
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      radius: 18,
      maxHp: 100 + currentStats.maxHpBonus,
      hp: 100 + currentStats.maxHpBonus,
      maxEnergy: 100 + currentStats.energyMaxBonus,
      energy: 100 + currentStats.energyMaxBonus,
      energyRegen: 15 * currentStats.energyRegenMultiplier,
      speed: 300 * currentStats.speedMultiplier,
      dashCooldown: 1.2 * currentStats.dashCooldownMultiplier,
      lastDashTime: -10,
      isDashing: false,
      dashDuration: 0.22,
      dashStartTime: 0,
      invulnerableTime: 0,
      lastDamageTime: 0,
      rotation: 0,
      shieldHp: currentStats.shieldMax,
      maxShieldHp: currentStats.shieldMax,
    };

    // Inicializar hojas orbitales
    bladesRef.current = [];
    const bladeCount = Math.max(1, currentStats.bladeCount);
    for (let i = 0; i < bladeCount; i++) {
      const angle = (i * 2 * Math.PI) / bladeCount;
      bladesRef.current.push({
        id: `blade_${i}`,
        orbitRadius: 75,
        baseRadius: 75,
        angle: angle,
        angularVelocity: 4.8 * currentStats.bladeOrbitSpeedMultiplier,
        x: startX + Math.cos(angle) * 75,
        y: startY + Math.sin(angle) * 75,
        length: 32 * currentStats.bladeSizeMultiplier,
        width: 8 * currentStats.bladeSizeMultiplier,
        damage: 48 * currentStats.bladeDamageMultiplier,
        isThrusting: false,
        isReturning: false,
        thrustSpeed: 1050 * currentStats.bladeThrustRangeMultiplier,
        comboReflectCount: 0,
        color: '#C9A96E',
        trail: [],
      });
    }

    enemiesRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    shockwavesRef.current = [];
    singularitiesRef.current = [];
    echoesRef.current = [];
    shardsRef.current = [];

    callbacksRef.current.onWaveChange(1);
    callbacksRef.current.onScoreChange(0);
    callbacksRef.current.onComboChange(0, 1);
    callbacksRef.current.onExpChange(0, 80, 1);
    callbacksRef.current.onHpChange(playerRef.current.hp, playerRef.current.maxHp, playerRef.current.shieldHp, playerRef.current.maxShieldHp);
    callbacksRef.current.onEnergyChange(playerRef.current.energy, playerRef.current.maxEnergy);

    startWave(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincronizar actualizaciones de estadísticas
  useEffect(() => {
    const p = playerRef.current;
    p.maxHp = 100 + stats.maxHpBonus;
    p.maxEnergy = 100 + stats.energyMaxBonus;
    p.speed = 300 * stats.speedMultiplier;
    p.dashCooldown = 1.2 * stats.dashCooldownMultiplier;
    p.maxShieldHp = stats.shieldMax;

    // Ajustar número de hojas suavemente
    const desiredBlades = Math.max(1, stats.bladeCount);
    if (bladesRef.current.length < desiredBlades) {
      const addedCount = desiredBlades - bladesRef.current.length;
      for (let i = 0; i < addedCount; i++) {
        const angle = (bladesRef.current.length * 2 * Math.PI) / desiredBlades;
        bladesRef.current.push({
          id: `blade_${Date.now()}_${i}`,
          orbitRadius: 75,
          baseRadius: 75,
          angle: angle,
          angularVelocity: 4.8 * stats.bladeOrbitSpeedMultiplier,
          x: p.x + Math.cos(angle) * 75,
          y: p.y + Math.sin(angle) * 75,
          length: 32 * stats.bladeSizeMultiplier,
          width: 8 * stats.bladeSizeMultiplier,
          damage: 48 * stats.bladeDamageMultiplier,
          isThrusting: false,
          isReturning: false,
          thrustSpeed: 1050 * stats.bladeThrustRangeMultiplier,
          comboReflectCount: 0,
          color: bladesRef.current.length === 1 ? '#E5C07B' : '#C9A96E',
          trail: [],
        });
      }
    }

    bladesRef.current.forEach((b) => {
      b.damage = 48 * stats.bladeDamageMultiplier;
      b.length = 32 * stats.bladeSizeMultiplier;
      b.width = 8 * stats.bladeSizeMultiplier;
      b.angularVelocity = 4.8 * stats.bladeOrbitSpeedMultiplier;
    });
  }, [stats]);

  // Iniciar un nuevo sector/oleada
  const startWave = (wave: number) => {
    waveRef.current = wave;
    waveSpawningRef.current = true;
    waveTimerRef.current = 0;
    lastSpawnTimeRef.current = 0;

    // Oleadas de jefes: En Desafío de Titanes, CADA oleada es un Titán. En supervivencia, cada 3 oleadas.
    const isBossWave = gameMode === 'boss_rush' ? true : wave % 3 === 0;
    const numBosses = isBossWave
      ? (gameMode === 'boss_rush' ? Math.min(4, 1 + Math.floor((wave - 1) / 3)) : 1 + Math.floor(wave / 12))
      : 0;

    const totalEnemies = isBossWave
      ? (gameMode === 'boss_rush' ? numBosses + Math.min(4, Math.floor(wave / 3)) : numBosses + 4 + Math.floor(wave / 4))
      : (gameMode === 'time_attack' ? 16 + wave * 7 : 14 + wave * 6);
    enemiesLeftInWaveRef.current = totalEnemies;

    callbacksRef.current.onWaveChange(wave);

    // Información del jefe para anuncio en el banner
    const primaryBossInfo = isBossWave ? getBossInfoForWave(wave, gameMode, 0) : null;
    const bossName = primaryBossInfo?.bossName || '';
    const bossDescEs = primaryBossInfo?.bossDescEs || '';
    const bossDescEn = primaryBossInfo?.bossDescEn || '';

    // Configurar Banner del Sector
    let bannerTitle = '';
    let bannerSubtitle = '';

    if (isBossWave) {
      if (numBosses > 1) {
        bannerTitle =
          language === 'es'
            ? `¡ALERTA MÁXIMA: CONVERGENCIA DE ${numBosses} TITANES!`
            : `CRITICAL THREAT: ${numBosses} TITANS CONVERGENCE!`;
        bannerSubtitle =
          language === 'es'
            ? `¡MÚLTIPLES TITANES DETECTADOS SIMULTÁNEAMENTE EN LA MATRIZ!`
            : `MULTIPLE TITAN OVERLORDS DETECTED IN REAL-SPACE SIMULTANEOUSLY!`;
      } else {
        bannerTitle =
          language === 'es' ? `¡ALERTA MÁXIMA: ${bossName}!` : `CRITICAL THREAT: ${bossName}!`;
        bannerSubtitle = language === 'es' ? bossDescEs : bossDescEn;
      }
    } else {
      bannerTitle =
        language === 'es'
          ? `SECTOR ${wave} // INVASIÓN INFINITA`
          : `SECTOR ${wave} // INFINITE INVASION`;
      bannerSubtitle =
        language === 'es'
          ? `DESPLIEGUE HOSTIL ENTRANTE // NIVEL DE AMENAZA ${wave}`
          : `HOSTILE INVASION SQUAD // THREAT LEVEL ${wave}`;
    }

    sectorBannerRef.current = {
      active: true,
      timer: 3.2,
      maxTimer: 3.2,
      wave,
      isBoss: isBossWave,
      title: bannerTitle,
      subtitle: bannerSubtitle,
    };

    if (isBossWave) {
      sound.playBossAlarm();
      shockwavesRef.current.push({
        x: playerRef.current.x,
        y: playerRef.current.y,
        radius: 10,
        maxRadius: 800,
        color: '#ef4444',
        width: 8,
        alpha: 1,
        speed: 900,
      });
    } else {
      sound.playLevelUp();
      shockwavesRef.current.push({
        x: playerRef.current.x,
        y: playerRef.current.y,
        radius: 10,
        maxRadius: 500,
        color: '#C9A96E',
        width: 5,
        alpha: 0.9,
        speed: 700,
      });
    }

    // Generar vanguardia inicial para la oleada
    const canvas = canvasRef.current;
    const cw = canvas ? canvas.width / (window.devicePixelRatio || 1) : 1200;
    const ch = canvas ? canvas.height / (window.devicePixelRatio || 1) : 800;

    const initialSpawn = isBossWave ? numBosses : Math.min(6, enemiesLeftInWaveRef.current);
    for (let i = 0; i < initialSpawn; i++) {
      spawnEnemyWaveUnit(cw, ch);
      enemiesLeftInWaveRef.current -= 1;
    }
  };

  // Añadir Experiencia y verificar Subida de Nivel
  const addExp = (amount: number) => {
    expRef.current += amount;
    sound.playPickup();

    while (expRef.current >= expNeededRef.current) {
      expRef.current -= expNeededRef.current;
      levelRef.current += 1;
      expNeededRef.current = Math.floor(expNeededRef.current * 1.35 + 25);
      sound.playLevelUp();
      callbacksRef.current.onLevelUp();
    }

    callbacksRef.current.onExpChange(expRef.current, expNeededRef.current, levelRef.current);
  };

  // Acción de Desplazamiento Rápido (Dash)
  const triggerDash = () => {
    if (isSimulationPausedRef.current) return;
    const p = playerRef.current;
    const now = gameTimeRef.current;
    if (now - p.lastDashTime < p.dashCooldown) return;

    p.lastDashTime = now;
    p.isDashing = true;
    p.dashStartTime = now;
    p.invulnerableTime = now + p.dashDuration + 0.1;

    sound.playDash();

    let dx = 0;
    let dy = 0;
    if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) dy -= 1;
    if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) dy += 1;
    if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) dx -= 1;
    if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) dx += 1;

    if (touchJoystickRef.current.active) {
      dx = touchJoystickRef.current.currX - touchJoystickRef.current.startX;
      dy = touchJoystickRef.current.currY - touchJoystickRef.current.startY;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      p.vx = (dx / len) * 850;
      p.vy = (dy / len) * 850;
    } else {
      p.vx = Math.cos(p.rotation) * 850;
      p.vy = Math.sin(p.rotation) * 850;
    }

    shockwavesRef.current.push({
      x: p.x,
      y: p.y,
      radius: 15,
      maxRadius: 110,
      color: '#C9A96E',
      width: 4,
      alpha: 0.9,
      speed: 400,
    });

    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 140;
      particlesRef.current.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 3 + Math.random() * 3,
        color: '#C9A96E',
        alpha: 1,
        decay: 2.5,
        shape: 'spark',
      });
    }

    if (stats.hasSingularityOnDash) {
      singularitiesRef.current.push({
        id: `sing_${Date.now()}`,
        x: p.x,
        y: p.y,
        radius: 20,
        pullRadius: 180,
        pullForce: 350,
        duration: 3.5,
        maxDuration: 3.5,
        damagePerTick: 35,
      });
    }
  };

  // Escuchadores de Teclado y Ventana
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerDash();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [stats]);

  // Bucle de juego y Canvas principal: reinicio al montar o al iniciar nueva sesión
  useEffect(() => {
    resetGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bucle principal de simulación y renderizado
    const loop = (now: number) => {
      animationFrameId = requestAnimationFrame(loop);

      const rawDt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (gameState === 'menu' || gameState === 'game_over' || gameState === 'victory') {
        renderStaticBackground(ctx, canvas);
        return;
      }

      const p = playerRef.current;
      const canvasWidth = canvas.width / (window.devicePixelRatio || 1);
      const canvasHeight = canvas.height / (window.devicePixelRatio || 1);
      const isSimPaused = isSimulationPausedRef.current;

      if (!isSimPaused) {
        // --- 1. CÁLCULO DE DILATACIÓN TEMPORAL (EXCLUSIVO TECLA SHIFT Y TOUCH) ---
        const shiftPressed = keysRef.current['ShiftLeft'] || keysRef.current['ShiftRight'] || touchSlowMoRef.current;

      let isSlowMo = false;
      if (shiftPressed && p.energy > 3) {
        isSlowMo = true;
      }

      isSlowMoActiveRef.current = isSlowMo;

      const targetDilation = isSlowMo ? stats.slowMoDilationFactor : 1.0;
      timeDilationRef.current += (targetDilation - timeDilationRef.current) * 0.25;
      sound.setTimeDilation(timeDilationRef.current);

      const gameDt = rawDt * timeDilationRef.current;
      gameTimeRef.current += gameDt;

      // Gestión del modo Contrarreloj
      if (gameMode === 'time_attack') {
        timeRemainingRef.current -= rawDt;
        if (timeRemainingRef.current <= 0) {
          timeRemainingRef.current = 0;
          callbacksRef.current.onVictory({
            score: scoreRef.current,
            wave: waveRef.current,
            combo: maxComboRunRef.current,
            kills: killsRef.current,
          });
          return;
        }
        callbacksRef.current.onTimeChange?.(Math.ceil(timeRemainingRef.current));
      }

      // Consumo de energía durante la cámara lenta (o energía infinita)
      if (isInfiniteEnergyRef.current) {
        p.energy = p.maxEnergy;
      } else if (isSlowMo) {
        lastSlowMoReleaseTimeRef.current = now;
        const cappedCostReduction = Math.min(0.5, stats.slowMoCostReduction);
        const drain = 44 * (1 - cappedCostReduction) * rawDt;
        p.energy = Math.max(0, p.energy - drain);
      } else {
        // Cooldown de 0.5s tras liberar la cámara lenta y recarga equilibrada
        const timeSinceSlowMo = now - (lastSlowMoReleaseTimeRef.current || 0);
        if (timeSinceSlowMo > 500) {
          const baseRegen = 7.5;
          const cappedRegenMultiplier = Math.min(1.65, stats.energyRegenMultiplier);
          p.energy = Math.min(p.maxEnergy, p.energy + baseRegen * cappedRegenMultiplier * rawDt);
        }
      }
      callbacksRef.current.onEnergyChange(p.energy, p.maxEnergy);

      // Regeneración pasiva de Salud y Escudo
      if (stats.hpRegenPerSec > 0 && p.hp < p.maxHp && now - p.lastDamageTime > 2500) {
        const cappedHpRegen = Math.min(1.5, stats.hpRegenPerSec);
        p.hp = Math.min(p.maxHp, p.hp + cappedHpRegen * rawDt);
      }
      if (stats.shieldRegenPerSec > 0 && p.shieldHp < p.maxShieldHp && now - p.lastDamageTime > 3500) {
        const cappedShieldRegen = Math.min(6.0, stats.shieldRegenPerSec);
        p.shieldHp = Math.min(p.maxShieldHp, p.shieldHp + cappedShieldRegen * rawDt);
      }
      callbacksRef.current.onHpChange(p.hp, p.maxHp, p.shieldHp, p.maxShieldHp);

      // Decaimiento de la Racha de Combo
      if (comboRef.current > 0) {
        comboTimerRef.current -= rawDt;
        if (comboTimerRef.current <= 0) {
          comboRef.current = 0;
          callbacksRef.current.onComboChange(0, 1);
        }
      }

      // Actualización del temporizador del banner del sector
      if (sectorBannerRef.current.active) {
        sectorBannerRef.current.timer -= rawDt;
        if (sectorBannerRef.current.timer <= 0) {
          sectorBannerRef.current.active = false;
        }
      }

      // --- 2. ACTUALIZACIÓN DEL JUGADOR Y CÁMARA DINÁMICA ---
      mouseWorldPosRef.current.x = mouseScreenPosRef.current.x - canvasWidth / 2 + cameraRef.current.x;
      mouseWorldPosRef.current.y = mouseScreenPosRef.current.y - canvasHeight / 2 + cameraRef.current.y;

      p.rotation = Math.atan2(mouseWorldPosRef.current.y - p.y, mouseWorldPosRef.current.x - p.x);

      if (p.isDashing) {
        if (gameTimeRef.current - p.dashStartTime > p.dashDuration) {
          p.isDashing = false;
        }
      } else {
        let moveX = 0;
        let moveY = 0;
        if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) moveY -= 1;
        if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) moveY += 1;
        if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) moveX -= 1;
        if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) moveX += 1;

        if (touchJoystickRef.current.active) {
          const dx = touchJoystickRef.current.currX - touchJoystickRef.current.startX;
          const dy = touchJoystickRef.current.currY - touchJoystickRef.current.startY;
          const dist = Math.hypot(dx, dy);
          if (dist > 10) {
            moveX = dx / dist;
            moveY = dy / dist;
          }
        }

        const moveLen = Math.hypot(moveX, moveY);
        if (moveLen > 0) {
          p.vx += ((moveX / moveLen) * p.speed - p.vx) * 0.18;
          p.vy += ((moveY / moveLen) * p.speed - p.vy) * 0.18;
        } else {
          p.vx *= 0.82;
          p.vy *= 0.82;
        }
      }

      p.x += p.vx * rawDt;
      p.y += p.vy * rawDt;

      // Límites del Mundo de Juego
      p.x = Math.max(ARENA_PADDING + p.radius, Math.min(WORLD_WIDTH - ARENA_PADDING - p.radius, p.x));
      p.y = Math.max(ARENA_PADDING + p.radius, Math.min(WORLD_HEIGHT - ARENA_PADDING - p.radius, p.y));

      // Anticipación de la Cámara Dinámica
      const aimOffsetDist = 70;
      const aimAngle = Math.atan2(mouseWorldPosRef.current.y - p.y, mouseWorldPosRef.current.x - p.x);
      const leadX = Math.cos(aimAngle) * aimOffsetDist;
      const leadY = Math.sin(aimAngle) * aimOffsetDist;

      let targetCamX = p.x + leadX;
      let targetCamY = p.y + leadY;

      const minCamX = canvasWidth / 2;
      const maxCamX = WORLD_WIDTH - canvasWidth / 2;
      const minCamY = canvasHeight / 2;
      const maxCamY = WORLD_HEIGHT - canvasHeight / 2;

      if (maxCamX >= minCamX) targetCamX = Math.max(minCamX, Math.min(maxCamX, targetCamX));
      else targetCamX = WORLD_WIDTH / 2;

      if (maxCamY >= minCamY) targetCamY = Math.max(minCamY, Math.min(maxCamY, targetCamY));
      else targetCamY = WORLD_HEIGHT / 2;

      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.14;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.14;

      // Ecos Temporales
      if (stats.hasTemporalEchoes && Math.random() < 0.2) {
        echoesRef.current.push({
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          alpha: 0.6,
          bladeAngle: bladesRef.current[0]?.angle || 0,
          timestamp: gameTimeRef.current,
        });
        if (echoesRef.current.length > 8) echoesRef.current.shift();
      }

      // --- 3. HOJAS ORBITALES EN ROTACIÓN Y LANZAMIENTO CINÉTICO ---
      bladesRef.current.forEach((blade) => {
        // Rotación orbital continua alrededor del jugador
        blade.angle += blade.angularVelocity * rawDt;

        if (blade.isThrusting && blade.thrustTarget) {
          // Lanzamiento hacia el objetivo
          const dx = blade.thrustTarget.x - blade.x;
          const dy = blade.thrustTarget.y - blade.y;
          const distToTarget = Math.hypot(dx, dy);
          const distFromPlayer = Math.hypot(blade.x - p.x, blade.y - p.y);

          if (distToTarget < 25 || distFromPlayer > 380) {
            blade.isThrusting = false;
            blade.isReturning = true;
          } else {
            blade.x += (dx / distToTarget) * blade.thrustSpeed * rawDt;
            blade.y += (dy / distToTarget) * blade.thrustSpeed * rawDt;
          }
        } else if (blade.isReturning) {
          // Retorno suave a la órbita
          const targetOrbitX = p.x + Math.cos(blade.angle) * blade.baseRadius;
          const targetOrbitY = p.y + Math.sin(blade.angle) * blade.baseRadius;
          const dx = targetOrbitX - blade.x;
          const dy = targetOrbitY - blade.y;
          const distToOrbit = Math.hypot(dx, dy);

          if (distToOrbit < 30) {
            blade.isReturning = false;
            blade.orbitRadius = blade.baseRadius;
          } else {
            blade.x += (dx / distToOrbit) * (blade.thrustSpeed * 1.3) * rawDt;
            blade.y += (dy / distToOrbit) * (blade.thrustSpeed * 1.3) * rawDt;
          }
        } else {
          // Bloqueado en órbita respecto al jugador
          blade.x = p.x + Math.cos(blade.angle) * blade.baseRadius;
          blade.y = p.y + Math.sin(blade.angle) * blade.baseRadius;
        }

        blade.trail.push({ x: blade.x, y: blade.y });
        if (blade.trail.length > 16) blade.trail.shift();

        // Verificación de colisión entre hojas y enemigos
        enemiesRef.current.forEach((enemy) => {
          const dist = Math.hypot(enemy.x - blade.x, enemy.y - blade.y);
          if (dist < enemy.radius + blade.length * 0.75) {
            damageEnemy(enemy, blade.damage * rawDt * 10, true, p.x, p.y);
            sound.playSlash(comboRef.current);
            screenShakeRef.current = Math.min(screenShakeRef.current + 3, 15);

            for (let s = 0; s < 4; s++) {
              particlesRef.current.push({
                x: blade.x,
                y: blade.y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                radius: 2 + Math.random() * 2,
                color: blade.color,
                alpha: 1,
                decay: 3,
                shape: 'spark',
              });
            }
          }
        });

        // Reflejo de proyectiles con la hoja
        projectilesRef.current.forEach((proj) => {
          if (proj.type === 'enemy_bullet' || proj.type === 'enemy_laser') {
            const dist = Math.hypot(proj.x - blade.x, proj.y - blade.y);
            if (dist < proj.radius + blade.length * 0.85) {
              reflectProjectile(proj, mouseWorldPosRef.current);
            }
          }
        });
      });

      // --- 4. IA TÁCTICA DE ENEMIGOS Y ACTUALIZACIÓN ---
      updateWavesAndSpawning(canvasWidth, canvasHeight, gameDt);

      const aiContext = {
        player: p,
        blades: bladesRef.current,
        projectiles: projectilesRef.current,
        allEnemies: enemiesRef.current,
        dt: gameDt,
        gameTime: gameTimeRef.current,
        worldWidth: WORLD_WIDTH,
        worldHeight: WORLD_HEIGHT,
        arenaPadding: ARENA_PADDING,
        onSpawnProjectile: (proj: Projectile) => {
          projectilesRef.current.push(proj);
        },
        onSpawnShockwave: (shock: Shockwave) => {
          shockwavesRef.current.push(shock);
        },
      };

      for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
        const enemy = enemiesRef.current[i];
        updateEnemyTactics(enemy, aiContext);

        // Colisión del jugador
        if (!p.isDashing && gameTimeRef.current > p.invulnerableTime) {
          const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
          if (dist < enemy.radius + p.radius) {
            damagePlayer(enemy.isBoss ? 35 : enemy.isElite ? 26 : 18);
          }
        } else if (p.isDashing && stats.dashSlashesEnemies) {
          const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
          if (dist < enemy.radius + p.radius + 20) {
            damageEnemy(enemy, 90 * stats.bladeDamageMultiplier, true, p.x, p.y);
          }
        }

        if (enemy.hp <= 0) {
          killEnemy(enemy, i);
        }
      }

      // --- 5. ACTUALIZACIÓN DE PROYECTILES ---
      for (let i = projectilesRef.current.length - 1; i >= 0; i--) {
        const proj = projectilesRef.current[i];

        if (proj.homing && enemiesRef.current.length > 0) {
          let closestEnemy: Enemy | null = null;
          let minDist = 9999;
          enemiesRef.current.forEach((e) => {
            const d = Math.hypot(e.x - proj.x, e.y - proj.y);
            if (d < minDist) {
              minDist = d;
              closestEnemy = e;
            }
          });

          if (closestEnemy) {
            const target: Enemy = closestEnemy;
            const angle = Math.atan2(target.y - proj.y, target.x - proj.x);
            const currentSpeed = Math.hypot(proj.vx, proj.vy);
            proj.vx += Math.cos(angle) * currentSpeed * 0.18;
            proj.vy += Math.sin(angle) * currentSpeed * 0.18;
            const newSpeed = Math.hypot(proj.vx, proj.vy);
            proj.vx = (proj.vx / newSpeed) * currentSpeed;
            proj.vy = (proj.vy / newSpeed) * currentSpeed;
          }
        }

        proj.x += proj.vx * gameDt;
        proj.y += proj.vy * gameDt;
        proj.life -= gameDt;

        proj.trail.push({ x: proj.x, y: proj.y });
        if (proj.trail.length > 6) proj.trail.shift();

        // Colisiones de proyectiles con el jugador
        if (proj.type === 'enemy_bullet' || proj.type === 'enemy_laser') {
          if (!p.isDashing && gameTimeRef.current > p.invulnerableTime) {
            const dist = Math.hypot(proj.x - p.x, proj.y - p.y);
            if (dist < proj.radius + p.radius) {
              damagePlayer(proj.damage);
              projectilesRef.current.splice(i, 1);
              continue;
            }
          }
        }

        // Colisiones de proyectiles con enemigos
        if (proj.type === 'reflected_bullet' || proj.type === 'player_missile') {
          let hit = false;
          for (let eIdx = 0; eIdx < enemiesRef.current.length; eIdx++) {
            const enemy = enemiesRef.current[eIdx];
            const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
            if (dist < proj.radius + enemy.radius) {
              hit = true;
              damageEnemy(enemy, proj.damage, false, proj.x, proj.y);

              if (proj.ignites) {
                enemy.statusEffects.burnDuration = 3.0;
                enemy.statusEffects.burnDps = proj.damage * 0.4;
              }
              if (proj.freezes) {
                enemy.statusEffects.freezeDuration = 2.5;
              }

              proj.pierce -= 1;
              if (proj.pierce <= 0) {
                projectilesRef.current.splice(i, 1);
                break;
              }
            }
          }
          if (hit) continue;
        }

        if (
          proj.life <= 0 ||
          proj.x < -100 ||
          proj.x > WORLD_WIDTH + 100 ||
          proj.y < -100 ||
          proj.y > WORLD_HEIGHT + 100
        ) {
          projectilesRef.current.splice(i, 1);
        }
      }

      // --- 6. ACTUALIZACIÓN DE SINGULARIDADES ---
      for (let sIdx = singularitiesRef.current.length - 1; sIdx >= 0; sIdx--) {
        const sing = singularitiesRef.current[sIdx];
        sing.duration -= gameDt;

        enemiesRef.current.forEach((enemy) => {
          const dx = sing.x - enemy.x;
          const dy = sing.y - enemy.y;
          const dist = Math.hypot(dx, dy);
          if (dist < sing.pullRadius && dist > 10) {
            enemy.vx += (dx / dist) * sing.pullForce * gameDt;
            enemy.vy += (dy / dist) * sing.pullForce * gameDt;
            damageEnemy(enemy, sing.damagePerTick * gameDt, false, sing.x, sing.y);
          }
        });

        projectilesRef.current.forEach((proj) => {
          if (proj.type === 'enemy_bullet') {
            const dx = sing.x - proj.x;
            const dy = sing.y - proj.y;
            const dist = Math.hypot(dx, dy);
            if (dist < sing.pullRadius) {
              proj.vx += (dx / dist) * sing.pullForce * 1.5 * gameDt;
              proj.vy += (dy / dist) * sing.pullForce * 1.5 * gameDt;
              if (dist < 15) proj.life = 0;
            }
          }
        });

        if (sing.duration <= 0) {
          shockwavesRef.current.push({
            x: sing.x,
            y: sing.y,
            radius: 5,
            maxRadius: sing.pullRadius,
            color: '#C9A96E',
            width: 8,
            alpha: 1,
            speed: 600,
          });
          sound.playExplosion();
          singularitiesRef.current.splice(sIdx, 1);
        }
      }

      // --- 7. RECOLECCIÓN DE FRAGMENTOS ---
      for (let shIdx = shardsRef.current.length - 1; shIdx >= 0; shIdx--) {
        const shard = shardsRef.current[shIdx];
        const dx = p.x - shard.x;
        const dy = p.y - shard.y;
        const dist = Math.hypot(dx, dy);

        if (dist < stats.magneticRadius) {
          const magnetSpeed = (1 - dist / stats.magneticRadius) * 650 + 200;
          shard.x += (dx / dist) * magnetSpeed * rawDt;
          shard.y += (dy / dist) * magnetSpeed * rawDt;
        }

        if (dist < p.radius + 12) {
          if (shard.type === 'exp') addExp(shard.value);
          if (shard.type === 'hp') {
            p.hp = Math.min(p.maxHp, p.hp + shard.value);
            callbacksRef.current.onHpChange(p.hp, p.maxHp, p.shieldHp, p.maxShieldHp);
            floatingTextsRef.current.push({
              id: `heal_${Date.now()}_${Math.random()}`,
              x: p.x,
              y: p.y - 18,
              vy: -45,
              text: `+${Math.round(shard.value)} HP`,
              color: '#34d399',
              fontSize: 12,
              alpha: 1,
              decay: 0.9,
            });
          }
          if (shard.type === 'energy') {
            p.energy = Math.min(p.maxEnergy, p.energy + shard.value);
            callbacksRef.current.onEnergyChange(p.energy, p.maxEnergy);
          }
          shardsRef.current.splice(shIdx, 1);
        }
      }

      // --- 8. PARTÍCULAS Y TEXTOS FLOTANTES ---
      updateParticlesAndTexts(rawDt);
      }

      // --- 9. RENDERIZADO DEL MUNDO Y CÁMARA ---
      renderGame(ctx, canvasWidth, canvasHeight);

      if (isSimPaused) {
        renderPauseOverlay(ctx, canvasWidth, canvasHeight, isSandboxOpen);
      }
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [gameState, isPaused, isSandboxOpen, stats, language]);

  // --- LÓGICA DE APOYO ---

  const reflectProjectile = (proj: Projectile, aimPos: { x: number; y: number }) => {
    sound.playDeflect(comboRef.current + 1);

    comboRef.current += 1;
    maxComboRunRef.current = Math.max(maxComboRunRef.current, comboRef.current);
    comboTimerRef.current = 3.5;
    const comboMult = Math.min(16, 1 + Math.floor(comboRef.current / 4));
    callbacksRef.current.onComboChange(comboRef.current, comboMult);

    scoreRef.current += 150 * comboMult;
    callbacksRef.current.onScoreChange(scoreRef.current);

    proj.type = 'reflected_bullet';
    proj.color = '#C9A96E';
    proj.damage = (proj.damage * stats.reflectDamageMultiplier + 30) * comboMult;
    proj.life = 4.0;
    proj.pierce = 2;
    proj.homing = stats.reflectHoming;
    proj.ignites = stats.reflectIgnite;
    proj.freezes = stats.reflectFreeze;

    const angle = Math.atan2(aimPos.y - proj.y, aimPos.x - proj.x);
    const speed = 850;
    proj.vx = Math.cos(angle) * speed;
    proj.vy = Math.sin(angle) * speed;

    if (stats.reflectSplitCount > 0) {
      for (let s = 1; s <= stats.reflectSplitCount; s++) {
        const spreadAngle = angle + (s % 2 === 0 ? 1 : -1) * 0.25 * Math.ceil(s / 2);
        projectilesRef.current.push({
          id: `split_${Date.now()}_${s}`,
          type: 'reflected_bullet',
          x: proj.x,
          y: proj.y,
          vx: Math.cos(spreadAngle) * speed,
          vy: Math.sin(spreadAngle) * speed,
          radius: proj.radius * 0.8,
          damage: proj.damage * 0.7,
          color: '#E5C07B',
          life: 3.5,
          maxLife: 3.5,
          pierce: 1,
          homing: stats.reflectHoming,
          trail: [],
        });
      }
    }

    shockwavesRef.current.push({
      x: proj.x,
      y: proj.y,
      radius: 8,
      maxRadius: 50,
      color: '#C9A96E',
      width: 3,
      alpha: 1,
      speed: 300,
    });
  };

  const damagePlayer = (amount: number) => {
    const p = playerRef.current;
    if (isGodModeRef.current || isSimulationPausedRef.current || p.isDashing || gameTimeRef.current < p.invulnerableTime) return;

    p.lastDamageTime = performance.now();
    sound.playPlayerHit();
    screenShakeRef.current = 14;

    if (p.shieldHp > 0) {
      if (p.shieldHp >= amount) {
        p.shieldHp -= amount;
      } else {
        const leftover = amount - p.shieldHp;
        p.shieldHp = 0;
        p.hp -= leftover;

        if (stats.empBlastOnShieldBreak) {
          shockwavesRef.current.push({
            x: p.x,
            y: p.y,
            radius: 10,
            maxRadius: 280,
            color: '#C9A96E',
            width: 8,
            alpha: 1,
            speed: 700,
          });
          enemiesRef.current.forEach((e) => {
            const d = Math.hypot(e.x - p.x, e.y - p.y);
            if (d < 280) damageEnemy(e, 80, true, p.x, p.y);
          });
        }
      }
    } else {
      p.hp -= amount;
    }

    p.invulnerableTime = gameTimeRef.current + 0.6;
    callbacksRef.current.onHpChange(p.hp, p.maxHp, p.shieldHp, p.maxShieldHp);

    if (p.hp <= 0) {
      sound.playExplosion(true);
      callbacksRef.current.onGameOver({
        score: scoreRef.current,
        wave: waveRef.current,
        combo: maxComboRunRef.current,
        kills: killsRef.current,
      });
    }
  };

  const damageEnemy = (enemy: Enemy, amount: number, isBlade: boolean, hitX: number, hitY: number) => {
    const isCrit = Math.random() < stats.critChance;
    const finalDamage = isCrit ? amount * stats.critMultiplier : amount;
    enemy.hp -= finalDamage;

    floatingTextsRef.current.push({
      id: `dmg_${Date.now()}_${Math.random()}`,
      x: hitX + (Math.random() - 0.5) * 20,
      y: hitY - 10,
      vy: -35,
      text: `${Math.round(finalDamage)}${isCrit ? '!' : ''}`,
      color: isCrit ? '#C9A96E' : isBlade ? '#E5C07B' : '#E0E0E0',
      fontSize: isCrit ? 16 : 12,
      alpha: 1,
      decay: 0.8,
      isCrit,
    });
  };

  const killEnemy = (enemy: Enemy, index: number) => {
    sound.playExplosion(enemy.isBoss);
    killsRef.current += 1;
    scoreRef.current += enemy.points * (1 + Math.floor(comboRef.current / 4));
    callbacksRef.current.onScoreChange(scoreRef.current);

    shockwavesRef.current.push({
      x: enemy.x,
      y: enemy.y,
      radius: 10,
      maxRadius: enemy.isBoss ? 180 : 70,
      color: enemy.color,
      width: enemy.isBoss ? 6 : 3,
      alpha: 0.9,
      speed: 400,
    });

    const pCount = enemy.isBoss ? 45 : 12;
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = 50 + Math.random() * 220;
      particlesRef.current.push({
        x: enemy.x,
        y: enemy.y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        radius: 3 + Math.random() * 4,
        color: enemy.color,
        alpha: 1,
        decay: 1.8,
        shape: 'shard',
      });
    }

    const shardCount = enemy.isBoss ? 10 : enemy.isElite ? 5 : 2;
    for (let s = 0; s < shardCount; s++) {
      // Distribución de fragmentos: 92% EXP, 6% Energía, 2% HP (micro-curación táctica)
      const rand = Math.random();
      const shardType = rand < 0.02 ? 'hp' : rand < 0.08 ? 'energy' : 'exp';
      const shardValue = shardType === 'hp'
        ? (enemy.isBoss ? 10 : enemy.isElite ? 6 : 3)
        : shardType === 'energy'
        ? (enemy.isBoss ? 15 : enemy.isElite ? 10 : 5)
        : (enemy.isBoss ? 50 : enemy.isElite ? 25 : 12);

      shardsRef.current.push({
        id: `shard_${Date.now()}_${s}`,
        x: enemy.x + (Math.random() - 0.5) * 30,
        y: enemy.y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        type: shardType,
        value: shardValue,
        color: shardType === 'hp' ? '#f43f5e' : shardType === 'energy' ? '#38bdf8' : '#C9A96E',
      });
    }

    enemiesRef.current.splice(index, 1);

    if (gameMode === 'time_attack') {
      const timeBonus = enemy.isBoss ? 15 : enemy.isElite ? 4.5 : 0.35;
      timeRemainingRef.current = Math.min(300, timeRemainingRef.current + timeBonus);
      if (enemy.isBoss || enemy.isElite) {
        floatingTextsRef.current.push({
          id: `time_${Date.now()}_${Math.random()}`,
          x: enemy.x,
          y: enemy.y - 25,
          vy: -60,
          text: `+${timeBonus}s ${language === 'es' ? 'TIEMPO EXTRA' : 'TIME BONUS'}`,
          color: '#38bdf8',
          fontSize: 16,
          alpha: 1,
          decay: 1.2,
          isCrit: true,
        });
      }
    }

    if (enemy.isBoss) {
      sound.playLevelUp();
      shockwavesRef.current.push({
        x: enemy.x,
        y: enemy.y,
        radius: 20,
        maxRadius: 700,
        color: '#C9A96E',
        width: 8,
        alpha: 1,
        speed: 800,
      });

      // En Desafío de Titanes: verificar si era el último jefe en la oleada actual
      if (gameMode === 'boss_rush') {
        const remainingBosses = enemiesRef.current.filter((e) => e.isBoss && e !== enemy).length;
        if (remainingBosses === 0) {
          setTimeout(() => {
            callbacksRef.current.onLevelUp();
          }, 450);
        }
      }
    }
  };

  const updateWavesAndSpawning = (cw: number, ch: number, dt: number) => {
    waveTimerRef.current += dt;

    if (enemiesLeftInWaveRef.current <= 0 && enemiesRef.current.length === 0) {
      startWave(waveRef.current + 1);
      return;
    }

    if (enemiesLeftInWaveRef.current > 0 && waveTimerRef.current - lastSpawnTimeRef.current > 0.32) {
      lastSpawnTimeRef.current = waveTimerRef.current;
      const batch = Math.min(2, enemiesLeftInWaveRef.current);
      for (let b = 0; b < batch; b++) {
        spawnEnemyWaveUnit(cw, ch);
        enemiesLeftInWaveRef.current -= 1;
      }
    }
  };

  const spawnEnemyWaveUnit = (cw: number, ch: number) => {
    const wave = waveRef.current;
    const isBossWave = gameMode === 'boss_rush' ? true : wave % 3 === 0;
    const numBosses = isBossWave
      ? (gameMode === 'boss_rush' ? Math.min(4, 1 + Math.floor((wave - 1) / 3)) : 1 + Math.floor(wave / 12))
      : 0;
    const p = playerRef.current;

    // Generación de Jefe con escalado procedimental e invocación múltiple
    const existingBosses = enemiesRef.current.filter((e) => e.isBoss).length;
    if (isBossWave && existingBosses < numBosses) {
      const slot = existingBosses;
      const bossInfo = getBossInfoForWave(wave, gameMode, slot);
      const hp = 2600 + wave * 650 + bossInfo.bossLoop * 2000;

      // Distribuir posiciones en la arena para evitar superposición
      const totalSlots = Math.max(1, numBosses);
      const spreadOffset = (slot - (totalSlots - 1) / 2) * 420;
      const spawnX = Math.max(220, Math.min(WORLD_WIDTH - 220, p.x + spreadOffset));
      const spawnY = Math.max(180, p.y - 360 - (slot % 2) * 60);

      enemiesRef.current.push({
        id: `boss_${wave}_${slot}_${Date.now()}`,
        type: bossInfo.baseType,
        x: spawnX,
        y: spawnY,
        vx: 0,
        vy: 35,
        radius: bossInfo.radius,
        hp,
        maxHp: hp,
        speed: 105 + bossInfo.bossLoop * 8,
        color: bossInfo.color,
        shootCooldown: Math.max(0.6, 1.2 - bossInfo.bossLoop * 0.08),
        lastShootTime: 0,
        behaviorTimer: 0,
        points: 6000 + wave * 800 + bossInfo.bossLoop * 3000,
        isBoss: true,
        bossPhase: 1,
        bossName: bossInfo.bossName,
        statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
      });
      return;
    }

    // Generación de Campeones Élite en oleadas normales
    const isEliteWave = wave >= 4 && wave % 3 === 1 && Math.random() < 0.4 && enemiesRef.current.every((e) => !e.isElite);
    if (isEliteWave) {
      const eliteType = Math.random() < 0.5 ? 'elite_juggernaut' : 'elite_assassin';
      const spawnAngle = Math.random() * Math.PI * 2;
      const spawnDist = Math.max(cw, ch) * 0.6;
      const spawnX = Math.max(ARENA_PADDING + 40, Math.min(WORLD_WIDTH - ARENA_PADDING - 40, p.x + Math.cos(spawnAngle) * spawnDist));
      const spawnY = Math.max(ARENA_PADDING + 40, Math.min(WORLD_HEIGHT - ARENA_PADDING - 40, p.y + Math.sin(spawnAngle) * spawnDist));

      const eliteHp = 950 + wave * 130;
      enemiesRef.current.push({
        id: `elite_${Date.now()}_${Math.random()}`,
        type: eliteType,
        x: spawnX,
        y: spawnY,
        vx: 0,
        vy: 0,
        radius: eliteType === 'elite_juggernaut' ? 28 : 22,
        hp: eliteHp,
        maxHp: eliteHp,
        speed: eliteType === 'elite_juggernaut' ? 165 : 255,
        color: eliteType === 'elite_juggernaut' ? '#fb923c' : '#c084fc',
        shootCooldown: 1.6,
        lastShootTime: 0,
        behaviorTimer: 0,
        points: 1200 + wave * 150,
        isElite: true,
        bossName: eliteType === 'elite_juggernaut' ? 'ELITE JUGGERNAUT' : 'PHASE ASSASSIN',
        statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
      });
      return;
    }

    // Generación de enemigos normales y avanzados
    const spawnDist = Math.max(cw, ch) * 0.55 + 50 + Math.random() * 100;
    const spawnAngle = Math.random() * Math.PI * 2;
    let spawnX = p.x + Math.cos(spawnAngle) * spawnDist;
    let spawnY = p.y + Math.sin(spawnAngle) * spawnDist;

    spawnX = Math.max(ARENA_PADDING + 30, Math.min(WORLD_WIDTH - ARENA_PADDING - 30, spawnX));
    spawnY = Math.max(ARENA_PADDING + 30, Math.min(WORLD_HEIGHT - ARENA_PADDING - 30, spawnY));

    // Selección dinámica de tipos de enemigos según el progreso de la oleada
    const types: Enemy['type'][] = ['chaser', 'swarmer'];
    if (wave >= 2) types.push('shooter');
    if (wave >= 3) types.push('orbit_spitter', 'pulse_colossus');
    if (wave >= 4) types.push('sniper', 'emp_drone', 'void_stalker');
    if (wave >= 5) types.push('nanite_drone', 'plasma_bomber');

    const pickType = types[Math.floor(Math.random() * types.length)];
    let hp = 160 + wave * 36;
    let speed = 185 + wave * 6;
    let color = '#f97316';
    let radius = 16;
    let cooldown = 1.6;

    if (pickType === 'swarmer') {
      hp = 85 + wave * 22;
      speed = 265 + wave * 7;
      radius = 12;
      color = '#eab308';
    } else if (pickType === 'shooter') {
      hp = 190 + wave * 42;
      color = '#a855f7';
      speed = 150 + wave * 4;
      cooldown = 1.2;
    } else if (pickType === 'sniper') {
      hp = 210 + wave * 46;
      color = '#ec4899';
      speed = 125 + wave * 4;
      radius = 18;
      cooldown = 2.2;
    } else if (pickType === 'orbit_spitter') {
      hp = 260 + wave * 52;
      color = '#C9A96E';
      speed = 150 + wave * 4;
      radius = 20;
      cooldown = 1.6;
    } else if (pickType === 'emp_drone') {
      hp = 180 + wave * 38;
      color = '#06b6d4';
      speed = 215 + wave * 6;
      radius = 14;
    } else if (pickType === 'pulse_colossus') {
      hp = 450 + wave * 75;
      color = '#38bdf8';
      speed = 120 + wave * 3;
      radius = 26;
      cooldown = 2.0;
    } else if (pickType === 'void_stalker') {
      hp = 300 + wave * 58;
      color = '#a855f7';
      speed = 190 + wave * 5;
      radius = 18;
    } else if (pickType === 'nanite_drone') {
      hp = 200 + wave * 44;
      color = '#10b981';
      speed = 220 + wave * 6;
      radius = 15;
    } else if (pickType === 'plasma_bomber') {
      hp = 250 + wave * 52;
      color = '#f59e0b';
      speed = 140 + wave * 4;
      radius = 22;
      cooldown = 2.4;
    }

    enemiesRef.current.push({
      id: `enemy_${Date.now()}_${Math.random()}`,
      type: pickType,
      x: spawnX,
      y: spawnY,
      vx: 0,
      vy: 0,
      radius,
      hp,
      maxHp: hp,
      speed,
      color,
      shootCooldown: cooldown,
      lastShootTime: 0,
      behaviorTimer: 0,
      points: 150 + wave * 35,
      statusEffects: { burnDuration: 0, burnDps: 0, freezeDuration: 0, shockDuration: 0 },
    });
  };

  const updateParticlesAndTexts = (dt: number) => {
    if (screenShakeRef.current > 0) {
      screenShakeRef.current = Math.max(0, screenShakeRef.current - 25 * dt);
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const part = particlesRef.current[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.alpha -= part.decay * dt;
      if (part.alpha <= 0) {
        particlesRef.current.splice(i, 1);
      }
    }

    for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
      const sw = shockwavesRef.current[i];
      sw.radius += sw.speed * dt;
      sw.alpha = 1 - sw.radius / sw.maxRadius;
      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        shockwavesRef.current.splice(i, 1);
      }
    }

    for (let i = floatingTextsRef.current.length - 1; i >= 0; i--) {
      const txt = floatingTextsRef.current[i];
      txt.y += txt.vy * dt;
      txt.alpha -= txt.decay * dt;
      if (txt.alpha <= 0) {
        floatingTextsRef.current.splice(i, 1);
      }
    }
  };

  // --- RUTINAS DE RENDERIZADO ---

  const renderGame = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
    ctx.save();

    ctx.fillStyle = '#040404';
    ctx.fillRect(0, 0, cw, ch);

    const cam = cameraRef.current;
    const parallaxX = -cam.x * 0.15;
    const parallaxY = -cam.y * 0.15;

    ctx.save();
    bgStarsRef.current.forEach((star) => {
      const starScreenX = (star.x + parallaxX + cw * 2) % cw;
      const starScreenY = (star.y + parallaxY + ch * 2) % ch;
      ctx.beginPath();
      ctx.arc(starScreenX, starScreenY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${star.alpha * 0.4})`;
      ctx.fill();
    });
    ctx.restore();

    let shakeX = 0;
    let shakeY = 0;
    if (screenShakeRef.current > 0) {
      shakeX = (Math.random() - 0.5) * screenShakeRef.current;
      shakeY = (Math.random() - 0.5) * screenShakeRef.current;
    }
    // Transformar el Lienzo a Coordenadas del Mundo
    ctx.save();
    ctx.translate(cw / 2 - cam.x + shakeX, ch / 2 - cam.y + shakeY);

    // Cuadrícula del Suelo del Mundo
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const gridSize = 100;
    const startGX = Math.floor((cam.x - cw / 2) / gridSize) * gridSize;
    const endGX = Math.ceil((cam.x + cw / 2) / gridSize) * gridSize;
    const startGY = Math.floor((cam.y - ch / 2) / gridSize) * gridSize;
    const endGY = Math.ceil((cam.y + ch / 2) / gridSize) * gridSize;

    for (let x = startGX; x <= endGX; x += gridSize) {
      if (x >= ARENA_PADDING && x <= WORLD_WIDTH - ARENA_PADDING) {
        ctx.beginPath();
        ctx.moveTo(x, Math.max(ARENA_PADDING, startGY));
        ctx.lineTo(x, Math.min(WORLD_HEIGHT - ARENA_PADDING, endGY));
        ctx.stroke();
      }
    }
    for (let y = startGY; y <= endGY; y += gridSize) {
      if (y >= ARENA_PADDING && y <= WORLD_HEIGHT - ARENA_PADDING) {
        ctx.beginPath();
        ctx.moveTo(Math.max(ARENA_PADDING, startGX), y);
        ctx.lineTo(Math.min(WORLD_WIDTH - ARENA_PADDING, endGX), y);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Límites Perimetrales de la Arena
    ctx.save();
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(ARENA_PADDING, ARENA_PADDING, WORLD_WIDTH - ARENA_PADDING * 2, WORLD_HEIGHT - ARENA_PADDING * 2);
    ctx.restore();

    // Singularidades
    singularitiesRef.current.forEach((sing) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(sing.x, sing.y, sing.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#050505';
      ctx.shadowColor = '#C9A96E';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.strokeStyle = '#C9A96E';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    });

    // Fragmentos Cuánticos
    shardsRef.current.forEach((shard) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(shard.x, shard.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = shard.type === 'hp' ? '#ef4444' : shard.type === 'energy' ? '#38bdf8' : '#C9A96E';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });

    // Enemigos (Renderizador Personalizado con Siluetas Únicas y Llamas de Propulsores)
    const nowTime = performance.now();
    enemiesRef.current.forEach((enemy) => {
      drawEnemy(ctx, enemy, nowTime);
    });

    // Proyectiles
    projectilesRef.current.forEach((proj) => {
      ctx.save();
      if (proj.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(proj.trail[0].x, proj.trail[0].y);
        for (let t = 1; t < proj.trail.length; t++) {
          ctx.lineTo(proj.trail[t].x, proj.trail[t].y);
        }
        ctx.strokeStyle = proj.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = proj.radius;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
      ctx.fillStyle = proj.color;
      ctx.shadowColor = proj.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    });

    // 1. Anillo Guía del Campo de Resonancia Orbital
    const p = playerRef.current;
    const baseOrbitR = bladesRef.current[0]?.baseRadius || 75;
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, baseOrbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.16)';
    ctx.setLineDash([5, 9]);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 2. Cuerdas de Plasma Energético conectando el Núcleo a las Empuñaduras de las Hojas (Coordenadas del Mundo)
    bladesRef.current.forEach((blade) => {
      const isExtended = blade.isThrusting || blade.isReturning;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(blade.x, blade.y);
      ctx.strokeStyle = isExtended ? 'rgba(201, 169, 110, 0.55)' : 'rgba(201, 169, 110, 0.2)';
      ctx.lineWidth = isExtended ? 1.5 : 1;
      ctx.stroke();

      // Filamento de pulso de energía resplandeciente
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(blade.x, blade.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    });

    // 3. Estelas Radiantes de Arco de Plasma (Coordenadas del Mundo)
    bladesRef.current.forEach((blade) => {
      if (blade.trail.length > 2) {
        for (let t = 1; t < blade.trail.length; t++) {
          const p0 = blade.trail[t - 1];
          const p1 = blade.trail[t];
          const progress = t / (blade.trail.length - 1);
          const alpha = progress * (blade.isThrusting ? 0.85 : 0.55);
          const width = Math.max(1, progress * blade.width * 1.6);

          ctx.save();
          // Arco de aura de plasma exterior
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = blade.color;
          ctx.globalAlpha = alpha * 0.65;
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.shadowColor = blade.color;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Espina de láser incandescente interior
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = '#FFFFFF';
          ctx.globalAlpha = alpha * 0.9;
          ctx.lineWidth = Math.max(0.8, width * 0.3);
          ctx.lineCap = 'round';
          ctx.stroke();
          ctx.restore();
        }
      }
    });

    // 4. Núcleo del Dron del Jugador
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);

    // Cúpula del escudo
    if (p.shieldHp > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, p.radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.8)';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = '#C9A96E';
      ctx.shadowBlur = 12;
      ctx.stroke();
    }

    // Llamas de propulsor de iones trasero
    if (!p.isDashing) {
      const thrusterPulse = Math.sin(nowTime * 0.02) * 3;
      ctx.beginPath();
      ctx.moveTo(-p.radius * 0.85, -5);
      ctx.lineTo(-p.radius * 1.3 - thrusterPulse, 0);
      ctx.lineTo(-p.radius * 0.85, 5);
      ctx.closePath();
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    // Casco triangular del jugador
    ctx.beginPath();
    ctx.moveTo(p.radius * 1.3, 0);
    ctx.lineTo(-p.radius * 0.9, -p.radius * 0.85);
    ctx.lineTo(-p.radius * 0.5, 0);
    ctx.lineTo(-p.radius * 0.9, p.radius * 0.85);
    ctx.closePath();
    ctx.fillStyle = '#080a0f';
    ctx.fill();
    ctx.strokeStyle = p.isDashing ? '#FFFFFF' : '#C9A96E';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = '#C9A96E';
    ctx.shadowBlur = p.isDashing ? 18 : 6;
    ctx.stroke();

    // Líneas de acento interiores doradas del casco
    ctx.beginPath();
    ctx.moveTo(p.radius * 0.6, 0);
    ctx.lineTo(-p.radius * 0.5, -p.radius * 0.45);
    ctx.moveTo(p.radius * 0.6, 0);
    ctx.lineTo(-p.radius * 0.5, p.radius * 0.45);
    ctx.strokeStyle = 'rgba(201, 169, 110, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Gema del Núcleo Central
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF2D6';
    ctx.shadowColor = '#C9A96E';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    // 5. Orbital Blades (Kinetic High-Frequency Cyber-Razor Design)
    bladesRef.current.forEach((blade) => {
      ctx.save();
      ctx.translate(blade.x, blade.y);

      // Tangent forward slicing direction in orbit
      let bladeDirAngle = blade.angle + Math.PI / 2;
      if (blade.isThrusting && blade.thrustTarget) {
        bladeDirAngle = Math.atan2(blade.thrustTarget.y - blade.y, blade.thrustTarget.x - blade.x);
      } else if (blade.isReturning) {
        const targetOrbitX = p.x + Math.cos(blade.angle) * blade.baseRadius;
        const targetOrbitY = p.y + Math.sin(blade.angle) * blade.baseRadius;
        const returnAngle = Math.atan2(targetOrbitY - blade.y, targetOrbitX - blade.x);
        const distToOrbit = Math.hypot(targetOrbitX - blade.x, targetOrbitY - blade.y);
        if (distToOrbit < 45) {
          const blend = Math.max(0, Math.min(1, distToOrbit / 45));
          bladeDirAngle = returnAngle * blend + (blade.angle + Math.PI / 2) * (1 - blend);
        } else {
          bladeDirAngle = returnAngle;
        }
      }

      ctx.rotate(bladeDirAngle);

      const bLen = blade.length;
      const bWid = blade.width;

      ctx.save();
      ctx.shadowColor = blade.color;
      ctx.shadowBlur = blade.isThrusting ? 22 : 12;

      // Backward micro-thruster exhaust when thrusting or spinning fast
      if (blade.isThrusting) {
        ctx.beginPath();
        ctx.moveTo(-bLen * 0.42, -bWid * 0.25);
        ctx.lineTo(-bLen * 0.75 - Math.random() * 8, 0);
        ctx.lineTo(-bLen * 0.42, bWid * 0.25);
        ctx.closePath();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      // Outer Scythe-Curved Razor Profile (Obsidian Armor Chassis)
      ctx.beginPath();
      ctx.moveTo(bLen * 0.65, 0); // Sharp penetrator tip
      ctx.lineTo(bLen * 0.25, -bWid * 0.55); // Top swept outer edge
      ctx.lineTo(-bLen * 0.35, -bWid * 0.38); // Top rear flank
      ctx.lineTo(-bLen * 0.42, 0); // Rear emitter bracket
      ctx.lineTo(-bLen * 0.35, bWid * 0.38); // Bottom rear flank
      ctx.lineTo(bLen * 0.25, bWid * 0.55); // Bottom swept outer edge
      ctx.closePath();
      ctx.fillStyle = '#0b0e14';
      ctx.fill();
      ctx.strokeStyle = '#C9A96E';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Dual Plasma Energy Cutting Wings (Radiant Glow)
      ctx.beginPath();
      ctx.moveTo(bLen * 0.6, 0);
      ctx.lineTo(bLen * 0.22, -bWid * 0.42);
      ctx.lineTo(-bLen * 0.25, -bWid * 0.25);
      ctx.lineTo(-bLen * 0.25, bWid * 0.25);
      ctx.lineTo(bLen * 0.22, bWid * 0.42);
      ctx.closePath();
      ctx.fillStyle = blade.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Inner High-Voltage Resonator Cavity
      ctx.beginPath();
      ctx.moveTo(bLen * 0.45, 0);
      ctx.lineTo(bLen * 0.1, -bWid * 0.2);
      ctx.lineTo(-bLen * 0.2, 0);
      ctx.lineTo(bLen * 0.1, bWid * 0.2);
      ctx.closePath();
      ctx.fillStyle = '#111827';
      ctx.fill();

      // Superheated White-Hot Core Laser Spine
      ctx.beginPath();
      ctx.moveTo(bLen * 0.62, 0);
      ctx.lineTo(-bLen * 0.28, 0);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Chrono Energy Resonator Gem at Base
      ctx.beginPath();
      ctx.arc(-bLen * 0.2, 0, Math.max(1.5, bWid * 0.22), 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8DC';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Emitter housing bracket
      ctx.fillStyle = '#C9A96E';
      ctx.fillRect(-bLen * 0.38, -bWid * 0.22, bLen * 0.08, bWid * 0.44);

      ctx.restore();
      ctx.restore();
    });

    // Particles & Shockwaves
    particlesRef.current.forEach((part) => {
      const pRad = Math.max(0.5, part.radius);
      ctx.save();
      ctx.globalAlpha = Math.max(0, part.alpha);
      ctx.beginPath();
      ctx.arc(part.x, part.y, pRad, 0, Math.PI * 2);
      ctx.fillStyle = part.color;
      ctx.fill();
      ctx.restore();
    });

    shockwavesRef.current.forEach((sw) => {
      const swRad = Math.max(0.5, sw.radius);
      ctx.save();
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, swRad, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = Math.max(1, sw.width);
      ctx.stroke();
      ctx.restore();
    });

    // Floating Numbers
    floatingTextsRef.current.forEach((txt) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, txt.alpha);
      ctx.font = `bold ${txt.fontSize}px monospace`;
      ctx.fillStyle = txt.color;
      ctx.textAlign = 'center';
      ctx.fillText(txt.text, txt.x, txt.y);
      ctx.restore();
    });

    ctx.restore(); // Restore Camera transform

    // --- SCREEN SPACE OVERLAYS ---
    renderSectorAnnouncementBanner(ctx, cw, ch);
    renderTacticalRadar(ctx, cw, ch, p, cam);
    ctx.restore();
  };

  // Sector Announcement Banner
  const renderSectorAnnouncementBanner = (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
    const banner = sectorBannerRef.current;
    if (!banner.active) return;

    const progress = 1 - banner.timer / banner.maxTimer;
    let alpha = 1;
    if (progress > 0.8) alpha = (1 - progress) / 0.2;
    else if (progress < 0.25) alpha = progress / 0.25;
    alpha = Math.max(0, Math.min(1, alpha));

    ctx.save();
    ctx.globalAlpha = alpha;

    const bannerW = Math.min(cw * 0.85, 540);
    const bannerH = 78;
    const bannerX = (cw - bannerW) / 2;
    const bannerY = ch * 0.18;

    ctx.fillStyle = 'rgba(8, 8, 8, 0.94)';
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 12);
    ctx.fill();

    ctx.strokeStyle = banner.isBoss ? '#ef4444' : '#C9A96E';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = banner.isBoss ? '#ef4444' : '#C9A96E';
    ctx.shadowBlur = 16;
    ctx.stroke();

    const cornerSize = 14;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bannerX, bannerY + cornerSize);
    ctx.lineTo(bannerX, bannerY);
    ctx.lineTo(bannerX + cornerSize, bannerY);
    ctx.moveTo(bannerX + bannerW - cornerSize, bannerY);
    ctx.lineTo(bannerX + bannerW, bannerY);
    ctx.lineTo(bannerX + bannerW, bannerY + cornerSize);
    ctx.moveTo(bannerX, bannerY + bannerH - cornerSize);
    ctx.lineTo(bannerX, bannerY + bannerH);
    ctx.lineTo(bannerX + cornerSize, bannerY + bannerH);
    ctx.moveTo(bannerX + bannerW - cornerSize, bannerY + bannerH);
    ctx.lineTo(bannerX + bannerW, bannerY + bannerH);
    ctx.lineTo(bannerX + bannerW, bannerY + bannerH - cornerSize);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 18px serif';
    ctx.fillStyle = banner.isBoss ? '#ef4444' : '#C9A96E';
    ctx.fillText(banner.title, cw / 2, bannerY + 34);

    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillText(banner.subtitle, cw / 2, bannerY + 56);

    ctx.restore();
  };

  // Radar / Minimap
  const renderTacticalRadar = (
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    p: Player,
    cam: { x: number; y: number }
  ) => {
    const radarW = 120;
    const radarH = 92;
    const radarX = 20;
    // Elevated above bottom dock/upgrades tray
    const radarY = ch - radarH - 78;

    ctx.save();
    ctx.fillStyle = 'rgba(8, 8, 8, 0.85)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(radarX, radarY, radarW, radarH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(201, 169, 110, 0.7)';
    ctx.font = '8px monospace';
    ctx.fillText('RADAR // SEC-SCAN', radarX + 8, radarY + 12);

    const mapX = (wx: number) => radarX + (wx / WORLD_WIDTH) * radarW;
    const mapY = (wy: number) => radarY + (wy / WORLD_HEIGHT) * (radarH - 16) + 14;

    const viewW = (cw / WORLD_WIDTH) * radarW;
    const viewH = (ch / WORLD_HEIGHT) * (radarH - 16);
    const viewX = mapX(cam.x) - viewW / 2;
    const viewY = mapY(cam.y) - viewH / 2;

    ctx.strokeStyle = 'rgba(201, 169, 110, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(viewX, viewY, viewW, viewH);

    shardsRef.current.forEach((shard) => {
      ctx.fillStyle = 'rgba(201, 169, 110, 0.5)';
      ctx.fillRect(mapX(shard.x) - 1, mapY(shard.y) - 1, 2, 2);
    });

    enemiesRef.current.forEach((enemy) => {
      if (enemy.isBoss) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(mapX(enemy.x), mapY(enemy.y), 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (enemy.isElite) {
        ctx.fillStyle = '#fb923c';
        ctx.fillRect(mapX(enemy.x) - 2, mapY(enemy.y) - 2, 4, 4);
      } else {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(mapX(enemy.x) - 1.5, mapY(enemy.y) - 1.5, 3, 3);
      }
    });

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(mapX(p.x), mapY(p.y), 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const renderPauseOverlay = (ctx: CanvasRenderingContext2D, cw: number, ch: number, isSandbox?: boolean) => {
    ctx.save();
    // Soft transparent dark tint over arena
    ctx.fillStyle = isSandbox ? 'rgba(4, 6, 18, 0.45)' : 'rgba(3, 7, 18, 0.55)';
    ctx.fillRect(0, 0, cw, ch);

    if (isSandbox) {
      // Sleek Matrix Lab paused status badge on canvas
      const badgeText = language === 'es' ? 'LABORATORIO MATRIX // SIMULACIÓN EN PAUSA' : 'MATRIX LAB // SIMULATION PAUSED';
      ctx.font = 'bold 11px monospace';
      const textWidth = ctx.measureText(badgeText).width;
      const bx = cw / 2 - (textWidth + 32) / 2;
      const by = 24;
      const bw = textWidth + 32;
      const bh = 26;

      ctx.fillStyle = 'rgba(15, 10, 30, 0.88)';
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, 13);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c084fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, cw / 2, by + bh / 2);
    }
    ctx.restore();
  };

  const renderStaticBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const cw = canvas.width / (window.devicePixelRatio || 1);
    const ch = canvas.height / (window.devicePixelRatio || 1);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, cw, ch);
  };

  // Slingshot Blade towards Target in World Coordinates
  const slingshotBlade = (targetX: number, targetY: number) => {
    if (isSimulationPausedRef.current) return;
    const availableBlade = bladesRef.current.find((b) => !b.isThrusting && !b.isReturning);
    if (availableBlade) {
      availableBlade.isThrusting = true;
      availableBlade.thrustTarget = { x: targetX, y: targetY };
      sound.playSlash(comboRef.current);
    }
  };

  // Mouse & Touch Input Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    mouseScreenPosRef.current = { x: sx, y: sy };
    mouseWorldPosRef.current = {
      x: sx - rect.width / 2 + cameraRef.current.x,
      y: sy - rect.height / 2 + cameraRef.current.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      slingshotBlade(mouseWorldPosRef.current.x, mouseWorldPosRef.current.y);
    }
  };

  // Touch Screen Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setTouchActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const tx = touch.clientX - rect.left;
      const ty = touch.clientY - rect.top;

      if (tx < rect.width * 0.45) {
        touchJoystickRef.current = {
          active: true,
          startX: tx,
          startY: ty,
          currX: tx,
          currY: ty,
        };
      } else {
        const worldTx = tx - rect.width / 2 + cameraRef.current.x;
        const worldTy = ty - rect.height / 2 + cameraRef.current.y;
        mouseWorldPosRef.current = { x: worldTx, y: worldTy };
        slingshotBlade(worldTx, worldTy);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const tx = touch.clientX - rect.left;
      const ty = touch.clientY - rect.top;

      if (touchJoystickRef.current.active && tx < rect.width * 0.5) {
        touchJoystickRef.current.currX = tx;
        touchJoystickRef.current.currY = ty;
      } else {
        mouseScreenPosRef.current = { x: tx, y: ty };
        mouseWorldPosRef.current = {
          x: tx - rect.width / 2 + cameraRef.current.x,
          y: ty - rect.height / 2 + cameraRef.current.y,
        };
      }
    }
  };

  const handleTouchEnd = () => {
    touchJoystickRef.current.active = false;
  };

  return (
    <div
      id="game-canvas-container"
      className="relative w-full h-full select-none overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        id="chronopulse-canvas"
        className="w-full h-full cursor-crosshair block"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Mobile On-Screen Action Buttons */}
      {touchActive && (
        <div id="mobile-touch-controls" className="absolute bottom-6 right-6 flex items-center gap-3 pointer-events-auto z-20">
          <button
            id="btn-touch-slowmo"
            onTouchStart={() => {
              touchSlowMoRef.current = true;
            }}
            onTouchEnd={() => {
              touchSlowMoRef.current = false;
            }}
            onMouseDown={() => {
              touchSlowMoRef.current = true;
            }}
            onMouseUp={() => {
              touchSlowMoRef.current = false;
            }}
            className="w-14 h-14 rounded-full bg-black/80 active:bg-[#C9A96E] text-[#C9A96E] active:text-black font-serif font-bold flex flex-col items-center justify-center border-2 border-[#C9A96E]/60 shadow-lg shadow-black"
          >
            <span className="text-[10px] tracking-wider uppercase">{language === 'es' ? 'SLOW' : 'SLOW'}</span>
          </button>

          <button
            id="btn-touch-dash"
            onClick={triggerDash}
            className="w-14 h-14 rounded-full bg-[#C9A96E]/80 active:bg-[#C9A96E] text-black font-serif font-bold flex flex-col items-center justify-center border-2 border-white/60 shadow-lg shadow-black"
          >
            <span className="text-[10px] tracking-wider uppercase">{language === 'es' ? 'DASH' : 'DASH'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
