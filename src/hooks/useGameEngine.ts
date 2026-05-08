import React, { useState, useEffect } from 'react';

/**
 * Main game engine hook handles the logic loop and rendering
 */
export function useGameEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  gameState: 'MENU' | 'PLAYING' | 'GAME_OVER' | 'GARAGE' | 'LEADERBOARD',
  onGameOver: (score: number, distance: number, likes: number) => void
) {
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [likes, setLikes] = useState(0);
  const [hype, setHype] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'PLAYING') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // Game state vars
    let gameSpeed = 300; // pixels per second
    let currentDistance = 0;
    let currentScore = 0;
    let currentLikes = 0;
    let currentHype = 0;
    let currentCombo = 0;

    // Entities
    const car = {
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      width: 40,
      height: 80,
      vx: 0,
      targetVx: 0,
      angle: 0,
      isDrifting: false,
      color: '#00FFFF',
      glow: '#FF00FF'
    };

    const particles: any[] = [];
    const obstacles: any[] = [];
    const collectibles: any[] = [];
    const particlesContainer: any[] = []; // BG Grid lines

    // Controls
    let inputDir = 0; // -1 left, 1 right, 0 none
    let isTouching = false;
    let touchX = 0;

    const handleTouchStart = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      isTouching = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      touchX = clientX;
      inputDir = clientX < window.innerWidth / 2 ? -1 : 1;
      car.isDrifting = true;
    };

    const handleTouchMove = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      if (!isTouching) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      inputDir = clientX < window.innerWidth / 2 ? -1 : 1;
    };

    const handleTouchEnd = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      isTouching = false;
      inputDir = 0;
      car.isDrifting = false;
      
      // Reset combo if drift ends
      if (currentCombo > 0) {
          currentScore += currentCombo * 10;
          currentCombo = 0;
          setCombo(0);
      }
    };

    // Keyboard fallback
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { inputDir = -1; car.isDrifting = true; }
      if (e.key === 'ArrowRight') { inputDir = 1; car.isDrifting = true; }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
         inputDir = 0; 
         car.isDrifting = false;
         if (currentCombo > 0) {
            currentScore += currentCombo * 10;
            currentCombo = 0;
            setCombo(0);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousedown', handleTouchStart);
    window.addEventListener('mousemove', handleTouchMove);
    window.addEventListener('mouseup', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Spawners
    let obstacleTimer = 0;
    let collectibleTimer = 0;

    const spawnObstacle = () => {
      obstacles.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: -100,
        width: 60,
        height: 30,
        type: Math.random() > 0.5 ? 'RatioSpike' : 'FUDWall'
      });
    };

    const spawnCollectible = () => {
      collectibles.push({
        x: Math.random() * (canvas.width - 40) + 20,
        y: -50,
        radius: 15,
        type: Math.random() > 0.2 ? 'Like' : 'Recast'
      });
    };

    const drawGrid = (offsetY: number) => {
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.2)';
      ctx.lineWidth = 2;
      const gridSize = 100;
      
      ctx.beginPath();
      for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      
      const movedY = offsetY % gridSize;
      for(let y = movedY; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    };

    // Main Engine Loop
    const gameLoop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update physics
      gameSpeed += dt * 5; // Gradually increase difficulty
      currentDistance += (gameSpeed * dt) / 100;

      // Car Movement
      car.targetVx = inputDir * (car.isDrifting ? 400 : 250);
      car.vx += (car.targetVx - car.vx) * 10 * dt; // Smooth integration
      car.x += car.vx * dt;

      // Clamp car to screen
      if (car.x < car.width/2) car.x = car.width/2;
      if (car.x > canvas.width - car.width/2) car.x = canvas.width - car.width/2;

      // Calculate Visual Angle
      car.angle = (car.vx / 400) * (Math.PI / 6); // Max 30 degree tilt

      // Drifting mechanics
      if (car.isDrifting && Math.abs(car.vx) > 100) {
        currentHype += dt * 20;
        currentCombo += dt * 10;
        if (currentHype > 100) currentHype = 100;
        
        // Spawn drift particles
        particles.push({
          x: car.x + (Math.random() - 0.5) * car.width,
          y: car.y + car.height/2,
          vx: -car.vx * 0.2 + (Math.random()-0.5)*50,
          vy: gameSpeed * 0.5 + (Math.random()-0.5)*50,
          life: 1.0,
          color: Math.random() > 0.5 ? '#FF00FF' : '#00FFFF'
        });
      } else {
          currentHype -= dt * 10;
          if (currentHype < 0) currentHype = 0;
      }

      // Spawning
      obstacleTimer -= dt;
      if (obstacleTimer <= 0) {
        spawnObstacle();
        obstacleTimer = Math.max(0.5, 2.0 - (gameSpeed / 500));
      }

      collectibleTimer -= dt;
      if (collectibleTimer <= 0) {
        spawnCollectible();
        collectibleTimer = Math.random() * 1.5 + 0.5;
      }

      // Clear Canvas
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid(currentDistance * 100);

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt * 2;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + p.life * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Update & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += gameSpeed * dt;

        if (obs.y > canvas.height + 100) {
          obstacles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = '#FF3333';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.fillRect(obs.x - obs.width/2, obs.y - obs.height/2, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Collision Check
        if (Math.abs(car.x - obs.x) < (car.width/2 + obs.width/2) * 0.8 &&
            Math.abs(car.y - obs.y) < (car.height/2 + obs.height/2) * 0.8) {
           // CRASH!
           onGameOver(Math.floor(currentScore), currentDistance, currentLikes);
           return; // Stop game loop immediately
        }
      }

      // Update & Draw Collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        item.y += gameSpeed * dt;

        if (item.y > canvas.height + 100) {
          collectibles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = item.type === 'Like' ? '#FF1493' : '#39FF14';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Collision Check
        if (Math.abs(car.x - item.x) < car.width/2 + item.radius &&
            Math.abs(car.y - item.y) < car.height/2 + item.radius) {
           // Collect
           if (item.type === 'Like') {
               currentLikes++;
               currentScore += 50;
           } else {
               currentHype += 20;
               currentScore += 100;
           }
           collectibles.splice(i, 1);
           continue;
        }
      }

      // Draw Car
      ctx.save();
      ctx.translate(car.x, car.y);
      ctx.rotate(car.angle);

      // Car Glow
      ctx.shadowColor = car.glow;
      ctx.shadowBlur = 20;
      ctx.fillStyle = car.color;
      
      // Car Body (cyberpunk shape)
      ctx.beginPath();
      ctx.moveTo(-car.width/2, car.height/2);
      ctx.lineTo(-car.width/2 + 10, -car.height/2 + 10);
      ctx.lineTo(0, -car.height/2);
      ctx.lineTo(car.width/2 - 10, -car.height/2 + 10);
      ctx.lineTo(car.width/2, car.height/2);
      ctx.lineTo(0, car.height/2 - 10);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Car window
      ctx.fillStyle = '#050505';
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(-6, -15);
      ctx.lineTo(6, -15);
      ctx.lineTo(10, 10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // UI Updates
      setScore(Math.floor(currentScore));
      setDistance(currentDistance);
      setHype(currentHype);
      setLikes(currentLikes);
      setCombo(Math.floor(currentCombo));

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousedown', handleTouchStart);
      window.removeEventListener('mousemove', handleTouchMove);
      window.removeEventListener('mouseup', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, onGameOver, canvasRef]);

  return { score, distance, likes, hype, combo };
}
