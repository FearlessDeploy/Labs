import { GameUpgradeStats, Upgrade } from '../types/game';

export const INITIAL_UPGRADE_STATS: GameUpgradeStats = {
  maxHpBonus: 0,
  hpRegenPerSec: 0,
  speedMultiplier: 1.0,
  energyMaxBonus: 0,
  energyRegenMultiplier: 1.0,
  slowMoDilationFactor: 0.12, // 12% de velocidad normal en cámara lenta
  slowMoCostReduction: 0,
  bladeCount: 1,
  bladeDamageMultiplier: 1.0,
  bladeSizeMultiplier: 1.0,
  bladeOrbitSpeedMultiplier: 1.0,
  bladeThrustRangeMultiplier: 1.0,
  reflectDamageMultiplier: 1.5,
  reflectSplitCount: 0,
  reflectHoming: false,
  reflectIgnite: false,
  reflectFreeze: false,
  dashCooldownMultiplier: 1.0,
  dashInvulnerabilityBonus: 0,
  dashSlashesEnemies: false,
  dashFreezesTime: false,
  hasSingularityOnDash: false,
  hasTeslaChains: false,
  hasTemporalEchoes: false,
  critChance: 0.1,
  critMultiplier: 2.0,
  magneticRadius: 120,
  shieldMax: 50,
  shieldRegenPerSec: 5,
  empBlastOnShieldBreak: false,
};

