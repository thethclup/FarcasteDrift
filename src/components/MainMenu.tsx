import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Wrench, Fingerprint, Coins, MessageSquare } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ATTRIBUTION_CODE, BUILDER_CODE, buildAttributedTransactionData } from '../lib/erc8021';
import { GM_REGISTRY } from '../constants';

interface MainMenuProps {
  onStart: () => void;
  wallet: string | null;
  setWallet: (addr: string | null) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart, wallet, setWallet }) => {
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const { sendTransaction, data: hash, isPending: isSayingGM } = useSendTransaction();
  const { isLoading: isWaitingForReceipt, isSuccess: isGMSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  // Sync wagmi connection state with parent component
  useEffect(() => {
    if (isConnected && address) {
      if (wallet !== address) setWallet(address);
    } else {
      if (wallet !== null) setWallet(null);
    }
  }, [isConnected, address, setWallet, wallet]);

  useEffect(() => {
    if (isGMSuccess && hash) {
      alert(`GM said successfully on Base!\nTx: ${hash.slice(0, 10)}...${hash.slice(-8)}`);
    }
  }, [isGMSuccess, hash]);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleSayGM = () => {
    if (!wallet) return;
    
    const attributedCalldata = buildAttributedTransactionData('0x') as `0x${string}`;
    
    sendTransaction({
      to: GM_REGISTRY as `0x${string}`, // Target GM contract
      data: attributedCalldata,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#050505] text-white font-sans overflow-y-auto"
    >
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none scanline z-50 opacity-20"></div>

      {/* Side Rails */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <div className="vertical-rail text-[10px] uppercase tracking-[0.5em] font-bold opacity-30 whitespace-nowrap">
          VIRAL FEED HIGHWAY • CHANNEL: /BASED-RACERS
        </div>
      </div>
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <div className="vertical-rail text-[10px] uppercase tracking-[0.5em] font-bold opacity-30 whitespace-nowrap text-right">
          BUILDER CODE: {BUILDER_CODE} • ID: 68F4EBEF
        </div>
      </div>
      
      {/* Decorative Background Shapes */}
      <div className="absolute w-[600px] h-[300px] bg-[#FF00FF] blur-[150px] opacity-10 rounded-full top-1/4"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#00FF00] blur-[150px] opacity-10 rounded-full bottom-0 left-0"></div>

      {/* Decorative Grid Overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-[300px] opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg)'
           }}>
      </div>

      <div className="max-w-md w-full flex flex-col items-center gap-10 z-30 relative pt-12">
        
        {/* LOGO */}
        <div className="perspective-text flex flex-col items-center">
          <motion.h1 
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-[#00FF00] text-3xl md:text-5xl font-black tracking-tighter mb-[-10px] md:mb-[-20px] uppercase italic neon-text-green"
          >
            Farcaster
          </motion.h1>
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-[100px] md:text-[160px] leading-[0.8] font-['Anton'] uppercase text-white tracking-tight drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          >
            Drift
          </motion.h2>
          <div className="flex gap-2 mt-4 perspective-text">
            <span className="bg-[#FF00FF] text-black text-[10px] md:text-[12px] px-2 py-0.5 font-black uppercase italic">High Speed</span>
            <span className="bg-white text-black text-[10px] md:text-[12px] px-2 py-0.5 font-black uppercase italic">On-Chain</span>
            <span className="bg-[#00FF00] text-black text-[10px] md:text-[12px] px-2 py-0.5 font-black uppercase italic">Viral</span>
          </div>
          <p className="mt-8 text-white/50 font-mono text-[10px] md:text-xs tracking-widest uppercase">
            Survive the algorithm. Build Hype.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col w-full gap-4 mt-8">
          <button 
            onClick={onStart}
            className="group relative w-full overflow-hidden focus:outline-none"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF00] to-[#FF00FF] blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-black px-12 py-5 border-2 border-white/20 flex items-center justify-center gap-3 transition-all group-hover:bg-opacity-80">
              <Play className="w-6 h-6 fill-current text-white" />
              <span className="text-2xl font-black uppercase tracking-tighter perspective-text text-white">RACE NOW</span>
            </div>
          </button>

          {!isConnected ? (
            <button 
              onClick={() => handleConnect()}
              disabled={isConnecting}
              className="flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 text-white font-bold py-5 border-2 border-white/10 hover:border-white/40 transition-colors uppercase tracking-widest text-sm"
            >
              {isConnecting ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Connect Base Wallet
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={() => disconnect()}
              className="flex items-center justify-center gap-2 text-[#00FF00] font-mono text-xs uppercase py-3 bg-black/60 neon-border hover:bg-black/80 transition-colors"
            >
               <Coins className="w-4 h-4" /> Connected: {address?.slice(0, 6)}...{address?.slice(-4)} (Disconnect)
            </button>
          )}

          <div className="flex gap-4 w-full">
             <button disabled className="opacity-50 cursor-not-allowed flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 text-white py-4 border-2 border-white/10 transition-colors">
               <Trophy className="w-5 h-5 text-white" />
               <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">Board</span>
             </button>
             <button disabled className="opacity-50 cursor-not-allowed flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 text-white py-4 border-2 border-white/10 transition-colors">
               <Wrench className="w-5 h-5 text-white" />
               <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">Garage</span>
             </button>
             {isConnected ? (
                <button 
                  onClick={handleSayGM}
                  disabled={isSayingGM || isWaitingForReceipt}
                  className="flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 border-2 border-white/10 hover:border-white/40 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-[#FF00FF]" />
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">{isSayingGM || isWaitingForReceipt ? '...' : 'SAY GM'}</span>
                </button>
             ) : (
                <button disabled className="opacity-50 cursor-not-allowed flex-1 flex flex-col items-center justify-center gap-2 bg-white/5 text-white py-4 border-2 border-white/10 transition-colors">
                  <MessageSquare className="w-5 h-5 text-white" />
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider">SAY GM</span>
                </button>
             )}
          </div>
        </div>

        {/* WEb3 Info */}
        <div className="mt-auto pt-6 text-center font-mono text-[10px] text-white/30 space-y-1">
           <p>Powered by Base Mainnet & Farcaster</p>
        </div>

      </div>
    </motion.div>
  );
};
