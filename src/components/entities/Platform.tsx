import React from 'react';
import { Entity } from '../../types/types';

interface PlatformProps {
  platform: Entity;
}

const Platform: React.FC<PlatformProps> = ({ platform }) => {
  return (
    <div 
      className="absolute bg-orange-800"
      style={{ left: platform.pos.x, top: platform.pos.y, width: platform.size.x, height: platform.size.y }}
    />
  );
};

export default Platform;
