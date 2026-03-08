import React from 'react';
import { Entity } from '../../types/types';

interface PlatformProps {
  platform: Entity;
  platformColor: string;
}

const Platform: React.FC<PlatformProps> = ({ platform, platformColor }) => {
  return (
    <div 
      className="absolute"
      style={{ 
        left: platform.pos.x, 
        top: platform.pos.y, 
        width: platform.size.x, 
        height: platform.size.y,
        backgroundColor: platformColor
      }}
    />
  );
};

export default Platform;
