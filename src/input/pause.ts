import React from 'react';
import { GameState, GameStatus } from '../types';

/**
 * ポーズ機能のハンドラー
 */
export function createPauseHandler(
  keysRef: React.MutableRefObject<{ [key: string]: boolean }>,
  gameStateRef: React.MutableRefObject<GameState>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const prevPKeyRef = { current: false };

  const handleKeyDown = (e: KeyboardEvent) => {
    keysRef.current[e.key] = true;
    
    // Pキーでポーズ/再開を切り替え
    if (e.key === 'p' || e.key === 'P') {
      const currentPKey = keysRef.current['p'] || keysRef.current['P'];
      if (currentPKey && !prevPKeyRef.current) {
        setGameState(prev => {
          const newStatus = prev.status === GameStatus.PLAYING 
            ? GameStatus.PAUSED 
            : prev.status === GameStatus.PAUSED 
              ? GameStatus.PLAYING 
              : prev.status;
          const newState = { ...prev, status: newStatus };
          // refも更新
          gameStateRef.current = newState;
          return newState;
        });
      }
      prevPKeyRef.current = true;
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    keysRef.current[e.key] = false;
    
    // Pキーが離されたらフラグをリセット
    if (e.key === 'p' || e.key === 'P') {
      prevPKeyRef.current = false;
    }
  };

  return {
    handleKeyDown,
    handleKeyUp
  };
}
