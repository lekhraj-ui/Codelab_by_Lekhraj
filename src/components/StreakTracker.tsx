import React from "react";
import { useReward } from "../context/RewardContext";

const StreakTracker: React.FC = () => {
  const { streak } = useReward();

  const isFrozen = streak === 0;
  const isHot = streak >= 3;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-base-200/60 border border-base-300/60 text-xs font-semibold select-none cursor-default"
      title={isFrozen ? "No streak yet. Solve a problem today!" : `${streak} day streak! Keep it going!`}
    >
      <span
        className={`text-sm select-none ${isHot ? "streak-fire animate-streak-fire" : ""}`}
        role="img"
        aria-label={isFrozen ? "Snowflake" : "Fire"}
      >
        {isFrozen ? "❄️" : "🔥"}
      </span>
      <span className={isFrozen ? "text-base-content/60" : "text-amber-500 font-bold"}>
        {streak}
      </span>
    </div>
  );
};

export default StreakTracker;
