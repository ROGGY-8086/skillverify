import React from 'react';

const MatchScoreCard = ({ score, size = 'md' }) => {
  const numScore = Number(score);
  
  let color = 'text-green-500';
  let bgColor = 'text-green-100';
  
  if (numScore < 60) {
    color = 'text-error';
    bgColor = 'text-red-100';
  } else if (numScore < 80) {
    color = 'text-warning';
    bgColor = 'text-yellow-100';
  }

  const sizes = {
    sm: { wrapper: 'w-12 h-12', text: 'text-sm', stroke: 3 },
    md: { wrapper: 'w-16 h-16', text: 'text-xl', stroke: 4 },
    lg: { wrapper: 'w-24 h-24', text: 'text-3xl', stroke: 6 },
  };

  const currentSize = sizes[size];
  const radius = 50 - currentSize.stroke;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (numScore / 100) * circumference;

  return (
    <div className={`relative ${currentSize.wrapper} flex items-center justify-center shrink-0`}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle
          className={bgColor}
          strokeWidth={currentSize.stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={color}
          strokeWidth={currentSize.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className={`font-bold ${color} ${currentSize.text} leading-none`}>
          {numScore}
        </span>
        {size === 'lg' && <span className="text-[10px] text-slate-500 font-medium">Match</span>}
      </div>
    </div>
  );
};

export default MatchScoreCard;
