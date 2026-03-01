
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GameState, GameStatus } from './types';
import { 
  VIEWPORT_WIDTH, VIEWPORT_HEIGHT, WORLD_WIDTH
} from './constants';
import { createInitialState, updateState } from './engine/engine';
import MapEditor from './components/MapEditor';
import Player from './components/entities/Player';
import Platform from './components/entities/Platform';
import Coin from './components/entities/Coin';
import Enemy from './components/entities/Enemy';
import Spike from './components/entities/Spike';
import Goal from './components/entities/Goal';
import { getAvailableMaps } from './engine/tileMap/tileMapLoader';
import { createPauseHandler } from './input/pause';
import { createTitleHandler } from './input/title';

const App: React.FC = () => {
  // URLパラメータでマップエディターに切り替え
  const urlParams = new URLSearchParams(window.location.search);
  const isEditorMode = urlParams.get('mode') === 'editor';

  if (isEditorMode) {
    return <MapEditor />;
  }
  
  const [selectedMapPath, setSelectedMapPath] = useState<string>('default');
  const availableMaps = useMemo(() => getAvailableMaps(), []);
  const [gameState, setGameState] = useState<GameState>(createInitialState(selectedMapPath));
  const requestRef = useRef<number | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const isRespawningRef = useRef<boolean>(false);
  const gameStateRef = useRef<GameState>(gameState);

  // gameStateが変更されたらrefも更新
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const handleDamage = useCallback((isFall: boolean) => {
    if (isRespawningRef.current) return;
    
    isRespawningRef.current = true;
    setGameState(prev => {
      const next = { ...prev };
      next.player.life -= 1;
      next.player.isHurt = true;
      next.player.vel = { x: 0, y: 0 };
      gameStateRef.current = next;
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
        gameStateRef.current = newState;
        return newState;
      });
    }, 1200);
  }, []);

  const update = useCallback(() => {
    const currentState = gameStateRef.current;

    if (isRespawningRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    // ポーズ中やタイトル画面ではループを停止
    if (currentState.status === GameStatus.PAUSED || currentState.status === GameStatus.START) {
      // requestAnimationFrameを登録しない（ループを停止）
      return;
    }

    setGameState(prev => {
      const nextState = updateState(prev, keysRef.current, handleDamage);
      
      // ビューポートの更新（ここだけ副作用的にAppで行う）
      const targetViewportX = Math.max(0, nextState.player.pos.x - VIEWPORT_WIDTH / 2);
      nextState.viewportX = Math.min(WORLD_WIDTH - VIEWPORT_WIDTH, targetViewportX);
      
      // refも更新
      gameStateRef.current = nextState;
      
      return nextState;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [handleDamage]);

  // ゲームループを開始する関数
  const startGameLoop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    requestRef.current = requestAnimationFrame(update);
  }, [update]);

  // ゲーム状態がPLAYINGになったらループを再開
  useEffect(() => {
    if (gameState.status === GameStatus.PLAYING) {
      startGameLoop();
    }
  }, [gameState.status, startGameLoop]);

  useEffect(() => {
    const { handleKeyDown: pauseHandleKeyDown, handleKeyUp: pauseHandleKeyUp } = createPauseHandler(
      keysRef,
      gameStateRef,
      setGameState
    );
    const { handleKeyDown: titleHandleKeyDown, handleKeyUp: titleHandleKeyUp } = createTitleHandler(
      keysRef,
      gameStateRef,
      setGameState
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      pauseHandleKeyDown(e);
      titleHandleKeyDown(e);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
      pauseHandleKeyUp(e);
      titleHandleKeyUp(e);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // 初期状態がPLAYINGの場合のみループを開始
    // それ以外（START）の場合はループを開始しない
    if (gameState.status === GameStatus.PLAYING) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(update);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [update, gameState.status]);

  const startGame = () => {
    isRespawningRef.current = false;
    const newState = { ...createInitialState(selectedMapPath), status: GameStatus.PLAYING };
    gameStateRef.current = newState;
    setGameState(newState);
    // ゲーム開始時にループを再開
    startGameLoop();
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
          {gameState.platforms.map(platform => (
            <Platform key={platform.id} platform={platform} />
          ))}

          {/* Coins */}
          {gameState.coins.map(coin => (
            <Coin key={coin.id} coin={coin} />
          ))}

          {/* Enemies */}
          {gameState.enemies.map(enemy => (
            <Enemy key={enemy.id} enemy={enemy} />
          ))}

          {/* Spikes */}
          {gameState.spikes.map(spike => (
            <Spike key={spike.id} spike={spike} />
          ))}

          {/* Goal */}
          {gameState.star && (
            <Goal star={gameState.star} />
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
            
            {/* マップ選択 */}
            <div className="mb-6 w-full max-w-md">
              <label className="block text-sm font-medium mb-2 text-center">マップを選択</label>
              <select
                value={selectedMapPath}
                onChange={(e) => {
                  setSelectedMapPath(e.target.value);
                  const newState = { ...createInitialState(e.target.value), status: GameStatus.START };
                  gameStateRef.current = newState;
                  setGameState(newState);
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-yellow-500"
              >
                {availableMaps.map((map) => (
                  <option key={map.path} value={map.path}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>
            
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

        {gameState.status === GameStatus.PAUSED && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h1 className="text-6xl font-black mb-6">PAUSED</h1>
            <p className="text-xl mb-4">Pキーを押して再開</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
