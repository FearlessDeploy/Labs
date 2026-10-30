export type GameMode = 'survival' | 'boss_rush' | 'time_attack' | 'sandbox';
export type GameState = 'menu' | 'playing' | 'paused' | 'upgrade_select' | 'game_over' | 'victory';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxHp: number;
  hp: number;
  maxEnergy: number;
  energy: number;
  energyRegen: number;
  speed: number;
  dashCooldown: number;
  lastDashTime: number;
  isDashing: boolean;
  dashDuration: number;
  dashStartTime: number;
  invulnerableTime: number;
  lastDamageTime: number;
  rotation: number;
  shieldHp: number;
  maxShieldHp: number;
}

export interface Blade {
  id: string;
  orbitRadius: number;
  baseRadius: number;
  angle: number;
  angularVelocity: number;
  x: number;
  y: number;
  length: number;
  width: number;
  damage: number;
  isThrusting: boolean;
  isReturning: boolean;
  thrustTarget?: Vector2D;
  thrustSpeed: number;
  comboReflectCount: number;
  color: string;
  trail: Vector2D[];
}

export type EnemyType =
  | 'chaser'         // Dardo aerodinámico rápido, embiste y flanquea al jugador
  | 'shooter'        // Crucero con torreta doble, dispara ráfagas de plasma
  | 'sniper'         // Francotirador de riel iónico, apunta con haz de carga
  | 'orbit_spitter'  // Portador de minas hexagonales, gira con pulsos radiales
  | 'swarmer'        // Enjambre ágil de microvíboras
  | 'emp_drone'      // Orbe anulador con anillos giroscópicos
  | 'pulse_colossus' // Tanque pesado blindado con repulsión gravitatoria
  | 'void_stalker'   // Cazador con escudo cinético frontal
  | 'nanite_drone'   // Dron de reparación y soporte con escudos
  | 'plasma_bomber'  // Bombardero táctico que suelta plasma en racimo
  | 'elite_juggernaut' // Demoledor blindado pesado con salvas de cohetes
  | 'elite_assassin'   // Atacante sigiloso con desplazamiento de fase
  | 'boss_titan'     // Arquetipo de Jefe 1: Titan Dreadnought
  | 'boss_weaver'    // Arquetipo de Jefe 2: Chrono Weaver
  | 'boss_hexcore'   // Arquetipo de Jefe 3: Hex-Core Overlord
  | 'boss_valkyrie'  // Arquetipo de Jefe 4: Obsidian Valkyrie
  | 'boss_singularity'; // Arquetipo de Jefe 5: Apex Null-Singularity

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  speed: number;
  color: string;
  shootCooldown: number;
  lastShootTime: number;
  chargeTime?: number;
  isCharging?: boolean;
  targetPos?: Vector2D;
  behaviorTimer: number;
  points: number;
  rotation?: number;
  dodgeCooldown?: number;
  isDodging?: boolean;
  dodgeTimer?: number;
  stealthAlpha?: number;
  shieldHp?: number;
  maxShieldHp?: number;
  isBoss?: boolean;
  bossPhase?: number;
  bossName?: string;
  isElite?: boolean;
  statusEffects: {
    burnDuration: number;
    burnDps: number;
    freezeDuration: number;
    shockDuration: number;
  };
}

export type ProjectileType =
  | 'enemy_bullet'
  | 'enemy_laser'
  | 'reflected_bullet'
  | 'player_missile'
  | 'tesla_spark'
  | 'singularity_core';

export interface Projectile {
  id: string;
  type: ProjectileType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  life: number;
  maxLife: number;
  pierce: number;
  homing?: boolean;
  homingTargetId?: string;
  homingStrength?: number;
  reflectedCount?: number;
  splitsOnHit?: boolean;
  ignites?: boolean;
  freezes?: boolean;
  trail: Vector2D[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  shape?: 'circle' | 'spark' | 'ring' | 'shard';
  sizeDecay?: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  fontSize: number;
  alpha: number;
  decay: number;
  isCrit?: boolean;
}

export interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  width: number;
  alpha: number;
  speed: number;
}

export interface Singularity {
  id: string;
  x: number;
  y: number;
  radius: number;
  pullRadius: number;
  pullForce: number;
  duration: number;
  maxDuration: number;
  damagePerTick: number;
}

export interface TemporalEcho {
  x: number;
  y: number;
  rotation: number;
  alpha: number;
  bladeAngle: number;
  timestamp: number;
}

export type UpgradeRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'synergy';

export interface Upgrade {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  rarity: UpgradeRarity;
  tier: number;
  maxLevel: number;
  level: number;
  synergyRequires?: string[];
  apply: (stats: GameUpgradeStats) => void;
}

export interface GameUpgradeStats {
  maxHpBonus: number;
  hpRegenPerSec: number;
  speedMultiplier: number;
  energyMaxBonus: number;
  energyRegenMultiplier: number;
  slowMoDilationFactor: number; // menor = tiempo más lento (0.08 por defecto)
  slowMoCostReduction: number;
  bladeCount: number;
  bladeDamageMultiplier: number;
  bladeSizeMultiplier: number;
  bladeOrbitSpeedMultiplier: number;
  bladeThrustRangeMultiplier: number;
  reflectDamageMultiplier: number;
  reflectSplitCount: number; // divide la bala reflejada en múltiples
  reflectHoming: boolean;
  reflectIgnite: boolean;
  reflectFreeze: boolean;
  dashCooldownMultiplier: number;
  dashInvulnerabilityBonus: number;
  dashSlashesEnemies: boolean;
  dashFreezesTime: boolean;
  hasSingularityOnDash: boolean;
  hasTeslaChains: boolean;
  hasTemporalEchoes: boolean;
  critChance: number;
  critMultiplier: number;
  magneticRadius: number;
  shieldMax: number;
  shieldRegenPerSec: number;
  empBlastOnShieldBreak: boolean;
}

export interface DropShard {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'exp' | 'hp' | 'energy';
  value: number;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
}

export interface UserGameStats {
  highScore: number;
  maxWave: number;
  totalKills: number;
  bossesKilled: number;
  maxCombo: number;
  totalReflections: number;
  totalTimeSlowSeconds: number;
  gamesPlayed: number;
  victories: number;
}

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  muted: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  mode: GameMode;
  wave: number;
  combo: number;
  kills: number;
  date: string;
  isPlayer?: boolean;
}
