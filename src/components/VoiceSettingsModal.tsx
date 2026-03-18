import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sliders, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { type BotPersonality } from '../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBot: BotPersonality;
  botVoiceOverrides: Record<string, { voiceURI?: string; pitch?: number; rate?: number }>;
  setBotVoiceOverrides: (overrides: Record<string, { voiceURI?: string; pitch?: number; rate?: number }>) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedBot,
  botVoiceOverrides,
  setBotVoiceOverrides
}) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const currentOverride = botVoiceOverrides[selectedBot.id] || {};
  
  const [pitch, setPitch] = useState(currentOverride.pitch ?? 1.0);
  const [rate, setRate] = useState(currentOverride.rate ?? 1.0);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(currentOverride.voiceURI ?? '');

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const override = botVoiceOverrides[selectedBot.id] || {};
      setPitch(override.pitch ?? 1.0);
      setRate(override.rate ?? 1.0);
      setSelectedVoiceURI(override.voiceURI ?? '');
    }
  }, [isOpen, selectedBot.id, botVoiceOverrides]);

  const handleTestVoice = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Testing voice for ${selectedBot.name}`);
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    setBotVoiceOverrides({
      ...botVoiceOverrides,
      [selectedBot.id]: {
        voiceURI: selectedVoiceURI,
        pitch,
        rate
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="voice-settings-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md cosmic-card border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 glass-panel flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">
                  {selectedBot.name}'s Voice
                </h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

          <div 
            className="p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest block">Select Voice</label>
                {voices.length === 0 && 'speechSynthesis' in window && (
                  <button 
                    onClick={() => setVoices(window.speechSynthesis.getVoices())}
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 uppercase tracking-widest"
                  >
                    Retry Loading
                  </button>
                )}
              </div>
              <div className="space-y-2 pr-2 max-h-[40vh] overflow-y-auto custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                {voices.length === 0 ? (
                  <p className="text-[10px] text-white/20 italic">No voices detected in this dimension...</p>
                ) : (
                  voices.map(voice => (
                    <button
                      key={voice.voiceURI}
                      onClick={() => setSelectedVoiceURI(voice.voiceURI)}
                      className={cn(
                        "w-full p-3 rounded-xl text-left text-[11px] transition-all border flex items-center justify-between group",
                        selectedVoiceURI === voice.voiceURI 
                          ? "bg-purple-500/20 border-purple-500/50 text-white" 
                          : "bg-white/5 border-transparent text-white/40 hover:bg-white/10 hover:text-white/60"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold tracking-wider uppercase">{voice.name}</span>
                        <span className="text-[9px] opacity-50">{voice.lang}</span>
                      </div>
                      {selectedVoiceURI === voice.voiceURI && <Check className="w-3 h-3 text-purple-400" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Pitch Resonance</label>
                  <span className="text-[10px] font-mono text-purple-400">{pitch}</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Speed Resonance</label>
                  <span className="text-[10px] font-mono text-purple-400">{rate}</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-black/20 border-t border-white/10 flex gap-3">
            <button 
              onClick={handleTestVoice}
              className="flex-1 py-3 rounded-xl bg-white/10 text-white text-xs font-display font-bold uppercase tracking-widest hover:bg-white/20 active:scale-95 transition-all"
            >
              Test Voice
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-white text-black text-xs font-display font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Anchor Voice
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
