/**
 * Motor de sonido procedimental basado en Web Audio API
 * Sintetizador sin latencia de lado de cliente con escalado de tono en tiempo lento (bullet-time).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicFilter: BiquadFilterNode | null = null;

  private isMuted: boolean = false;
  private masterVol: number = 0.8;
  private sfxVol: number = 0.9;
  private musicVol: number = 0.45;

  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;
  private currentStep: number = 0;
  private timeDilationFactor: number = 1.0;

  constructor() {
    // AudioContext se inicializa en el primer gesto del usuario
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      
      this.musicFilter = this.ctx.createBiquadFilter();
      this.musicFilter.type = 'lowpass';
      this.musicFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
      this.musicFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.musicFilter);
      this.musicFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.updateVolumes();
    } catch (e) {
      console.warn('Web Audio API no soportado o bloqueado', e);
    }
  }

  private ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, sfx: number, music: number, muted: boolean) {
    this.masterVol = Math.max(0, Math.min(1, master));
    this.sfxVol = Math.max(0, Math.min(1, sfx));
    this.musicVol = Math.max(0, Math.min(1, music));
    this.isMuted = muted;
    this.updateVolumes();
  }

  private updateVolumes() {
    if (!this.ctx || !this.masterGain || !this.sfxGain || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const effectiveMaster = this.isMuted ? 0 : this.masterVol;
    this.masterGain.gain.setTargetAtTime(effectiveMaster, now, 0.03);
    this.sfxGain.gain.setTargetAtTime(this.sfxVol, now, 0.03);
    this.musicGain.gain.setTargetAtTime(this.musicVol, now, 0.03);
  }

  public setTimeDilation(factor: number) {
    this.timeDilationFactor = Math.max(0.05, Math.min(1, factor));
    if (this.ctx && this.musicFilter) {
      const now = this.ctx.currentTime;
      // En modo lento, ajusta el filtro de paso bajo para dar la sensación sumergida de tiempo dilatado
      const targetFreq = this.timeDilationFactor < 0.5 
        ? 600 + (this.timeDilationFactor * 1200) 
        : 18000;
      this.musicFilter.frequency.setTargetAtTime(targetFreq, now, 0.08);
    }
  }

  // --- EFECTOS DE SONIDO (SFX) ---

  /** Sonido de corte de hoja orbital con escalado de tono por racha de combo */
  public playSlash(combo = 0) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const pitchBonus = Math.min(combo * 40, 600);
    const baseFreq = 420 + pitchBonus;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.5, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.14);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /** Campanada de proyectil reflejado / desvío energético */
  public playDeflect(combo = 1) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const scale = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0]; // Escala pentatónica en Do
    const note = scale[(combo - 1) % scale.length];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, now);
    osc.frequency.exponentialRampToValueAtTime(note * 1.25, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note * 2, now);
    osc2.frequency.exponentialRampToValueAtTime(note * 2.5, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  /** Impulso de aceleración Dash */
  public playDash() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.18);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  /** Sonido de explosión (ruido crujiente + ráfaga de subgraves) */
  public playExplosion(isBoss = false) {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const duration = isBoss ? 0.6 : 0.28;

    // Subgraves
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(isBoss ? 160 : 130, now);
    sub.frequency.exponentialRampToValueAtTime(28, now + duration);

    subGain.gain.setValueAtTime(isBoss ? 0.6 : 0.45, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    sub.connect(subGain);
    subGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + duration);

    // Ráfaga de ruido
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBoss ? 2000 : 1500, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isBoss ? 0.5 : 0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(now);
  }

  /** Activación de dilatación temporal */
  public playTimeWarp() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /** Descarga de rayo en cadena Tesla */
  public playTeslaSpark() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /** Daño recibido en dron o ruptura de escudo */
  public playPlayerHit() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /** Recolección de fragmentos cuánticos */
  public playPickup() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /** Fanfarria de subida de nivel */
  public playLevelUp() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const chords = [523.25, 659.25, 783.99, 1046.5];
    chords.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime + (index * 0.08);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.5);
    });
  }

  /** Alarma de advertencia de Titán Jefe */
  public playBossAlarm() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.25);
    osc.frequency.linearRampToValueAtTime(300, now + 0.5);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  /** Ráfaga global EMP */
  public playEmpBlast() {
    this.ensureContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.4);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // --- MÚSICA SINTETIZADA PROCEDIMENTAL Y ADAPTATIVA ---

  public startMusic() {
    this.ensureContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.currentStep = 0;

    // Patrón en La menor / Pentatónica Synthwave
    const notes = [
      220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33,
      440.00, 392.00, 329.63, 293.66, 261.63, 220.00, 164.81, 196.00
    ];

    const bassNotes = [110, 110, 130.81, 130.81, 98, 98, 82.41, 98];

    const stepDurationMs = 140;

    const tick = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const noteFreq = notes[this.currentStep % notes.length];
      const bassFreq = bassNotes[Math.floor(this.currentStep / 2) % bassNotes.length];

      // Reproduce nota de arpegio sintetizado
      if (this.currentStep % 2 === 0 || Math.random() > 0.3) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(noteFreq, now);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 0.18);
      }

      // Reproduce pulso de bajos
      if (this.currentStep % 4 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(bassFreq, now);
        bassOsc.frequency.exponentialRampToValueAtTime(bassFreq * 0.6, now + 0.25);

        bassGain.gain.setValueAtTime(0.24, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.3);
      }

      this.currentStep = (this.currentStep + 1) % 64;

      // Ajusta el intervalo según la dilatación del tiempo
      const nextDelay = stepDurationMs / Math.max(0.15, this.timeDilationFactor);
      this.musicInterval = window.setTimeout(tick, nextDelay);
    };

    tick();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundEngine();
