import React from 'react';
import { TICKER_WORDS } from '../data/jobs';
import './Ticker.css';

function Ticker() {
  const items = [...TICKER_WORDS, ...TICKER_WORDS];

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {items.map((item, i) => (
          <span className="ticker-item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Ticker;
