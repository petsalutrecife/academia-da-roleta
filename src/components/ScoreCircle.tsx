// src/components/ScoreCircle.tsx
import React from 'react';

interface ScoreCircleProps {
  percentage: number; // 0-100
  label?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ percentage, label }) => {
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} role="img" aria-label={`Percentual de aproveitamento ${percentage}%`}>
      <circle
        stroke="var(--color-silver-dark)"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{ opacity: 0.3 }}
      />
      <circle
        stroke="var(--color-primary)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{
          strokeDashoffset,
          transition: 'stroke-dashoffset 1s ease-out',
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
        }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="1.2rem"
        fill="var(--color-white)"
        fontFamily="var(--font-title)"
      >
        {percentage}%{label ? ` ${label}` : ''}
      </text>
    </svg>
  );
};
