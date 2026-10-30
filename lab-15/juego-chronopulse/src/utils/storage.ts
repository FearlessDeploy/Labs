import { Achievement, AudioSettings, LeaderboardEntry, UserGameStats } from '../types/game';

const STATS_STORAGE_KEY = 'chronopulse_stats_v1';
const ACHIEVEMENTS_STORAGE_KEY = 'chronopulse_achievements_v1';
const AUDIO_STORAGE_KEY = 'chronopulse_audio_v1';
const LANG_STORAGE_KEY = 'chronopulse_lang_v1';
const LEADERBOARD_STORAGE_KEY = 'chronopulse_leaderboard_v1';
const PLAYER_NAME_STORAGE_KEY = 'chronopulse_player_name_v1';

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lb_bot_1',
    playerName: 'Nova-7',
    score: 142500,
    mode: 'survival',
    wave: 18,
    combo: 28,
    kills: 245,
    date: '2026-08-20',
  },
  {
    id: 'lb_bot_2',
    playerName: 'Aegis_Prime',
    score: 126000,
    mode: 'boss_rush',
    wave: 12,
    combo: 24,
    kills: 180,
    date: '2026-08-21',
  },
  {
    id: 'lb_bot_3',
    playerName: 'Vortex_Runner',
    score: 98200,
    mode: 'time_attack',
    wave: 9,
    combo: 32,
    kills: 165,
    date: '2026-08-22',
  },
  {
    id: 'lb_bot_4',
    playerName: 'Chrono_Ghost',
    score: 89400,
    mode: 'survival',
    wave: 14,
    combo: 21,
    kills: 142,
    date: '2026-08-22',
  },
  {
    id: 'lb_bot_5',
    playerName: 'Titan_Buster',
    score: 74300,
    mode: 'boss_rush',
    wave: 8,
    combo: 18,
    kills: 95,
    date: '2026-08-23',
  },
  {
    id: 'lb_bot_6',
    playerName: 'CyberBlade_99',
    score: 68900,
    mode: 'time_attack',
    wave: 7,
    combo: 19,
    kills: 110,
    date: '2026-08-23',
  },
  {
    id: 'lb_bot_7',
    playerName: 'Apex_Pilot',
    score: 58100,
    mode: 'survival',
    wave: 11,
    combo: 16,
    kills: 98,
    date: '2026-08-24',
  },
];

export const INITIAL_USER_STATS: UserGameStats = {
  highScore: 0,
  maxWave: 0,
  totalKills: 0,
  bossesKilled: 0,
  maxCombo: 0,
  totalReflections: 0,
  totalTimeSlowSeconds: 0,
  gamesPlayed: 0,
  victories: 0,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Quantum Cut',
    titleEs: 'Primer Corte Cuántico',
    description: 'Destroy your first enemy drone with the orbital blade.',
    descriptionEs: 'Destruye tu primer dron enemigo con la hoja orbital.',
    icon: 'Sword',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'parry_master',
    title: 'Prism Deflector',
    titleEs: 'Deflector Prismático',
    description: 'Reflect 50 enemy projectiles in total.',
    descriptionEs: 'Refleja 50 proyectiles enemigos en total.',
    icon: 'Shield',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'combo_king',
    title: 'Flow State',
    titleEs: 'Estado de Flujo',
    description: 'Achieve a 20x combo multiplier.',
    descriptionEs: 'Alcanza un multiplicador de combo de 20x.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'boss_slayer',
    title: 'Titan Breaker',
    titleEs: 'Rompedor de Titanes',
    description: 'Defeat your first Sector Boss.',
    descriptionEs: 'Derrota a tu primer jefe de sector.',
    icon: 'Skull',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'time_weaver',
    title: 'Chrono Weaver',
    titleEs: 'Tejedor del Tiempo',
    description: 'Spend 60 seconds total in dilated bullet-time.',
    descriptionEs: 'Pasa 60 segundos en total en cámara lenta / dilatación.',
    icon: 'Clock',
    unlocked: false,
    progress: 0,
    maxProgress: 60,
  },
  {
    id: 'wave_survivor',
    title: 'Sector Master',
    titleEs: 'Maestro de Sectores',
    description: 'Survive and clear Wave 10.',
    descriptionEs: 'Sobrevive y completa la oleada 10.',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'synergy_master',
    title: 'Quantum Synthesis',
    titleEs: 'Síntesis Cuántica',
    description: 'Unlock a special Synergy Perk during a run.',
    descriptionEs: 'Desbloquea una sinergia especial durante una partida.',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'blade_trinity',
    title: 'Trinity Orbit',
    titleEs: 'Órbita Trina',
    description: 'Wield 3 synchronized orbiting blades at once.',
    descriptionEs: 'Controla 3 hojas orbitales sincronizadas a la vez.',
    icon: 'Layers',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
];

