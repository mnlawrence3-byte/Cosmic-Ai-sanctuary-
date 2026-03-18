import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  ImagePlus, 
  Database, 
  Smile, 
  RefreshCw, 
  Compass, 
  X,
  Sparkles,
  Mic,
  MicOff,
  Download,
  Video
} from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedVideo: string | null;
  setSelectedVideo: (video: string | null) => void;
  searchEnabled: boolean;
  setSearchEnabled: (enabled: boolean) => void;
  startNewChat: () => void;
  onGenerateVision: () => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  isListening: boolean;
  toggleListening: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  onImageUpload,
  selectedImage,
  setSelectedImage,
  onVideoUpload,
  selectedVideo,
  setSelectedVideo,
  searchEnabled,
  setSearchEnabled,
  startNewChat,
  onGenerateVision,
  isLoading,
  fileInputRef,
  videoInputRef,
  isListening,
  toggleListening
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 300);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        onSubmit(e);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4">
      <AnimatePresence>
        {(selectedImage || selectedVideo) && (
          <motion.div 
            key="selected-media-preview"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="mb-4 flex items-center gap-4 bg-purple-500/10 border border-purple-500/20 p-3 rounded-[2rem] w-max shadow-2xl backdrop-blur-xl"
          >
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-inner">
              {selectedImage && <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
              {selectedVideo && <video src={selectedVideo} className="w-full h-full object-cover" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-purple-300 uppercase tracking-[0.2em] font-bold">{selectedImage ? 'Vision Attached' : 'Video Attached'}</span>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.1em]">Ready for analysis</span>
            </div>
            <button 
              onClick={() => { setSelectedImage(null); setSelectedVideo(null); }} 
              className="ml-2 w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-all flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Bar - Horizontally Scrolling */}
      <div className="mb-4 flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2">
        <button
          type="button"
          onClick={startNewChat}
          className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-[10px] font-mono uppercase tracking-[0.2em] text-fuchsia-300 hover:text-white hover:bg-fuchsia-500/30 hover:border-fuchsia-400/50 transition-all duration-500 group shadow-[0_0_15px_rgba(217,70,239,0.15)] hover:shadow-[0_0_25px_rgba(217,70,239,0.3)]"
          title="Start New Cosmic Echo"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
          <span className="font-bold whitespace-nowrap">New Echo</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchEnabled(!searchEnabled)}
          className={cn(
            "flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border transition-all duration-500 text-[10px] font-mono uppercase tracking-[0.2em] font-bold",
            searchEnabled 
              ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
              : "bg-white/[0.03] border-white/10 text-white/40 hover:text-white hover:bg-white/10"
          )}
          title="Cosmic Grounding (Web Search Integration)"
        >
          <Compass className={cn("w-3.5 h-3.5", searchEnabled && "animate-spin-slow")} />
          <span className="whitespace-nowrap">{searchEnabled ? "Grounding Active" : "Cosmic Grounding"}</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all duration-500 group"
          title="Upload Vision (Image Context)"
        >
          <ImagePlus className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="font-bold whitespace-nowrap">Attach Vision</span>
        </button>

        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 hover:text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/20 transition-all duration-500 group"
          title="Upload Video (Video Understanding)"
        >
          <Video className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span className="font-bold whitespace-nowrap">Attach Video</span>
        </button>

        <button
          type="button"
          onClick={onGenerateVision}
          className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono uppercase tracking-[0.2em] text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 transition-all duration-500 group"
          title="Generate Cosmic Vision"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
          <span className="font-bold whitespace-nowrap">Generate Vision</span>
        </button>
      </div>

      <form 
        onSubmit={onSubmit}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-[4rem] blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative glass-panel rounded-[3.5rem] border border-white/10 flex flex-col transition-all duration-700 focus-within:border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute inset-0 nebula-pulse opacity-[0.05] pointer-events-none" />
          
          <div className="flex items-end p-3 md:p-6 relative z-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImageUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <input 
              type="file" 
              ref={videoInputRef} 
              onChange={onVideoUpload} 
              className="hidden" 
              accept="video/*" 
            />
            
            <textarea 
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Channeling universal wisdom..."
              className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 text-white placeholder-white/5 py-5 px-6 resize-none max-h-[300px] custom-scrollbar text-lg leading-relaxed font-light tracking-wide"
              rows={1}
            />

            <div className="flex items-center gap-3 mb-2">
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "p-4 rounded-full transition-all duration-500 hover:scale-110",
                  isListening 
                    ? "text-red-400 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse" 
                    : "text-white/20 hover:text-white hover:bg-white/10"
                )}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
              <button
                type="button"
                className="hidden md:flex p-4 text-white/20 hover:text-white hover:bg-white/10 rounded-full transition-all duration-500 hover:scale-110"
                title="Cosmic Expressions"
              >
                <Smile className="w-6 h-6" />
              </button>
              <button 
                type="submit"
                disabled={(!input.trim() && !selectedImage && !selectedVideo) || isLoading}
                className={cn(
                  "p-5 rounded-[2rem] transition-all duration-700 group/send",
                  (input.trim() || selectedImage || selectedVideo) && !isLoading
                    ? "bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95" 
                    : "bg-white/5 text-white/10 cursor-not-allowed"
                )}
              >
                <Send className={cn(
                  "w-6 h-6 transition-transform duration-500",
                  (input.trim() || selectedImage || selectedVideo) && "group-hover/send:translate-x-1 group-hover/send:-translate-y-1"
                )} />
              </button>
            </div>
          </div>
          
          <div className="px-10 py-4 flex items-center justify-between bg-white/[0.02] border-t border-white/5 relative z-10">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-500", 
                  isLoading ? "bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" : "bg-white/10"
                )} />
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold">
                  {isLoading ? "Manifesting..." : "Ready to echo"}
                </span>
              </div>
              <div className="hidden lg:flex items-center gap-8">
                <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em] font-bold">Markdown Enabled</span>
                <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em] font-bold">Shift + Enter for new line</span>
                <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.2em] font-bold">Cmd + Enter to send</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold">
              {input.length}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
