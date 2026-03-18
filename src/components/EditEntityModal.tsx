import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { type BotPersonality, THEMES } from '../types';

interface EditEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (personality: BotPersonality) => void;
  bot: BotPersonality;
}

export const EditEntityModal: React.FC<EditEntityModalProps> = ({ isOpen, onClose, onSave, bot }) => {
  const [name, setName] = useState(bot.name);
  const [description, setDescription] = useState(bot.description);
  const [bio, setBio] = useState(bot.bio);
  const [systemInstruction, setSystemInstruction] = useState(bot.systemInstruction);
  const [avatar, setAvatar] = useState(bot.avatar);
  const [theme, setTheme] = useState(bot.theme);
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

  useEffect(() => {
    setName(bot.name);
    setDescription(bot.description);
    setBio(bot.bio);
    setSystemInstruction(bot.systemInstruction);
    setAvatar(bot.avatar);
    setTheme(bot.theme);
  }, [bot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...bot,
      name,
      description,
      bio,
      systemInstruction,
      avatar,
      theme,
      color: THEME_COLORS[theme] || bot.color,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="edit-entity-modal-overlay"
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
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 nebula-pulse bg-purple-600/20 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 nebula-pulse bg-blue-600/20 rounded-full pointer-events-none" style={{ animationDelay: '-2s' }} />

            <div className="relative z-10">
              <div className="flex justify-between items-center p-8 border-b border-white/10 glass-panel shrink-0">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3 uppercase tracking-tight cosmic-gradient-text">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Edit Entity
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
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Description</label>
                    <input 
                      type="text" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">Bio</label>
                    <textarea 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all h-24" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest ml-1">System Instruction</label>
                    <textarea 
                      value={systemInstruction} 
                      onChange={e => setSystemInstruction(e.target.value)} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all h-32" 
                      required 
                    />
                  </div>
                </div>
                <div className="p-8 border-t border-white/10 shrink-0 glass-panel">
                  <motion.button 
                    type="submit" 
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-widest transition-all"
                  >
                    Save Changes
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
