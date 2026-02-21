import React from 'react';
import { GameState, GameStatus } from '../types';

/**
 * タイトル画面に戻る機能のハンドラー
 */
export function createTitleHandler(
  keysRef: React.MutableRefObject<{ [key: string]: boolean }>,
  gameStateRef: React.MutableRefObject<GameState>,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) {
  const prevTKeyRef = { current: false };

  const handleKeyDown = (e: KeyboardEvent) => {
    keysRef.current[e.key] = true;
    
    // Tキーでタイトル画面に戻る
    if (e.key === 't' || e.key === 'T') {
      const currentTKey = keysRef.current['t'] || keysRef.current['T'];
      if (currentTKey && !prevTKeyRef.current) {
        setGameState(prev => {
          // ゲーム中またはポーズ中の場合のみタイトルに戻る
          if (prev.status === GameStatus.PLAYING || prev.status === GameStatus.PAUSED) {
            const newState = { ...prev, status: GameStatus.START };
            // refも更新
            gameStateRef.current = newState;
            return newState;
          }
          return prev;
        });
      }
      prevTKeyRef.current = true;
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    keysRef.current[e.key] = false;
    
    // Tキーが離されたらフラグをリセット
    if (e.key === 't' || e.key === 'T') {
      prevTKeyRef.current = false;
    }
  };

  return {
    handleKeyDown,
    handleKeyUp
  };
}
