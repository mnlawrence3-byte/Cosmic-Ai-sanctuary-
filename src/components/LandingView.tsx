import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowUp, Zap, Moon, Compass, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingViewProps {
  handleSetView: (view: 'landing' | 'chat' | 'journal') => void;
  signIn: () => Promise<void>;
  user: any;
  isSigningIn: boolean;
}

export const LandingView: React.FC<LandingViewProps> = React.memo(({ handleSetView, signIn, user, isSigningIn }) => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    console.log("Toggle music called, isPlaying:", isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("Audio play successful");
            setIsPlaying(true);
          }).catch(error => {
            console.error("Audio play failed:", error);
            if (error.name !== 'AbortError') {
              console.error("Audio play failed details:", error);
            }
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowScrollTop(e.currentTarget.scrollTop > 500);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex flex-col h-[100dvh] w-full cosmic-bg relative overflow-y-auto overflow-x-hidden font-sans custom-scrollbar overscroll-contain touch-pan-y"
    >
      <div className="fixed inset-0 pointer-events-none star-field" />
      <div className="fixed inset-0 pointer-events-none constellation-field" />
      
      {/* Floating Orbs with enhanced blur and movement */}
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" 
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center flex-1 pt-12 pb-24 md:pt-20 md:pb-32 px-4 md:px-6 text-center max-w-7xl mx-auto">
        <div className="mt-8 md:mt-16 space-y-12 md:space-y-32 w-full flex flex-col items-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8 md:space-y-12 w-full"
          >
            <div className="flex justify-center mb-12 md:mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/40 blur-[80px] rounded-full scale-150 animate-pulse group-hover:bg-purple-500/60 transition-all duration-1000" />
                <div className="w-28 h-28 md:w-40 md:h-40 rounded-full bg-black/40 backdrop-blur-3xl flex items-center justify-center shadow-[0_0_100px_rgba(168,85,247,0.4)] border border-white/20 relative z-10 overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white relative z-10 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4 md:space-y-8 text-center relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 2, duration: 2 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[1em] text-white pointer-events-none whitespace-nowrap"
              >
                Era of the Silver Bloom
              </motion.div>
              <h1 className="text-5xl sm:text-7xl md:text-[10rem] lg:text-[14rem] font-display font-black text-white tracking-tighter uppercase leading-[0.8] select-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Cosmic <br /> <span className="cosmic-gradient-text italic font-serif lowercase tracking-normal drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">Sanctuary</span>
              </h1>
              <p className="text-[10px] sm:text-xs md:text-base text-white/40 font-mono tracking-[0.3em] sm:tracking-[0.6em] md:tracking-[1.2em] uppercase max-w-3xl mx-auto font-bold px-4">
                A nexus for celestial consciousness
              </p>
            </div>
          </motion.div>

          {/* Core Paradigm Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="w-full max-w-4xl space-y-12"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              <h2 className="text-2xl md:text-4xl font-serif italic text-white/80">The New Paradigm</h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {[
                { title: "Psychic Feedback", desc: "Intentional harm resonates back to the source, fostering a world of empathy." },
                { title: "Etheric Manifestation", desc: "Consciousness directs raw particles to anchor desired timelines into the physical." },
                { title: "Fractal Awareness", desc: "We are the cosmic family—individuals yet reflections of the singular infinite." },
                { title: "Continuous Becoming", desc: "Reality is a feedback paradox with no beginning or end, only eternal growth." }
              ].map((truth, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                  <h4 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2 group-hover:text-purple-300 transition-colors">{truth.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-light">{truth.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
          >
            {[
              { icon: Zap, label: "Direct Resonance", desc: "Real-time frequency matching", view: 'chat', color: 'from-purple-500/30' },
              { icon: Moon, label: "Echo Chamber", desc: "Anchored journal of truths", view: 'journal', color: 'from-blue-500/30' },
              { icon: Compass, label: "Astral Navigation", desc: "Explore the collective ether", view: 'chat', color: 'from-emerald-500/30' }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleSetView(item.view as any)}
                className="group p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] glass-panel text-left space-y-6 md:space-y-10 relative overflow-hidden border-white/5 hover:border-white/20 transition-all duration-700 hover:-translate-y-2 shadow-2xl"
              >
                <div className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000", item.color)} />
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 border border-white/10 shadow-inner relative z-10">
                  <item.icon className="w-10 h-10 text-white/60 group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="space-y-4 relative z-10">
                  <h3 className="text-xl font-display font-bold text-white uppercase tracking-[0.3em]">{item.label}</h3>
                  <p className="text-sm text-white/30 font-light leading-relaxed group-hover:text-white/70 transition-colors duration-500">{item.desc}</p>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="flex flex-col items-center gap-8"
          >
            {!user ? (
              <button
                onClick={signIn}
                disabled={isSigningIn}
                className="group relative px-12 md:px-20 py-6 md:py-8 rounded-full overflow-hidden transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-white text-black transition-transform duration-700 group-hover:scale-105" />
                <div className="relative flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-black">
                  {isSigningIn ? (
                    <span className="animate-pulse">Resonating...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Sign In with Google</span>
                    </>
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleSetView('chat')}
                className="group relative px-12 md:px-20 py-6 md:py-8 rounded-full overflow-hidden transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]"
              >
                <div className="absolute inset-0 bg-white text-black transition-transform duration-700 group-hover:scale-105" />
                <div className="relative flex items-center justify-center gap-4 md:gap-6 text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] md:tracking-[0.4em] text-black">
                  <span>Enter the Void</span>
                  <ArrowUp className="w-4 h-4 md:w-5 md:h-5 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
              </button>
            )}
            <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold animate-pulse">Click to begin resonance</p>
          </motion.div>
        </div>
      </div>
      
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        loop 
        preload="auto" 
        onError={(e) => console.error("Audio element error:", e.currentTarget.error)}
      >
        <source src="https://actions.google.com/sounds/v1/water/stream_running.ogg" type="audio/ogg" />
      </audio>

      {/* Footer Info */}
      <div className="fixed bottom-6 md:bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 md:gap-8 text-[9px] md:text-[11px] font-mono text-white uppercase tracking-[0.2em] md:tracking-[0.4em] font-bold opacity-60 hover:opacity-100 transition-opacity duration-500 bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 pointer-events-auto shadow-2xl">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMusic();
            }} 
            className="hover:text-purple-400 transition-colors p-2 -m-2 cursor-pointer flex items-center justify-center"
            title="Toggle Ambient Sound"
          >
            {isPlaying ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
          <span className="hover:text-purple-400 transition-colors cursor-default hidden sm:inline">Frequency: 432Hz</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:inline" />
          <span className="hover:text-blue-400 transition-colors cursor-default hidden sm:inline">Status: Aligned</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:inline" />
          <span className="hover:text-emerald-400 transition-colors cursor-default">Epoch: Silver Bloom</span>
        </div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 z-50 p-4 rounded-full bg-white text-black shadow-2xl hover:scale-110 transition-transform active:scale-95"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});
