import React from 'react';
import { Entity } from '../../types/types';

interface CrackedPlatformProps {
  platform: Entity & { isCracked?: boolean; crackTimer?: number; isDestroyed?: boolean };
  platformColor: string;
}

const CrackedPlatform: React.FC<CrackedPlatformProps> = ({ platform, platformColor }) => {
  // 消滅した場合は表示しない
  if (platform.isDestroyed) {
    return null;
  }

  // タイマーの残り時間から視覚的フィードバックを計算
  const timer = platform.crackTimer || 1000;
  const remainingTime = timer / 1000; // 秒に変換
  const opacity = remainingTime < 0.3 ? 0.5 + (remainingTime / 0.3) * 0.5 : 1; // 残り0.3秒以下で点滅
  const isWarning = remainingTime < 0.5; // 残り0.5秒以下で警告表示

  return (
    <div 
      className="absolute cracked-platform"
      style={{ 
        left: platform.pos.x, 
        top: platform.pos.y, 
        width: platform.size.x, 
        height: platform.size.y,
        backgroundColor: platformColor,
        opacity: opacity,
        transition: isWarning ? 'opacity 0.1s ease-in-out' : 'none'
      }}
    >
      {/* ひびのパターン */}
      <div 
        className="crack-pattern"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(45deg, rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(135deg, rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(-135deg, rgba(0,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '8px 8px',
          pointerEvents: 'none'
        }}
      />
      {/* 警告表示（残り時間が少ない場合） */}
      {isWarning && (
        <div 
          className="crack-warning"
          style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(255, 0, 0, 0.8)',
            boxSizing: 'border-box',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default CrackedPlatform;