export function loadUserStats(): UserGameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return { ...INITIAL_USER_STATS };
    return { ...INITIAL_USER_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...INITIAL_USER_STATS };
  }
}

export function saveUserStats(stats: UserGameStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error al guardar estadísticas del usuario', e);
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (!raw) return INITIAL_ACHIEVEMENTS.map(a => ({ ...a }));
    const saved: Achievement[] = JSON.parse(raw);
    return INITIAL_ACHIEVEMENTS.map((base) => {
      const match = saved.find((s) => s.id === base.id);
      return match ? { ...base, ...match } : { ...base };
    });
  } catch {
    return INITIAL_ACHIEVEMENTS.map(a => ({ ...a }));
  }
}

export function saveAchievements(achs: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achs));
  } catch (e) {
    console.error('Error al guardar logros', e);
  }
}

export function loadAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) return { masterVolume: 0.8, sfxVolume: 0.9, musicVolume: 0.45, muted: false };
    return JSON.parse(raw);
  } catch {
    return { masterVolume: 0.8, sfxVolume: 0.9, musicVolume: 0.45, muted: false };
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  try {
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error al guardar configuración de audio', e);
  }
}

export function loadLanguage(): 'es' | 'en' {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
    return 'es'; // Por defecto Español
  } catch {
    return 'es';
  }
}

export function saveLanguage(lang: 'es' | 'en'): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
    console.error('Error al guardar idioma', e);
  }
}

export function loadPlayerName(): string {
  try {
    const name = localStorage.getItem(PLAYER_NAME_STORAGE_KEY);
    return name && name.trim().length > 0 ? name.trim() : 'Piloto-01';
  } catch {
    return 'Piloto-01';
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, name.trim());
  } catch (e) {
    console.error('Error al guardar nombre del jugador', e);
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [...DEFAULT_LEADERBOARD];
    const parsed: LeaderboardEntry[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [...DEFAULT_LEADERBOARD];
    // Excluye partidas en modo sandbox del ranking competitivo
    return parsed.filter((e) => e.mode !== 'sandbox').sort((a, b) => b.score - a.score);
  } catch {
    return [...DEFAULT_LEADERBOARD];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    const sorted = [...entries].filter((e) => e.mode !== 'sandbox').sort((a, b) => b.score - a.score).slice(0, 50);
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sorted));
  } catch (e) {
    console.error('Error al guardar el salón de la fama', e);
  }
}

export function addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'> & { id?: string; date?: string }): {
  entries: LeaderboardEntry[];
  rank: number;
} {
  const current = loadLeaderboard();
  
  // Regla estricta: las partidas en laboratorio matrix (sandbox) se excluyen de la tabla competitiva
  if (entry.mode === 'sandbox') {
    return { entries: current, rank: 0 };
  }

  const newEntry: LeaderboardEntry = {
    id: entry.id || `lb_player_${Date.now()}`,
    playerName: entry.playerName || 'Piloto-01',
    score: Math.round(entry.score),
    mode: entry.mode,
    wave: entry.wave,
    combo: entry.combo,
    kills: entry.kills,
    date: entry.date || new Date().toISOString().split('T')[0],
    isPlayer: true,
  };

  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 50);
  saveLeaderboard(updated);

  const rank = updated.findIndex((e) => e.id === newEntry.id) + 1;
  return { entries: updated, rank };
}
