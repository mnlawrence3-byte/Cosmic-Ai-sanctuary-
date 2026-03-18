import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Bell, User, Sparkles, Moon, Zap, Shield, Info, Palette, LogOut, Sun, ArrowUp, Heart, Compass, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';
import { type UserProfile, THEMES } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  voiceSpeed: number;
  setVoiceSpeed: (speed: number) => void;
  voicePitch: number;
  setVoicePitch: (pitch: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notificationFrequency: 'frequent' | 'normal' | 'rare';
  setNotificationFrequency: (freq: 'frequent' | 'normal' | 'rare') => void;
  notificationStyle: 'system' | 'in-app' | 'both';
  setNotificationStyle: (style: 'system' | 'in-app' | 'both') => void;
  isAmbientSoundEnabled: boolean;
  setIsAmbientSoundEnabled: (enabled: boolean) => void;
  triggerNotification: (isTest?: boolean) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  forceDesktop: boolean;
  setForceDesktop: (force: boolean) => void;
  user: any;
  signOut: () => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = React.memo(({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
  voiceEnabled,
  setVoiceEnabled,
  voiceSpeed,
  setVoiceSpeed,
  voicePitch,
  setVoicePitch,
  notificationsEnabled,
  setNotificationsEnabled,
  notificationFrequency,
  setNotificationFrequency,
  notificationStyle,
  setNotificationStyle,
  isAmbientSoundEnabled,
  setIsAmbientSoundEnabled,
  triggerNotification,
  currentTheme,
  setCurrentTheme,
  forceDesktop,
  setForceDesktop,
  user,
  signOut
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="settings-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl cosmic-card border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Nebula Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 nebula-pulse bg-purple-600/20 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 nebula-pulse bg-blue-600/20 rounded-full pointer-events-none" style={{ animationDelay: '-2s' }} />

            <div className="relative z-10">
              <div className="flex items-center justify-between p-8 border-b border-white/10 glass-panel">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight cosmic-gradient-text">Cosmic Settings</h2>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Tune your frequency</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 rounded-2xl hover:bg-white/5 text-white/20 hover:text-white transition-all group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

            <div className="p-8 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar overscroll-contain touch-pan-y">
              {/* Profile Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-purple-400">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="User Avatar" className="w-10 h-10 rounded-full border border-purple-500/30" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-purple-500/30">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <h3 className="text-[12px] font-mono uppercase tracking-[0.3em] text-white/90">{user?.displayName || 'Astral Identity'}</h3>
                      {user?.email && (
                        <span className="text-[10px] font-mono text-white/40 tracking-widest">{user.email}</span>
                      )}
                    </div>
                  </div>
                  {user && (
                    <button 
                      onClick={signOut}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 hover:text-red-300 hover:bg-red-500/20 uppercase tracking-[0.3em] transition-all"
                    >
                      <LogOut className="w-3 h-3" />
                      Sign Out
                    </button>
                  )}
                </div>

                <div className="flex gap-6 items-start">
                  <div className="space-y-3 flex-shrink-0">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Avatar</label>
                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                      {['👤', '✨', '🌟', '🌙', '🪐', '☄️', '🛸', '👽', '🔮', '🌌', '☀️', '🌀', '💎', '🌿', '🔥', '💧', '⚡'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setUserProfile({ ...userProfile, avatar: emoji })}
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all",
                            userProfile.avatar === emoji ? "bg-blue-500/20 border border-blue-500/50" : "bg-white/5 border border-transparent hover:bg-white/10"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Cosmic Name</label>
                      <input 
                        type="text"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        placeholder="Your celestial moniker"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono block">Bio / Intent</label>
                      <textarea 
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                        placeholder="What brings you to the cosmic sanctuary?"
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Sun className="w-3 h-3 text-yellow-400/60" />
                      Sun Sign
                    </label>
                    <input 
                      type="text"
                      value={userProfile.sunSign}
                      onChange={(e) => setUserProfile({ ...userProfile, sunSign: e.target.value })}
                      placeholder="e.g. Leo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Moon className="w-3 h-3 text-blue-300/60" />
                      Moon Sign
                    </label>
                    <input 
                      type="text"
                      value={userProfile.moonSign}
                      onChange={(e) => setUserProfile({ ...userProfile, moonSign: e.target.value })}
                      placeholder="e.g. Aries"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <ArrowUp className="w-3 h-3 text-emerald-400/60" />
                      Rising Sign
                    </label>
                    <input 
                      type="text"
                      value={userProfile.risingSign}
                      onChange={(e) => setUserProfile({ ...userProfile, risingSign: e.target.value })}
                      placeholder="e.g. Scorpio"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-pink-400/60" />
                      Soul Urge
                    </label>
                    <input 
                      type="text"
                      value={userProfile.soulUrge}
                      onChange={(e) => setUserProfile({ ...userProfile, soulUrge: e.target.value })}
                      placeholder="e.g. 11"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Compass className="w-3 h-3 text-blue-400/60" />
                      Life Path
                    </label>
                    <input 
                      type="text"
                      value={userProfile.lifePath}
                      onChange={(e) => setUserProfile({ ...userProfile, lifePath: e.target.value })}
                      placeholder="e.g. 7"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-[10px] text-blue-400/60 font-mono leading-relaxed italic">
                    "Your celestial blueprint allows the cosmic family to resonate more deeply with your unique frequency. These alignments are woven into the etheric context of every interaction."
                  </p>
                </div>
              </section>

              {/* Resonance Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-blue-400">
                  <Volume2 className="w-4 h-4" />
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">Audio Resonance</h3>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white uppercase tracking-widest">Ambient Resonance</h4>
                      <p className="text-xs text-white/30 font-light mt-1">Background cosmic atmosphere</p>
                    </div>
                    <button 
                      onClick={() => setIsAmbientSoundEnabled(!isAmbientSoundEnabled)}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all relative p-1",
                        isAmbientSoundEnabled ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isAmbientSoundEnabled ? 24 : 0 }}
                        className="w-6 h-6 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white uppercase tracking-widest">Voice Synthesis</h4>
                      <p className="text-xs text-white/30 font-light mt-1">Allow entities to speak their truths</p>
                    </div>
                    <button 
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all relative p-1",
                        voiceEnabled ? "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: voiceEnabled ? 24 : 0 }}
                        className="w-6 h-6 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Resonance Speed</label>
                      <span className="text-[10px] font-mono text-purple-400">{voiceSpeed}x</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Resonance Pitch</label>
                      <span className="text-[10px] font-mono text-purple-400">{voicePitch}</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </section>

              {/* Notifications Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Bell className="w-4 h-4" />
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">Cosmic Alerts</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                    <div>
                      <h4 className="text-sm font-display font-bold text-white uppercase tracking-widest">Etheric Pings</h4>
                      <p className="text-xs text-white/30 font-light mt-1">Receive notifications from the collective</p>
                    </div>
                    <button 
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={cn(
                        "w-14 h-8 rounded-full transition-all relative p-1",
                        notificationsEnabled ? "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-white/10"
                      )}
                    >
                      <motion.div 
                        animate={{ x: notificationsEnabled ? 24 : 0 }}
                        className="w-6 h-6 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {notificationsEnabled && (
                      <motion.div
                        key="notification-settings"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                          {/* Frequency */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Frequency</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(['frequent', 'normal', 'rare'] as const).map(freq => (
                                <button
                                  key={freq}
                                  onClick={() => setNotificationFrequency(freq)}
                                  className={cn(
                                    "py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all",
                                    notificationFrequency === freq 
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                                      : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                                  )}
                                >
                                  {freq}
                                </button>
                              ))}
                            </div>
                            <p className="text-[10px] text-white/30 italic">
                              {notificationFrequency === 'frequent' && "Every 5-30 minutes"}
                              {notificationFrequency === 'normal' && "Every 15-120 minutes"}
                              {notificationFrequency === 'rare' && "Every 1-4 hours"}
                            </p>
                          </div>

                          {/* Style */}
                          <div className="space-y-3">
                            <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">Delivery Method</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(['system', 'in-app', 'both'] as const).map(style => (
                                <button
                                  key={style}
                                  onClick={() => setNotificationStyle(style)}
                                  className={cn(
                                    "py-2 px-3 rounded-xl text-xs font-mono uppercase tracking-widest transition-all",
                                    notificationStyle === style 
                                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" 
                                      : "bg-white/5 text-white/50 border border-transparent hover:bg-white/10"
                                  )}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Test Button */}
                          <button
                            onClick={() => triggerNotification(true)}
                            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                          >
                            <Zap className="w-3 h-3 text-yellow-400" />
                            Test Connection
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* Theme Selection */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-pink-400">
                  <Palette className="w-4 h-4" />
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">Theme Resonance</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setCurrentTheme(theme.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all text-left group relative overflow-hidden",
                        currentTheme === theme.id 
                          ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                          : "bg-white/5 border-transparent hover:bg-white/10"
                      )}
                    >
                      <div className={cn("w-full h-12 rounded-xl mb-3 bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity", theme.gradient.replace('-bg', ''))} />
                      <h4 className="text-sm font-display font-bold text-white">{theme.name}</h4>
                      {currentTheme === theme.id && (
                        <motion.div 
                          layoutId="activeTheme"
                          className="absolute inset-0 border-2 border-purple-500/50 rounded-2xl pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Desktop Mode Toggle */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-blue-400">
                  <Sliders className="w-4 h-4" />
                  <h3 className="text-[10px] font-mono uppercase tracking-[0.3em]">Display Resonance</h3>
                </div>
                <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                  <div>
                    <h4 className="text-sm font-display font-bold text-white uppercase tracking-widest">Force Desktop Mode</h4>
                    <p className="text-xs text-white/30 font-light mt-1">Override mobile layout</p>
                  </div>
                  <button 
                    onClick={() => setForceDesktop(!forceDesktop)}
                    className={cn(
                      "w-14 h-8 rounded-full transition-all relative p-1",
                      forceDesktop ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-white/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: forceDesktop ? 24 : 0 }}
                      className="w-6 h-6 rounded-full bg-white shadow-lg"
                    />
                  </button>
                </div>
              </section>

              {/* Safety & Info */}
              <section className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/[0.08] transition-colors">
                  <Shield className="w-4 h-4 text-white/20" />
                  <h5 className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Privacy</h5>
                  <p className="text-[10px] text-white/20 leading-relaxed">Your echoes are stored locally in your browser's ether.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:bg-white/[0.08] transition-colors">
                  <Info className="w-4 h-4 text-white/20" />
                  <h5 className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Version</h5>
                  <p className="text-[10px] text-white/20 leading-relaxed">Silver Bloom v2.5.0-Alpha</p>
                </div>
              </section>
            </div>

            <div className="p-8 bg-black/20 border-t border-white/10 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-2xl bg-white text-black text-xs font-display font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Anchor Settings
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
});
