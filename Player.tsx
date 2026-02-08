
import React from 'react';
import { Entity } from './types';
import { ASSET_PATHS } from './constants';

interface PlayerProps {
  player: Entity & { isHurt?: boolean };
}

const Player: React.FC<PlayerProps> = ({ player }) => {
  const isFacingLeft = player.vel.x < 0;

  return (
    <div 
      className={`absolute ${
        player.isHurt ? 'animate-pulse opacity-70' : ''
      }`}
      style={{ 
        left: player.pos.x, 
        top: player.pos.y, 
        width: player.size.x, 
        height: player.size.y,
        transform: isFacingLeft ? 'scaleX(-1)' : 'scaleX(1)'
      }}
    >
      <img 
        src={ASSET_PATHS.PLAYER}
        alt="Player"
        className="w-full h-full object-cover"
        style={{ 
          display: 'block',
          filter: player.isHurt ? 'brightness(1.5) saturate(1.5) hue-rotate(0deg)' : 'none'
        }}
      />
    </div>
  );
};

export default Player;
