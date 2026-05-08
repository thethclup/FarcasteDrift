import React, { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { MainMenu } from './components/MainMenu';
import { GameOver } from './components/GameOver';
import { GameState } from './types';

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

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans selection:bg-fc-magenta selection:text-white">
      
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
