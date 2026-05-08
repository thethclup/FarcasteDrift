import React, { useEffect, useRef } from 'react';
import { useGameEngine } from '../hooks/useGameEngine';

interface GameCanvasProps {
  gameState: 'MENU' | 'PLAYING' | 'GAME_OVER' | 'GARAGE' | 'LEADERBOARD';
  onGameOver: (score: number, distance: number, likes: number) => void;
  onUpdateStats: (stats: { score: number, distance: number, likes: number, hype: number, combo: number }) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameOver, onUpdateStats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const stats = useGameEngine(canvasRef, gameState, onGameOver);

  // Sync stats to parent for HUD
  useEffect(() => {
    if (gameState === 'PLAYING') {
      onUpdateStats(stats);
    }
  }, [stats, gameState, onUpdateStats]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 z-0 ${gameState === 'PLAYING' ? 'block' : 'hidden'}`}
      style={{ display: gameState === 'PLAYING' ? 'block' : 'none' }}
    />
  );
};
