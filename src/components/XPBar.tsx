import React from "react";
import { useReward } from "../context/RewardContext";

// Simple rank icons based on rank name or tier
const getRankIcon = (rank: string) => {
  const r = (rank || "").toLowerCase();
  if (r.includes("grandmaster") || r.includes("legend")) return "👑";
  if (r.includes("master")) return "💎";
  if (r.includes("expert") || r.includes("diamond")) return "⭐";
  if (r.includes("advanced") || r.includes("gold")) return "🥇";
  if (r.includes("intermediate") || r.includes("silver")) return "🥈";
  if (r.includes("bronze")) return "🥉";
  return "🌱";
};

const XPBar: React.FC = () => {
  const { xp, level, rank } = useReward();

  // Calculations:
  // currentLevelXP = (level - 1)^2 * 100
  // nextLevelXP = level^2 * 100
  // progress = (xp - currentLevelXP) / (nextLevelXP - currentLevelXP)
  const currentLevelXP = Math.pow(Math.max(1, level) - 1, 2) * 100;
  const nextLevelXP = Math.pow(Math.max(1, level), 2) * 100;
  const denominator = nextLevelXP - currentLevelXP || 1;
  const progressRatio = Math.max(0, Math.min(1, (xp - currentLevelXP) / denominator));
  const progressPercent = Math.round(progressRatio * 100);

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded-full bg-base-200/60 border border-base-300/60 text-xs select-none"
      title={`Level ${level} (${rank}) - ${xp} XP. Next level at ${nextLevelXP} XP (${progressPercent}%)`}
    >
      {/* Level badge: small circle badge */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-primary-content shadow-sm text-[11px]">
        {level}
      </div>

      {/* Progress Bar Container: ~150px wide, 6px tall, gradient fill with animated change */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[10px] text-base-content/70 px-0.5">
          <span className="font-semibold flex items-center gap-1">
            <span>{getRankIcon(rank)}</span>
            <span>{rank}</span>
          </span>
          <span className="font-mono">{progressPercent}%</span>
        </div>
        <div className="w-[150px] h-[6px] rounded-full bg-base-300/80 overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default XPBar;
