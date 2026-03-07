import React from 'react';
import { Entity } from '../../types/types';

interface EnemyProps {
  enemy: Entity;
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  if (enemy.isDead) {
    return null;
  }

  return (
    <div 
      className="absolute bg-red-600 rounded-lg border-2 border-red-800"
      style={{ left: enemy.pos.x, top: enemy.pos.y, width: enemy.size.x, height: enemy.size.y }}
    >
      <div className="flex justify-around mt-1">
        <div className="w-2 h-2 bg-white rounded-full" />
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default Enemy;
