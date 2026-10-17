import React, { useMemo } from 'react';

const SYMBOLS = ['{', '}', '<', '>', '/', '*', '=', '(', ')', '[', ']', ';', ':', '#', '@', '&', '|', '!', '?', '+', '-'];

interface ParticleConfig {
  id: number;
  symbol: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
  opacity: number;
}

export const ParticleBackground: React.FC = () => {
  const particles = useMemo<ParticleConfig[]>(() => {
    const count = 28;
    return Array.from({ length: count }, (_, i) => {
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const left = `${(Math.random() * 96 + 2).toFixed(1)}%`;
      const duration = `${(10 + Math.random() * 15).toFixed(1)}s`;
      const delay = `${(Math.random() * 15).toFixed(1)}s`;
      const size = `${Math.floor(22 + Math.random() * 26)}px`;
      const opacity = parseFloat((0.04 + Math.random() * 0.04).toFixed(3));
      return { id: i, symbol, left, duration, delay, size, opacity };
    });
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={
            {
              '--x': p.left,
              '--duration': p.duration,
              '--delay': p.delay,
              '--size': p.size,
              opacity: p.opacity,
            } as React.CSSProperties
          }
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
};

export default ParticleBackground;
