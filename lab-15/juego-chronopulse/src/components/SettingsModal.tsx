import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Volume2, Music, VolumeX, Globe, X, Keyboard } from 'lucide-react';
import { AudioSettings } from '../types/game';

interface SettingsModalProps {
  isOpen: boolean;
  audioSettings: AudioSettings;
  language: 'es' | 'en';
  onClose: () => void;
  onUpdateAudio: (settings: AudioSettings) => void;
  onUpdateLanguage: (lang: 'es' | 'en') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  audioSettings,
  language,
  onClose,
  onUpdateAudio,
  onUpdateLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="settings-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-md">
        <div className="absolute inset-0 pointer-events-none opacity-20 scanlines-overlay" />

        <motion.div
          id="settings-dialog"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-[#080808] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black relative z-10 flex flex-col"
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30 text-[#C9A96E]">
                <Settings className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-serif text-[#E0E0E0]">
                {language === 'es' ? 'Configuración & Audio' : 'Settings & Audio'}
              </h2>
            </div>

            <button
              id="btn-close-settings"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-5 my-5">
            {/* Selección de idioma */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/70 font-medium uppercase tracking-[0.15em]">
                <Globe className="w-4 h-4 text-[#C9A96E]" />
                <span>{language === 'es' ? 'Idioma / Language' : 'Language / Idioma'}</span>
              </div>
              <div className="flex bg-[#050505] p-1 rounded-xl border border-white/10">
                <button
                  id="btn-lang-es"
                  onClick={() => onUpdateLanguage('es')}
                  className={`px-3 py-1 text-xs font-serif rounded-lg transition-colors cursor-pointer ${
                    language === 'es' ? 'bg-[#C9A96E] text-black font-bold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  Español
                </button>
                <button
                  id="btn-lang-en"
                  onClick={() => onUpdateLanguage('en')}
                  className={`px-3 py-1 text-xs font-serif rounded-lg transition-colors cursor-pointer ${
                    language === 'en' ? 'bg-[#C9A96E] text-black font-bold' : 'text-white/50 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Silenciar audio */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050505] border border-white/10">
              <span className="text-xs uppercase tracking-[0.15em] font-medium text-white/70">
                {language === 'es' ? 'Silenciar Todo el Audio' : 'Mute All Audio'}
              </span>
              <button
                id="btn-mute-toggle"
                onClick={() => onUpdateAudio({ ...audioSettings, muted: !audioSettings.muted })}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  audioSettings.muted
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-400'
                    : 'bg-white/5 border-white/10 text-[#C9A96E] hover:bg-white/10'
                }`}
              >
                {audioSettings.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Ajustes de volumen */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs text-white/70 font-medium mb-1.5 uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#C9A96E]" />
                    {language === 'es' ? 'Volumen Maestro' : 'Master Volume'}
                  </span>
                  <span className="font-mono text-[#C9A96E]">{Math.round(audioSettings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.masterVolume}
                  onChange={(e) => onUpdateAudio({ ...audioSettings, masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#C9A96E] bg-white/10 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 font-medium mb-1.5 uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#C9A96E]" />
                    {language === 'es' ? 'Efectos de Sonido (SFX)' : 'Sound Effects (SFX)'}
                  </span>
                  <span className="font-mono text-[#C9A96E]">{Math.round(audioSettings.sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.sfxVolume}
                  onChange={(e) => onUpdateAudio({ ...audioSettings, sfxVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#C9A96E] bg-white/10 rounded-lg cursor-pointer h-1.5"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 font-medium mb-1.5 uppercase tracking-[0.1em]">
                  <span className="flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#C9A96E]" />
                    {language === 'es' ? 'Sintetizador Procedural (Música)' : 'Procedural Synth (Music)'}
                  </span>
                  <span className="font-mono text-[#C9A96E]">{Math.round(audioSettings.musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.musicVolume}
                  onChange={(e) => onUpdateAudio({ ...audioSettings, musicVolume: parseFloat(e.target.value) })}
                  className="w-full accent-[#C9A96E] bg-white/10 rounded-lg cursor-pointer h-1.5"
                />
              </div>
            </div>

            {/* Guía de controles rápidos */}
            <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/10 text-xs text-white/70 flex flex-col gap-2">
              <div className="font-medium flex items-center gap-1.5 text-[#C9A96E] uppercase tracking-[0.15em]">
                <Keyboard className="w-4 h-4" />
                <span>{language === 'es' ? 'Esquema de Controles' : 'Controls Matrix'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-white/40">
                <div><span className="text-white/90 font-mono">WASD / Flechas</span>: {language === 'es' ? 'Mover Dron' : 'Move Drone'}</div>
                <div><span className="text-white/90 font-mono">Click Izquierdo</span>: {language === 'es' ? 'Lanzar Hoja' : 'Sling Blade'}</div>
                <div><span className="text-white/90 font-mono">Espacio</span>: {language === 'es' ? 'Impulso Dash' : 'Dash Boost'}</div>
                <div><span className="text-white/90 font-mono">Shift (Mantener)</span>: {language === 'es' ? 'Dilatación Bullet-Time' : 'Bullet-Time Slowmo'}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
