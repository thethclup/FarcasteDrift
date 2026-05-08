export type GameState = 'MENU' | 'PLAYING' | 'GAME_OVER' | 'GARAGE' | 'LEADERBOARD';

export interface CarStats {
  id: string;
  name: string;
  color: string;
  glowColor: string;
  maxSpeed: number;
  handling: number;
  unlocked: boolean;
  price?: number;
}

export const CARS: CarStats[] = [
  { id: 'base_racer', name: 'Base Racer', color: '#0052FF', glowColor: '#0052FF', maxSpeed: 100, handling: 100, unlocked: true },
  { id: 'farcaster_purple', name: 'FC Drifter', color: '#8A2BE2', glowColor: '#FF00FF', maxSpeed: 110, handling: 95, unlocked: true },
  { id: 'doge_car', name: 'Doge Mobile', color: '#F6C324', glowColor: '#FFA500', maxSpeed: 90, handling: 120, unlocked: false, price: 1000 },
  { id: 'pepe_rocket', name: 'Pepe Rocket', color: '#39FF14', glowColor: '#39FF14', maxSpeed: 130, handling: 80, unlocked: false, price: 2500 }
];

export interface PlayerData {
  wallet: string | null;
  highScore: number;
  totalLikes: number;
  ownedCars: string[];
  selectedCarId: string;
}
