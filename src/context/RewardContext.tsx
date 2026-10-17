import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "./AuthContext";

export interface Achievement {
  name: string;
  icon: string;
  description: string;
  xp: number;
}

export interface RewardContextType {
  xp: number;
  level: number;
  rank: string;
  streak: number;
  badges: string[];
  showAchievement: Achievement | null;
  addXP: (amount: number, reason?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  dismissAchievement: () => void;
}

const RewardContext = createContext<RewardContextType | undefined>(undefined);

// Badge meta dictionary for nice popup display if raw string is provided
const BADGE_DETAILS: Record<string, { icon: string; description: string; xp: number }> = {
  "First Blood": { icon: "⚔️", description: "Solved your first problem!", xp: 50 },
  "First Problem": { icon: "🎯", description: "Completed your first challenge!", xp: 50 },
  "Streak Starter": { icon: "🔥", description: "Maintained a 3-day coding streak!", xp: 100 },
  "Week Warrior": { icon: "⚡", description: "Maintained a 7-day coding streak!", xp: 250 },
  "Problem Solver": { icon: "🧩", description: "Solved 10 problems!", xp: 200 },
  "Algorithm Master": { icon: "👑", description: "Solved 50 problems!", xp: 1000 },
  "Century Club": { icon: "💯", description: "Solved 100 problems!", xp: 2500 },
  "Speed Demon": { icon: "🚀", description: "Fastest code submission!", xp: 150 },
  "Bug Hunter": { icon: "🐞", description: "Solved a debug challenge!", xp: 100 },
  "Quiz Whiz": { icon: "🧠", description: "Aced a coding quiz!", xp: 100 },
};

export const RewardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [rank, setRank] = useState<string>("Novice");
  const [streak, setStreak] = useState<number>(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const prevBadgesRef = useRef<string[]>([]);
  const isInitialLoadRef = useRef<boolean>(true);

  const dismissAchievement = useCallback(() => {
    setShowAchievement(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/${user.uid}/profile`);
      const data = response.data?.data || response.data || {};

      const newXp = typeof data.xp === "number" ? data.xp : 0;
      const newLevel = typeof data.level === "number" ? data.level : Math.max(1, Math.floor(Math.sqrt(newXp / 100)) + 1);
      const newRank = data.rank || "Novice";
      const newStreak = typeof data.streak === "number" ? data.streak : 0;
      const newBadges: string[] = Array.isArray(data.badges) ? data.badges : [];

      setXp(newXp);
      setLevel(newLevel);
      setRank(newRank);
      setStreak(newStreak);
      setBadges(newBadges);

      // Detect new badges
      if (!isInitialLoadRef.current) {
        const prev = prevBadgesRef.current;
        const newlyAdded = newBadges.filter((b) => !prev.includes(b));
        if (newlyAdded.length > 0) {
          const firstNew = newlyAdded[0];
          const info = BADGE_DETAILS[firstNew] || { icon: "🏆", description: `Unlocked badge: ${firstNew}`, xp: 100 };
          setShowAchievement({
            name: firstNew,
            icon: info.icon,
            description: info.description,
            xp: info.xp,
          });
        }
      } else {
        isInitialLoadRef.current = false;
      }

      prevBadgesRef.current = newBadges;
    } catch (error) {
      console.warn("Could not fetch user profile for reward context:", error);
    }
  }, [user?.uid]);

  const addXP = useCallback(
    async (amount: number, reason?: string) => {
      if (!user?.uid) return;
      try {
        await axios.post(`${API_BASE_URL}/api/v1/users/${user.uid}/xp`, {
          amount,
          reason: reason || "Problem Solved",
        });
      } catch (error) {
        console.warn("Failed to post XP:", error);
      } finally {
        await refreshProfile();
      }
    },
    [user?.uid, refreshProfile]
  );

  useEffect(() => {
    if (user?.uid) {
      isInitialLoadRef.current = true;
      refreshProfile();
    } else {
      setXp(0);
      setLevel(1);
      setRank("Novice");
      setStreak(0);
      setBadges([]);
      prevBadgesRef.current = [];
    }
  }, [user?.uid, refreshProfile]);

  return (
    <RewardContext.Provider
      value={{
        xp,
        level,
        rank,
        streak,
        badges,
        showAchievement,
        addXP,
        refreshProfile,
        dismissAchievement,
      }}
    >
      {children}
      {/* Achievement Popup Overlay */}
      {showAchievement && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border border-warning/40 bg-base-100/95 p-4 shadow-2xl backdrop-blur-md achievement-popup">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/20 text-3xl">
            {showAchievement.icon || "🏆"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-warning">
                Achievement Unlocked!
              </span>
              <span className="badge badge-warning badge-sm font-semibold">
                +{showAchievement.xp} XP
              </span>
            </div>
            <h4 className="text-base font-bold text-base-content">{showAchievement.name}</h4>
            <p className="text-xs text-base-content/70">{showAchievement.description}</p>
          </div>
          <button
            onClick={dismissAchievement}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </RewardContext.Provider>
  );
};

export const useReward = (): RewardContextType => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error("useReward must be used within a RewardProvider");
  }
  return context;
};

export default RewardContext;
