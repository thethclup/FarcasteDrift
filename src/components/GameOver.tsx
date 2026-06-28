import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, RefreshCcw, Share2, Award, Zap, Heart, Navigation2, Sun } from 'lucide-react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { buildAttributedTransactionData } from '../lib/erc8021';
import { toHex } from 'viem';
import { GM_REGISTRY, SCORE_REGISTRY } from '../constants';

interface GameOverProps {
  score: number;
  distance: number;
  likes: number;
  wallet: string | null;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, distance, likes, wallet, onRestart, onHome }) => {
  const { sendTransaction: sendScore, data: scoreHash, isPending: isScorePending } = useSendTransaction();
  const { sendTransaction: sendGM, data: gmHash, isPending: isGMPending } = useSendTransaction();

  const { isLoading: isWaitingForScore, isSuccess: isScoreSuccess } = useWaitForTransactionReceipt({ hash: scoreHash });
  const { isLoading: isWaitingForGM, isSuccess: isGMSuccess } = useWaitForTransactionReceipt({ hash: gmHash });

  useEffect(() => {
    if (isGMSuccess && gmHash) {
      alert(`GM sent successfully on-chain! Tx: ${gmHash}`);
    }
  }, [isGMSuccess, gmHash]);

  const handleSubmitScore = () => {
    if (!wallet) {
      alert("Please connect wallet on home screen first to submit on-chain.");
      onHome();
      return;
    }
    
    // Create an arbitrary payload for the score to log it on-chain with builder suffix
    const scorePayload = toHex(`score:${score},dist:${distance.toFixed(1)}`);
    const attributedCalldata = buildAttributedTransactionData(scorePayload) as `0x${string}`;
    
    sendScore({
      to: SCORE_REGISTRY as `0x${string}`, // Target Score Registry contract
      data: attributedCalldata,
    });
  };

  const handleSayGM = () => {
    if (!wallet) return;
    const attributedCalldata = buildAttributedTransactionData('0x') as `0x${string}`;
    sendGM({
      to: GM_REGISTRY as `0x${string}`, // GM Contract
      data: attributedCalldata,
    });
  };

  const isSubmittingScore = isScorePending || isWaitingForScore;
  const isSubmittingGM = isGMPending || isWaitingForGM;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#050505]/95 backdrop-blur-md overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none scanline z-10 opacity-20"></div>

      <div className="max-w-md w-full flex flex-col items-center gap-6 z-30 relative">
        
        <h2 className="text-[60px] md:text-[80px] leading-[0.8] font-['Anton'] uppercase text-white tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] perspective-text neon-text-magenta">
          CRASHED
        </h2>

        <div className="w-full bg-black/80 neon-border border-[#00FF00]/40 p-8 space-y-4 shadow-[0_0_15px_rgba(0,255,0,0.2)] text-center relative overflow-hidden group">
            {/* Scanline Inside Box */}
            <div className="absolute inset-0 pointer-events-none scanline opacity-30"></div>
            
            <div className="flex flex-col items-center border-b border-white/10 pb-6 relative z-10">
                <span className="text-[#00FF00] opacity-70 font-mono text-[10px] uppercase tracking-widest mb-2">Final Score</span>
                <span className="text-6xl font-['Anton'] text-white drop-shadow-md">{score.toLocaleString()}</span>
            </div>

            <div className="flex justify-between px-4 pt-4 relative z-10">
                <div className="flex flex-col items-center">
                   <Navigation2 className="w-5 h-5 text-[#00FF00] mb-2 drop-shadow-[0_0_5px_rgba(0,255,0,0.8)]" />
                   <span className="text-xl font-black text-white font-mono">{distance.toFixed(2)}km</span>
                   <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Distance</span>
                </div>
                <div className="flex flex-col items-center">
                   <Heart className="w-5 h-5 text-[#FF00FF] mb-2 drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]" />
                   <span className="text-xl font-black text-white font-mono">{likes}</span>
                   <span className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Likes</span>
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 mt-6">
           <button 
             onClick={handleSayGM}
             disabled={isSubmittingGM}
             className="w-full px-3 py-4 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center justify-center gap-2 font-['Cinzel'] text-sm font-bold shadow-[0_0_15px_rgba(232,160,32,0.2)] disabled:opacity-50"
           >
             <Sun className="w-5 h-5" />
             {isSubmittingGM ? 'Saying GM...' : 'Say GM'}
           </button>
           
           {scoreHash && isScoreSuccess ? (
               <div className="bg-[#00FF00]/10 neon-border border-[#00FF00] text-[#00FF00] p-4 text-center font-mono text-xs mb-4 uppercase tracking-widest">
                  Successfully minted on Base<br/>
                  <span className="opacity-70 mt-1 block">Tx: {scoreHash.slice(0,10)}...{scoreHash.slice(-8)}</span>
               </div>
           ) : (
               <button 
                  onClick={handleSubmitScore}
                  disabled={isSubmittingScore}
                  className="group relative w-full overflow-hidden focus:outline-none disabled:opacity-50"
               >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF00] to-[#FF00FF] blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative bg-black px-12 py-5 border-2 border-[#00FF00]/50 flex items-center justify-center gap-3 transition-all group-hover:bg-opacity-80">
                    {isSubmittingScore ? (
                        <span className="animate-pulse flex items-center gap-2 text-[#00FF00] font-bold uppercase tracking-widest text-sm"><Zap className="w-5 h-5"/> Submitting...</span>
                    ) : (
                        <span className="text-lg font-black uppercase tracking-widest text-[#00FF00] flex items-center gap-2">
                           <Award className="w-5 h-5" /> Record This Run on-chain
                        </span>
                    )}
                  </div>
               </button>
           )}

           <div className="flex gap-4">
              <button 
                onClick={onRestart}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 border-2 border-white/10 transition-colors uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-2"
              >
                  <RefreshCcw className="w-4 h-4" /> Retry
              </button>
              <button 
                onClick={onHome}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-5 border-2 border-white/10 transition-colors uppercase tracking-widest font-bold text-sm flex items-center justify-center gap-2"
              >
                  Home
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
