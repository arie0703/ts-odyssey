
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameStatus } from './types';
import { 
  VIEWPORT_WIDTH, VIEWPORT_HEIGHT, WORLD_WIDTH
} from './constants';
import { createInitialState, updateState } from './engine';
import Player from './Player';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const requestRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const isRespawningRef = useRef<boolean>(false);

  const handleDamage = useCallback((isFall: boolean) => {
    if (isRespawningRef.current) return;
    
    isRespawningRef.current = true;
    setGameState(prev => {
      const next = { ...prev };
      next.player.life -= 1;
      next.player.isHurt = true;
      next.player.vel = { x: 0, y: 0 };
      return next;
    });

    setTimeout(() => {
      setGameState(prev => {
        const newState = { ...prev };
        if (newState.player.life <= 0) {
          newState.status = GameStatus.GAMEOVER;
        } else {
          newState.player.pos = { 
            x: Math.max(100, newState.player.pos.x - 200), 
            y: isFall ? 100 : newState.player.pos.y - 100 
          };
          newState.player.vel = { x: 0, y: 0 };
          newState.player.isHurt = false;
        }
        isRespawningRef.current = false;
        return newState;
      });
    }, 1200);
  }, []);

  const update = useCallback(() => {
    if (isRespawningRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    setGameState(prev => {
      const nextState = updateState(prev, keysRef.current, handleDamage);
      
      // ビューポートの更新（ここだけ副作用的にAppで行う）
      const targetViewportX = Math.max(0, nextState.player.pos.x - VIEWPORT_WIDTH / 2);
      nextState.viewportX = Math.min(WORLD_WIDTH - VIEWPORT_WIDTH, targetViewportX);
      
      return nextState;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [handleDamage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current[e.key] = true;
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.key] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestRef.current = requestAnimationFrame(update);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  const startGame = () => {
    isRespawningRef.current = false;
    setGameState({ ...createInitialState(), status: GameStatus.PLAYING });
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900 font-sans overflow-hidden">
      <div 
        className="relative overflow-hidden bg-sky-300 border-4 border-white shadow-2xl"
        style={{ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }}
      >
        <div 
          className="absolute inset-0"
          style={{ transform: `translateX(-${gameState.viewportX}px)` }}
        >
          {/* Platforms */}
          {gameState.platforms.map(p => (
            <div 
              key={p.id}
              className="absolute bg-orange-800 border-t-4 border-orange-600"
              style={{ left: p.pos.x, top: p.pos.y, width: p.size.x, height: p.size.y }}
            />
          ))}

          {/* Coins */}
          {gameState.coins.map(c => !c.isCollected && (
            <div 
              key={c.id}
              className="absolute rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center"
              style={{ left: c.pos.x, top: c.pos.y, width: c.size.x, height: c.size.y }}
            >
              <div className="text-[10px] font-bold text-yellow-800">$</div>
            </div>
          ))}

          {/* Enemies */}
          {gameState.enemies.map(e => !e.isDead && (
            <div 
              key={e.id}
              className="absolute bg-red-600 rounded-lg border-2 border-red-800"
              style={{ left: e.pos.x, top: e.pos.y, width: e.size.x, height: e.size.y }}
            >
              <div className="flex justify-around mt-1">
                <div className="w-2 h-2 bg-white rounded-full" />
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          ))}

          {/* Goal */}
          {gameState.star && (
            <div 
              className="absolute text-5xl"
              style={{ left: gameState.star.pos.x, top: gameState.star.pos.y }}
            >
              ⭐
            </div>
          )}

          {/* Player Component */}
          <Player player={gameState.player} />
        </div>

        {/* HUD */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2 pointer-events-none">
          <div className="bg-black/50 p-2 rounded text-white flex items-center space-x-2 border border-white/20">
            <span>❤️</span>
            <span className="font-bold">{gameState.player.life}</span>
          </div>
          <div className="bg-black/50 p-2 rounded text-white flex items-center space-x-2 border border-white/20">
            <span className="text-yellow-400">🪙</span>
            <span className="font-bold">{gameState.player.score}</span>
          </div>
        </div>

        {/* Screens */}
        {gameState.status === GameStatus.START && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-black mb-6">TS ODYSSEY</h1>
            <button 
              onClick={startGame}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full text-2xl font-bold transition-transform hover:scale-105"
            >
              START
            </button>
          </div>
        )}

        {gameState.status === GameStatus.GAMEOVER && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-6">GAME OVER</h1>
            <button onClick={startGame} className="underline text-xl">RETRY</button>
          </div>
        )}

        {gameState.status === GameStatus.CLEAR && (
          <div className="absolute inset-0 bg-green-600/80 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-6">CLEAR!</h1>
            <button onClick={startGame} className="underline text-xl">PLAY AGAIN</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
