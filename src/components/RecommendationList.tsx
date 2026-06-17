// src/components/RecommendationList.tsx
import React from 'react';

interface RecommendationListProps {
  items: string[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ items }) => (
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Recomendações</h2>
    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
      {items.map((item, idx) => (
        <li key={idx} style={{ marginBottom: '0.4rem' }}>{item}</li>
      ))}
    </ul>
  </div>
);
