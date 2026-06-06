import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { GameOver } from './components/GameOver';
import { GameState } from './types';
import { Sun } from 'lucide-react';
import { sayGMTx } from './lib/web3';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [wallet, setWallet] = useState<string | null>(null);
  
  // Game stats from engine
  const [stats, setStats] = useState({
    score: 0,
    distance: 0,
    likes: 0,
    hype: 0,
    combo: 0
  });

  const handleStartGame = () => {
    setStats({ score: 0, distance: 0, likes: 0, hype: 0, combo: 0 });
    setGameState('PLAYING');
  };

  const handleGameOver = (score: number, distance: number, likes: number) => {
    // Preserve final stats
    setStats(prev => ({ ...prev, score, distance, likes }));
    setGameState('GAME_OVER');
  };

  const sendGMTransaction = async () => {
    if (!wallet) return;
    try {
      console.log('Sending GM transaction to 0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3...');
      const hash = await sayGMTx();
      alert(`GM sent successfully on-chain! Tx: ${hash}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans selection:bg-fc-magenta selection:text-white">
      {wallet && (
        <div className="absolute top-4 right-4 z-50">
          <button 
            onClick={sendGMTransaction} 
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            Say GM
          </button>
        </div>
      )}
      
      {/* 3D Canvas Game Engine */}
      <GameCanvas 
        gameState={gameState} 
        onGameOver={handleGameOver}
        onUpdateStats={setStats}
      />

      {/* OVERLAYS */}
      {gameState === 'MENU' && (
        <MainMenu 
          onStart={handleStartGame} 
          wallet={wallet} 
          setWallet={setWallet} 
        />
      )}

      {gameState === 'PLAYING' && (
        <HUD 
          score={stats.score}
          distance={stats.distance}
          likes={stats.likes}
          hype={stats.hype}
          combo={stats.combo}
        />
      )}

      {gameState === 'GAME_OVER' && (
        <GameOver 
          score={stats.score}
          distance={stats.distance}
          likes={stats.likes}
          wallet={wallet}
          onRestart={handleStartGame}
          onHome={() => setGameState('MENU')}
        />
      )}

    </div>
  );
}
