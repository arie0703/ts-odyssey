import React from 'react';
import { Entity } from '../../types/types';

interface DangerousEnemyProps {
  enemy: Entity;
}

const DangerousEnemy: React.FC<DangerousEnemyProps> = ({ enemy }) => {
  if (enemy.isDead) {
    return null;
  }

  return (
    <div 
      className="absolute bg-purple-600 rounded-lg border-2 border-purple-800"
      style={{ left: enemy.pos.x, top: enemy.pos.y, width: enemy.size.x, height: enemy.size.y }}
    >
      <div className="flex justify-around mt-1">
        <div className="w-2 h-2 bg-yellow-300 rounded-full" />
        <div className="w-2 h-2 bg-yellow-300 rounded-full" />
      </div>
      {/* 危険を示すトゲのような装飾 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1">
        <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-purple-800"></div>
      </div>
    </div>
  );
};

export default DangerousEnemy;
