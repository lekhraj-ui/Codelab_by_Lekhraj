import React, { useEffect, useMemo } from 'react';
import AnimatedCounter from './AnimatedCounter';

export interface BadgeInfo {
  name: string;
  icon: string;
  description: string;
}

export interface AchievementPopupProps {
  badge: BadgeInfo;
  xp?: number;
  onClose: () => void;
}

interface ConfettiItem {
  id: number;
  left: string;
  top: string;
  color: string;
  size: number;
  delay: string;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  badge,
  xp,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const confettiList = useMemo<ConfettiItem[]>(() => {
    const colors = ['#7c3aed', '#2563eb', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 40 + 20}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.floor(Math.random() * 8 + 6),
      delay: `${(Math.random() * 0.4).toFixed(2)}s`,
    }));
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full pointer-events-auto">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        {confettiList.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              top: c.top,
              width: `${c.size}px`,
              height: `${c.size * 1.4}px`,
              backgroundColor: c.color,
              animationDelay: c.delay,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      <div className="achievement-popup glass p-4 rounded-xl shadow-2xl border border-white/20 bg-surface/90 text-on-surface backdrop-blur-md relative overflow-hidden">
        {/* Top subtle highlight gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400" />

        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-purple-500/20 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner flex-shrink-0 animate-[bounce-in_0.6s_ease-out_both]">
            <span>{badge.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono tracking-wider uppercase font-semibold text-purple-400">
                Achievement Unlocked!
              </span>
              <button
                onClick={onClose}
                className="text-on-surface-variant hover:text-on-surface text-xs p-1 rounded transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <h4 className="font-bold text-sm text-on-surface truncate mt-0.5">
              {badge.name}
            </h4>
            <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
              {badge.description}
            </p>

            {xp !== undefined && xp > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="streak-fire">⚡</span>
                  +<AnimatedCounter target={xp} duration={1200} /> XP
                </span>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  Level progress
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Animated XP / progress bar */}
        <div className="mt-3 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
          <div className="xp-bar w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
