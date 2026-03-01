import React from 'react';
import { Entity } from '../../types/types';

interface CoinProps {
  coin: Entity;
}

const Coin: React.FC<CoinProps> = ({ coin }) => {
  if (coin.isCollected) {
    return null;
  }

  return (
    <div 
      className="absolute rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center"
      style={{ left: coin.pos.x, top: coin.pos.y, width: coin.size.x, height: coin.size.y }}
    >
      <div className="text-[10px] font-bold text-yellow-800">$</div>
    </div>
  );
};

export default Coin;
