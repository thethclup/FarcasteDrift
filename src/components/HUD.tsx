import React from 'react';
import { motion } from 'motion/react';
import { Flame, Heart, Repeat, Navigation2 } from 'lucide-react';

interface HUDProps {
  score: number;
  distance: number;
  likes: number;
  hype: number;
  combo: number;
}

export const HUD: React.FC<HUDProps> = ({ score, distance, likes, hype, combo }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between">
      
      {/* Top HUD (Design Pattern) */}
      <div className="flex justify-between items-start p-6 z-20">
        <div className="flex gap-4">
          <div className="neon-border bg-black/60 px-4 py-2 rounded-sm border-[#00FF00]/40">
            <div className="text-[10px] uppercase tracking-widest text-[#00FF00] opacity-70">Hype Meter</div>
            <div className="text-2xl font-black text-[#00FF00] font-mono">{Math.floor(hype)}%</div>
          </div>
          <div className="neon-border border-[#FF00FF]/40 bg-black/60 px-4 py-2 rounded-sm shadow-[0_0_15px_rgba(255,0,255,0.2)]">
            <div className="text-[10px] uppercase tracking-widest text-[#FF00FF] opacity-70">Likes / Pts</div>
            <div className="text-xl font-black text-[#FF00FF] font-mono">{likes} <span className="text-xs opacity-50">/</span> {score}</div>
          </div>
        </div>
        <div className="text-right neon-border border-white/20 bg-black/60 px-4 py-2 rounded-sm hidden sm:block">
          <div className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Distance</div>
          <div className="text-sm font-mono text-white">{distance.toFixed(2)} km</div>
        </div>
      </div>

      {/* Center Messages (Combo) */}
      <div className="flex-1 flex items-center justify-center">
        {combo > 10 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={combo}
            className="text-6xl md:text-[100px] leading-[0.8] font-['Anton'] uppercase text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] perspective-text neon-text-magenta"
          >
            {combo.toFixed(0)}x DRIFT!
          </motion.div>
        )}
      </div>

      {/* Bottom Bar: Hype Meter & Mobile Controls */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-2 p-6 z-20">
         <div className="w-full flex justify-between px-2 text-[10px] font-black uppercase tracking-widest opacity-70">
            <span className="text-white">Chill</span>
            <span className="text-[#FF00FF]">Viral Rush</span>
         </div>
         <div className="w-full h-4 bg-black/80 border-2 border-white/10 overflow-hidden transform skew-x-[-10deg]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00FF00] to-[#FF00FF]"
              style={{ width: `${hype}%` }}
              layout
            />
         </div>
         {hype === 100 && (
           <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-[#00FF00] font-black flex items-center gap-2 text-sm uppercase tracking-widest neon-text-green mt-2"
           >
             <Flame className="w-4 h-4" /> VIRAL MODE ENGAGED <Flame className="w-4 h-4" />
           </motion.div>
         )}
         
         <div className="text-white/40 text-[10px] mt-4 uppercase text-center md:hidden tracking-widest font-bold">
            [ SWIPE TO STEER &middot; HOLD TO DRIFT ]
         </div>
      </div>
    </div>
  );
};
