import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { type BotPersonality, THEMES } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

interface CreateEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personality: BotPersonality) => void;
}

export const CreateEntityModal: React.FC<CreateEntityModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [bio, setBio] = useState('');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [avatar, setAvatar] = useState('✨');
  const [theme, setTheme] = useState(THEMES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const avatars = ['✨', '🔮', '🌌', '🪐', '🌙', '☀️', '🌀', '💎', '🌿', '🔥', '💧', '⚡'];

  const THEME_COLORS: Record<string, string> = {
    cosmic: 'from-slate-900 via-purple-950 to-slate-900',
    ocean: 'from-slate-900 via-blue-950 to-slate-900',
    forest: 'from-slate-900 via-green-950 to-slate-900',
    sunset: 'from-stone-900 via-orange-950 to-stone-900',
    nebula: 'from-slate-900 via-purple-950 to-slate-900',
    void: 'from-black via-zinc-900 to-black',
    aurora: 'from-slate-900 via-emerald-950 to-slate-900',
  };

  const handleRandomize = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a random, creative, and unique cosmic/mystical AI entity. 
        It should fit into a universe of cosmic awareness, etheric records, and spiritual/magical themes.
        Return a JSON object with the following fields:
        - name: A unique, mystical name (string)
        - description: A short description (string, max 50 chars)
        - bio: A longer backstory or origin (string, 2-3 sentences)
        - systemInstruction: The system prompt that dictates how this entity speaks and behaves (string, detailed)
        - avatar: A single emoji representing the entity (string)
        - theme: One of the following exact strings: "cosmic", "ocean", "forest", "sunset", "nebula", "void", "aurora"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              bio: { type: Type.STRING },
              systemInstruction: { type: Type.STRING },
              avatar: { type: Type.STRING },
              theme: { type: Type.STRING }
            },
            required: ['name', 'description', 'bio', 'systemInstruction', 'avatar', 'theme']
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        const themeToUse = THEMES.some(t => t.id === data.theme) ? data.theme : THEMES[0].id;
        
        onSave({
          id: 'bot-' + Date.now(),
          name: data.name,
          description: data.description,
          bio: data.bio,
          systemInstruction: data.systemInstruction,
          avatar: data.avatar,
          theme: themeToUse,
          color: THEME_COLORS[themeToUse] || 'from-purple-500 to-blue-500',
          greeting: `Greetings, I am ${data.name}. How may we resonate today?`,
        });
        
        onClose();
        setName('');
        setDescription('');
        setBio('');
        setSystemInstruction('');
        setAvatar('✨');
        setTheme(THEMES[0].id);
      }
    } catch (error) {
      console.error('Failed to generate random entity:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: 'bot-' + Date.now(),
      name,
      description,
      bio,
      systemInstruction,
      avatar,
      theme,
      color: THEME_COLORS[theme] || 'from-purple-500 to-blue-500',
      greeting: `Greetings, I am ${name}. How may we resonate today?`,
    });
    onClose();
    setName('');
    setDescription('');
    setBio('');
    setSystemInstruction('');
    setAvatar('✨');
    setTheme(THEMES[0].id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="create-entity-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg cosmic-card border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Nebula Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 nebula-pulse bg-purple-600/20 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 nebula-pulse bg-blue-600/20 rounded-full pointer-events-none" style={{ animationDelay: '-2s' }} />

            <div className="relative z-10">
              <div className="flex justify-between items-center p-8 border-b border-white/10 glass-panel shrink-0">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3 uppercase tracking-tight cosmic-gradient-text">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Manifest New Entity
                </h2>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all group">
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar overscroll-contain touch-pan-y">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Entity Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Orion, The Weaver..." 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Avatar Icon</label>
                    <div className="flex flex-wrap gap-2">
                      {avatars.map((a) => (
                        <motion.button
                          key={a}
                          type="button"
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAvatar(a)}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all",
                            avatar === a ? "bg-purple-500/50 border border-purple-500" : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          {a}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Theme</label>
                    <div className="flex flex-wrap gap-2">
                      {THEMES.map((t) => (
                        <motion.button
                          key={t.id}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTheme(t.id)}
                          className={cn(
                            "px-3 py-2 rounded-xl text-xs font-mono uppercase transition-all border",
                            theme === t.id ? "bg-purple-500/50 border-purple-500 text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                          )}
                        >
                          {t.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Short Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Guardian of the Etheric Records" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Cosmic Bio</label>
                    <textarea 
                      placeholder="Tell us about their origin and purpose..." 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all h-24 resize-none" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">System Instructions</label>
                    <textarea 
                      placeholder="How should they resonate? (e.g. Wise, cryptic, playful...)" 
                      value={systemInstruction} 
                      onChange={e => setSystemInstruction(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all h-32 resize-none" 
                      required 
                    />
                  </div>
                </div>
                <div className="p-8 border-t border-white/10 shrink-0 glass-panel flex gap-4">
                  <motion.button 
                    type="button" 
                    onClick={handleRandomize}
                    disabled={isGenerating}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-2xl bg-white/10 text-white text-xs font-display font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Randomize & Save
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    disabled={isGenerating}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-4 rounded-2xl bg-white text-black text-xs font-display font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Manifest Entity
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