export const UPGRADES_DATABASE: Upgrade[] = [
  // --- NIVEL COMÚN ---
  {
    id: 'kinetic_edge',
    name: 'Kinetic Edge',
    nameEs: 'Filo Cinético',
    description: '+25% Blade damage and +15% orbit speed.',
    descriptionEs: '+25% de daño de la hoja y +15% de velocidad orbital.',
    icon: 'Sword',
    rarity: 'common',
    tier: 1,
    maxLevel: 5,
    level: 0,
    apply: (s) => {
      s.bladeDamageMultiplier += 0.25;
      s.bladeOrbitSpeedMultiplier += 0.15;
    },
  },
  {
    id: 'quantum_capacitor',
    name: 'Quantum Capacitor',
    nameEs: 'Capacitor Cuántico',
    description: '+25 Max Chrono Energy and +15% Energy Regen.',
    descriptionEs: '+25 de Energía Máxima y +15% de regeneración energética.',
    icon: 'Zap',
    rarity: 'common',
    tier: 1,
    maxLevel: 4,
    level: 0,
    apply: (s) => {
      s.energyMaxBonus += 25;
      s.energyRegenMultiplier = Math.min(1.65, s.energyRegenMultiplier + 0.15);
    },
  },
  {
    id: 'aerovane_thrusters',
    name: 'Aerovane Thrusters',
    nameEs: 'Propulsores Aerovane',
    description: '+18% Drone movement speed & +20% Dash distance.',
    descriptionEs: '+18% velocidad del dron y +20% distancia del impulso.',
    icon: 'Wind',
    rarity: 'common',
    tier: 1,
    maxLevel: 4,
    level: 0,
    apply: (s) => {
      s.speedMultiplier += 0.18;
      s.magneticRadius += 30;
    },
  },
  {
    id: 'nano_plating',
    name: 'Nano Plating',
    nameEs: 'Nanoblindaje',
    description: '+30 Max HP and +0.8 HP/sec passive repair.',
    descriptionEs: '+30 Salud Máxima y +0.8 de regeneración por segundo.',
    icon: 'ShieldPlus',
    rarity: 'common',
    tier: 1,
    maxLevel: 4,
    level: 0,
    apply: (s) => {
      s.maxHpBonus += 30;
      s.hpRegenPerSec = Math.min(3.2, s.hpRegenPerSec + 0.8);
    },
  },
  {
    id: 'magnetic_attractor',
    name: 'Magnetic Attractor',
    nameEs: 'Atractor Magnético',
    description: '+100% Shard pickup radius & +15% drop rate.',
    descriptionEs: '+100% radio de atracción de fragmentos cuánticos.',
    icon: 'Magnet',
    rarity: 'common',
    tier: 1,
    maxLevel: 3,
    level: 0,
    apply: (s) => {
      s.magneticRadius += 100;
    },
  },
  {
    id: 'precision_optics',
    name: 'Precision Optics',
    nameEs: 'Óptica de Precisión',
    description: '+15% Critical strike chance and +50% Crit multiplier.',
    descriptionEs: '+15% prob. de golpe crítico y +50% daño crítico.',
    icon: 'Target',
    rarity: 'common',
    tier: 1,
    maxLevel: 3,
    level: 0,
    apply: (s) => {
      s.critChance = Math.min(0.85, s.critChance + 0.15);
      s.critMultiplier += 0.5;
    },
  },

  // --- NIVEL RARO ---
  {
    id: 'prism_reflector',
    name: 'Prism Reflector',
    nameEs: 'Reflector Prismático',
    description: 'Reflected projectiles split into 2 secondary plasma bolts with +50% speed.',
    descriptionEs: 'Los proyectiles reflejados se dividen en 2 proyectiles secundarios +50% más veloces.',
    icon: 'Sparkles',
    rarity: 'rare',
    tier: 2,
    maxLevel: 3,
    level: 0,
    apply: (s) => {
      s.reflectSplitCount += 2;
      s.reflectDamageMultiplier += 0.5;
    },
  },
  {
    id: 'dilated_focus',
    name: 'Dilated Focus',
    nameEs: 'Enfoque Dilatado',
    description: 'Slow motion slows time further (to 7% speed) with 20% less energy drain.',
    descriptionEs: 'La cámara lenta ralentiza el tiempo aún más (al 7%) y consume 20% menos energía.',
    icon: 'Clock',
    rarity: 'rare',
    tier: 2,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.slowMoDilationFactor = Math.max(0.05, s.slowMoDilationFactor * 0.7);
      s.slowMoCostReduction = Math.min(0.45, s.slowMoCostReduction + 0.20);
    },
  },
  {
    id: 'overdrive_dash',
    name: 'Overdrive Dash',
    nameEs: 'Impulso Sobremarcha',
    description: 'Dashing slices through enemies with blade damage and grants 0.3s temporal distortion.',
    descriptionEs: 'El impulso atraviesa enemigos causándoles daño de hoja y genera distorsión temporal 0.3s.',
    icon: 'FastForward',
    rarity: 'rare',
    tier: 2,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.dashSlashesEnemies = true;
      s.dashFreezesTime = true;
      s.dashCooldownMultiplier = Math.max(0.7, s.dashCooldownMultiplier * 0.88);
    },
  },
  {
    id: 'barrier_matrix',
    name: 'Barrier Matrix',
    nameEs: 'Matriz de Barrera',
    description: '+40 Max Energy Shield & triggers EMP shockwave when depleted.',
    descriptionEs: '+40 de Escudo de Energía y detona una onda EMP masiva si se agota.',
    icon: 'ShieldAlert',
    rarity: 'rare',
    tier: 2,
    maxLevel: 3,
    level: 0,
    apply: (s) => {
      s.shieldMax = Math.min(170, s.shieldMax + 40);
      s.shieldRegenPerSec = Math.min(7.5, s.shieldRegenPerSec + 2.0);
      s.empBlastOnShieldBreak = true;
    },
  },
  {
    id: 'heavy_greatblade',
    name: 'Supermassive Blade',
    nameEs: 'Hoja Supermasiva',
    description: '+80% Blade scale and length, destroying destructive laser beams.',
    descriptionEs: '+80% tamaño y longitud de la hoja, permitiendo bloquear rayos láser continuos.',
    icon: 'Maximize2',
    rarity: 'rare',
    tier: 2,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.bladeSizeMultiplier += 0.8;
      s.bladeDamageMultiplier += 0.4;
    },
  },

  // --- NIVEL ÉPICO ---
  {
    id: 'dual_orbit',
    name: 'Dual Orbit Blades',
    nameEs: 'Hojas Orbitales Dobles',
    description: 'Unlocks a second synchronized resonance blade orbiting opposite to your first.',
    descriptionEs: 'Desbloquea una segunda hoja cuántica resonante que orbita en posición opuesta.',
    icon: 'Layers',
    rarity: 'epic',
    tier: 3,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.bladeCount += 1;
    },
  },
  {
    id: 'tesla_lattice',
    name: 'Tesla Lattice',
    nameEs: 'Red Tesla',
    description: 'Electric arcs connect your drone to your blades, zapping all enemies within the orbit ring.',
    descriptionEs: 'Rayos eléctricos conectan tu dron con las hojas, electrocutando a todos los enemigos en el anillo.',
    icon: 'Activity',
    rarity: 'epic',
    tier: 3,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.hasTeslaChains = true;
    },
  },
  {
    id: 'thermal_ignition',
    name: 'Thermal Ignition',
    nameEs: 'Ignición Térmica',
    description: 'All reflected projectiles and blade slashes ignite enemies, dealing 200% burn damage.',
    descriptionEs: 'Los proyectiles reflejados y tajos prenden fuego a los enemigos infligiendo 200% de quemadura.',
    icon: 'Flame',
    rarity: 'epic',
    tier: 3,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.reflectIgnite = true;
    },
  },
  {
    id: 'cryo_stasis',
    name: 'Cryo Stasis Wave',
    nameEs: 'Onda Crioestasis',
    description: 'Reflected bullets freeze targets in place for 2.5s. Frozen enemies take +50% shatter damage.',
    descriptionEs: 'Los proyectiles reflejados congelan a los enemigos por 2.5s y sufren +50% de daño de impacto.',
    icon: 'Snowflake',
    rarity: 'epic',
    tier: 3,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.reflectFreeze = true;
    },
  },
  {
    id: 'singularity_core',
    name: 'Singularity Thrusters',
    nameEs: 'Propulsores de Singularidad',
    description: 'Dashing leaves behind a mini Black Hole that pulls in enemies and bullets then implodes.',
    descriptionEs: 'El impulso deja tras de sí un agujero negro que absorbe balas y enemigos y luego implosiona.',
    icon: 'Disc',
    rarity: 'epic',
    tier: 3,
    maxLevel: 2,
    level: 0,
    apply: (s) => {
      s.hasSingularityOnDash = true;
    },
  },

  // --- NIVEL LEGENDARIO ---
  {
    id: 'temporal_echo',
    name: 'Chrono Ghost',
    nameEs: 'Eco Temporal',
    description: 'A holographic phantom follows you, repeating your blade swings and bullet reflections 0.4s later.',
    descriptionEs: 'Un fantasma holográfico te sigue repitiendo tus ataques y reflejos con 0.4s de retardo.',
    icon: 'Repeat',
    rarity: 'legendary',
    tier: 4,
    maxLevel: 1,
    level: 0,
    apply: (s) => {
      s.hasTemporalEchoes = true;
    },
  },
  {
    id: 'homing_seeker_matrix',
    name: 'Homing Prism Array',
    nameEs: 'Matriz Rastreadora Prisma',
    description: 'All reflected projectiles automatically home aggressively toward enemy weak points with 100% crit.',
    descriptionEs: 'Todos los proyectiles reflejados persiguen automáticamente a los enemigos con 100% de críticos.',
    icon: 'Crosshair',
    rarity: 'legendary',
    tier: 4,
    maxLevel: 1,
    level: 0,
    apply: (s) => {
      s.reflectHoming = true;
      s.critChance = 1.0;
      s.reflectDamageMultiplier += 1.0;
    },
  },
  {
    id: 'trinity_vortex',
    name: 'Trinity Blade Vortex',
    nameEs: 'Vórtice Trino de Hojas',
    description: 'Adds a 3rd rotating blade and increases orbital rotation speed by +100%.',
    descriptionEs: 'Añade una 3ª hoja giratoria y acelera la velocidad orbital un +100%.',
    icon: 'Radio',
    rarity: 'legendary',
    tier: 4,
    maxLevel: 1,
    level: 0,
    apply: (s) => {
      s.bladeCount += 1;
      s.bladeOrbitSpeedMultiplier += 1.0;
      s.bladeDamageMultiplier += 0.5;
    },
  },

  // --- MEJORAS ESPECIALES DE SINERGIA ---
  {
    id: 'synergy_plasma_storm',
    name: 'SYNERGY: Plasma Storm Vortex',
    nameEs: 'SINERGIA: Tormenta de Plasma',
    description: '[Tesla + Thermal] Tesla arcs trigger superheated plasma explosions on every contact!',
    descriptionEs: '[Tesla + Térmico] ¡Los rayos tesla provocan explosiones de plasma sobrecalentadas!',
    icon: 'Zap',
    rarity: 'synergy',
    tier: 5,
    maxLevel: 1,
    level: 0,
    synergyRequires: ['tesla_lattice', 'thermal_ignition'],
    apply: (s) => {
      s.bladeDamageMultiplier += 0.8;
      s.reflectDamageMultiplier += 1.5;
    },
  },
  {
    id: 'synergy_zero_point',
    name: 'SYNERGY: Absolute Zero Core',
    nameEs: 'SINERGIA: Cero Absoluto',
    description: '[Cryo + Singularity] Singularities freeze all trapped enemies permanently until shattered.',
    descriptionEs: '[Crio + Singularidad] Las singularidades congelan permanentemente a todo enemigo atrapado.',
    icon: 'Shield',
    rarity: 'synergy',
    tier: 5,
    maxLevel: 1,
    level: 0,
    synergyRequires: ['cryo_stasis', 'singularity_core'],
    apply: (s) => {
      s.slowMoDilationFactor = 0.03;
      s.critMultiplier += 1.5;
    },
  }
];

