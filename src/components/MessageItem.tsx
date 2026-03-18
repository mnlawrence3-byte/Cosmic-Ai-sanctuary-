import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Check, Copy, Share2, Smile, Download } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../lib/utils';
import { type Message, type BotPersonality, type UserProfile } from '../types';

interface MessageItemProps {
  message: Message;
  selectedBot: BotPersonality;
  userProfile: UserProfile;
  isSpeaking: boolean;
  isCopied: boolean;
  onSpeak: (text: string, id: string) => void;
  onCopy: (text: string, id: string) => void;
  onShare: (message: Message) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = React.memo(({ 
  message, 
  selectedBot, 
  userProfile,
  isSpeaking,
  isCopied,
  onSpeak,
  onCopy,
  onShare,
  onReact
}) => {
  const [showReactions, setShowReactions] = React.useState(false);
  const emojis = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex gap-3 md:gap-6 max-w-4xl mx-auto w-full group",
        message.role === 'user' ? "flex-row-reverse" : "flex-row"
      )}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div className={cn(
        "w-12 h-12 md:w-16 md:h-16 rounded-[2rem] flex-shrink-0 flex items-center justify-center text-xl md:text-3xl shadow-2xl relative overflow-hidden group-hover:scale-110 transition-transform duration-700",
        message.role === 'user' ? "bg-white/5 border border-white/10" : cn("bg-gradient-to-br", selectedBot.color)
      )}>
        <div className="absolute inset-0 nebula-pulse opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{message.role === 'user' ? userProfile.avatar || '👤' : selectedBot.avatar}</span>
      </div>
      <div className={cn(
        "flex flex-col space-y-4 flex-1 min-w-0",
        message.role === 'user' ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-4 px-2">
          <span className="text-[11px] font-mono text-white/50 uppercase tracking-[0.2em] font-bold">
            {message.role === 'user' ? userProfile.name || 'Seeker' : selectedBot.name}
          </span>
          <div className="flex items-center gap-1.5 transition-opacity opacity-100">
            <button
              onClick={() => onSpeak(message.content, message.id)}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300",
                isSpeaking ? "text-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "text-white/20 hover:text-white/80 hover:bg-white/5"
              )}
              title="Speak Echo"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onCopy(message.content, message.id)}
              className="p-2.5 rounded-xl text-white/20 hover:text-white/80 hover:bg-white/5 transition-all duration-300"
              title="Copy Echo"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onShare(message)}
              className="p-2.5 rounded-xl text-white/20 hover:text-white/80 hover:bg-white/5 transition-all duration-300"
              title="Share Echo"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={cn(
          "p-5 md:p-10 rounded-[2.5rem] text-[17px] leading-relaxed shadow-2xl relative overflow-hidden transition-all duration-700 w-full group-hover:shadow-purple-500/10",
          message.role === 'user' 
            ? "bg-white/[0.03] text-white/90 rounded-tr-none border border-white/5 hover:bg-white/[0.06] hover:border-white/10" 
            : "glass-panel text-white/80 rounded-tl-none border-white/10 hover:border-white/20"
        )}>
          {(message.role === 'assistant' || message.role === 'model') && <div className="absolute inset-0 nebula-pulse opacity-[0.05]" />}
          <div className="markdown-body text-left break-words overflow-hidden font-light tracking-wide leading-relaxed">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus as any}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-xl !bg-black/40 !border !border-white/10 my-4"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={cn("bg-white/10 px-1.5 py-0.5 rounded text-purple-300 font-mono text-[0.9em]", className)} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
          {message.image && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-sm group/image">
              <img src={message.image} alt="Cosmic Context" className="w-full h-auto object-cover" referrerPolicy="no-referrer" loading="lazy" />
              <button 
                onClick={async () => {
                  try {
                    const imageUrl = message.image!;
                    let blob: Blob;
                    
                    if (imageUrl.startsWith('data:')) {
                      const [header, base64] = imageUrl.split(',');
                      const mime = header.split(':')[1].split(';')[0];
                      const byteString = atob(base64);
                      const ab = new ArrayBuffer(byteString.length);
                      const ia = new Uint8Array(ab);
                      for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                      }
                      blob = new Blob([ab], { type: mime });
                    } else {
                      const res = await fetch(imageUrl);
                      blob = await res.blob();
                    }
                    
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `cosmic-vision-${message.id}.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (err) {
                    console.error('Failed to download image:', err);
                  }
                }}
                className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/80 border border-white/10 opacity-100 md:opacity-0 md:group-hover/image:opacity-100 transition-all duration-300 shadow-xl"
                title="Save Vision"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
          {message.youtubeUrl && (
            <div className="mt-4 relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-sm">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${message.youtubeUrl}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        
        {/* Reactions Row */}
        <div className="flex items-center gap-2 px-1 relative">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={cn(
              "p-1 rounded-full text-white/30 hover:text-white transition-all md:opacity-0 group-hover:opacity-100",
              showReactions && "opacity-100"
            )}
          >
            <Smile className="w-4 h-4" />
          </button>
          
          <div className={cn(
            "flex items-center gap-1 bg-black/40 rounded-full px-2 py-1 border border-white/10 transition-all",
            showReactions ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none md:absolute md:left-8"
          )}>
            {emojis.map(emoji => (
              <button key={emoji} onClick={() => onReact(message.id, emoji)} className="hover:scale-125 transition-transform">
                {emoji}
              </button>
            ))}
          </div>
          
          {message.reactions && Object.entries(message.reactions).map(([emoji, count]) => (
            <div key={emoji} className="bg-white/5 rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1">
              <span>{emoji}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>

        <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest px-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </motion.div>
  );
});
