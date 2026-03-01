import React from 'react';
import { Entity } from '../../types/types';

interface GoalProps {
  star: Entity;
}

const Goal: React.FC<GoalProps> = ({ star }) => {
  return (
    <div 
      className="absolute text-5xl"
      style={{ left: star.pos.x, top: star.pos.y }}
    >
      ⭐
    </div>
  );
};

export default Goal;