export function getRandomUpgrades(
  currentStats: GameUpgradeStats,
  currentUpgrades: Upgrade[],
  count: number = 3
): Upgrade[] {
  // Filtra mejoras elegibles (que no hayan alcanzado el nivel máximo)
  const eligible = UPGRADES_DATABASE.filter((up) => {
    const existing = currentUpgrades.find((u) => u.id === up.id);
    const currentLevel = existing ? existing.level : 0;
    if (currentLevel >= up.maxLevel) return false;

    // Comprueba requerimientos de sinergia
    if (up.synergyRequires && up.synergyRequires.length > 0) {
      const hasReqs = up.synergyRequires.every((reqId) => {
        const found = currentUpgrades.find((u) => u.id === reqId);
        return found && found.level > 0;
      });
      if (!hasReqs) return false;
    }

    return true;
  });

  if (eligible.length <= count) {
    return eligible.map((u) => {
      const existing = currentUpgrades.find((c) => c.id === u.id);
      return { ...u, level: existing ? existing.level : 0 };
    });
  }

  // Ponderación por rareza
  const weighted: Upgrade[] = [];
  eligible.forEach((up) => {
    let weight = 40; // común
    if (up.rarity === 'rare') weight = 28;
    if (up.rarity === 'epic') weight = 16;
    if (up.rarity === 'legendary') weight = 8;
    if (up.rarity === 'synergy') weight = 35;

    for (let i = 0; i < weight; i++) {
      weighted.push(up);
    }
  });

  const selected: Upgrade[] = [];
  const selectedIds = new Set<string>();

  while (selected.length < count && selectedIds.size < eligible.length) {
    const pick = weighted[Math.floor(Math.random() * weighted.length)];
    if (!selectedIds.has(pick.id)) {
      selectedIds.add(pick.id);
      const existing = currentUpgrades.find((c) => c.id === pick.id);
      selected.push({ ...pick, level: existing ? existing.level : 0 });
    }
  }

  return selected;
}
