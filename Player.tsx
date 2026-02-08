
import React from 'react';
import { Entity } from './types';

interface PlayerProps {
  player: Entity & { isHurt?: boolean };
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  const isFacingLeft = player.vel.x < 0;

  return (
    <div 
      className={`absolute rounded transition-colors duration-200 ${
        player.isHurt 
          ? 'bg-red-600 border-red-800 animate-pulse' 
          : 'bg-blue-500 border-2 border-blue-700'
      }`}
      style={{ 
        left: player.pos.x, 
        top: player.pos.y, 
        width: player.size.x, 
        height: player.size.y,
        transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'
      }}
    >
      {/* 帽子/髪のハイライト */}
      <div className="absolute top-1 left-1 right-1 h-3 bg-white opacity-30 rounded-full" />
      
      {/* つぶらな瞳 */}
      <div className="flex justify-center mt-2 space-x-1">
         <div className="w-1.5 h-1.5 bg-black rounded-full" />
         <div className="w-1.5 h-1.5 bg-black rounded-full" />
      </div>
    </div>
  );
};

export default Player;
