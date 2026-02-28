
import React from 'react';
import { Entity } from '../types/types';
import '../styles/spike.css';

interface SpikeProps {
  spike: Entity;
}

const Spike: React.FC<SpikeProps> = ({ spike }) => {
  return (
    <div 
      className="spike-container"
      style={{ left: spike.pos.x, top: spike.pos.y, width: spike.size.x, height: spike.size.y }}
    >
      <div className="spike-triangle" />
    </div>
  );
};

export default Spike;
