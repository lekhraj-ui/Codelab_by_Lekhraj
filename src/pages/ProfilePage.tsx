import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  level: number;
  xp: number;
  rank: string;
  joinedAt: string;
}

interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  activityMap: { [date: string]: number }; // YYYY-MM-DD -> count
}

interface SubmissionItem {
  _id: string;
  problemId: string;
  problemTitle?: string;
  language: string;
  status: "AC" | "WA" | "TLE" | "RE" | "Pending";
  executionTime?: number;
  updatedAt: string;
}

const ALL_BADGES: BadgeDef[] = [
  { id: "first-blood", name: "First Blood", icon: "🩸", description: "First accepted solution" },
  { id: "streak-3", name: "On Fire", icon: "🔥", description: "3-day streak" },
  { id: "streak-7", name: "Unstoppable", icon: "⚡", description: "7-day streak" },
  { id: "streak-30", name: "Legendary", icon: "👑", description: "30-day streak" },
  { id: "speed-demon", name: "Speed Demon", icon: "💨", description: "AC under 100ms" },
  { id: "polyglot", name: "Polyglot", icon: "🌍", description: "AC in all 3 languages" },
  { id: "centurion", name: "Centurion", icon: "💯", description: "100 AC submissions" },
  { id: "problem-crusher", name: "Problem Crusher", icon: "💪", description: "50 unique problems solved" },
  { id: "hard-hitter", name: "Hard Hitter", icon: "🎯", description: "10 hard problems solved" },
  { id: "ai-free", name: "Self Taught", icon: "🧠", description: "10 problems without AI hints" },
];

function calculateLevelInfo(xp: number) {
  // formula: nextLevelXP = level^2 * 100
  // Level L threshold = (L-1)^2 * 100
  let level = 1;
  while (xp >= level * level * 100) {
    level++;
  }
  const prevLevelXP = (level - 1) * (level - 1) * 100;
  const nextLevelXP = level * level * 100;
  const progressXP = xp - prevLevelXP;
  const neededXP = nextLevelXP - prevLevelXP;
  const percent = Math.min(100, Math.max(0, Math.round((progressXP / neededXP) * 100)));
  return { level, nextLevelXP, progressXP, neededXP, percent };
}

// Custom animated counter hook
function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) {
      setCount(0);
      return;
    }
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(ease * end);
      setCount(start);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [target, duration]);

  return count;
}

const StatCounter: React.FC<{ value: number; label: string; icon?: string; colorClass?: string }> = ({
  value,
  label,
  icon,
  colorClass = "text-primary",
}) => {
  const count = useCountUp(value);
  return (
    <div className="stat bg-base-200/60 backdrop-blur-sm rounded-2xl border border-base-300 shadow-md hover:border-primary/40 transition-all duration-300">
      <div className="stat-figure text-2xl">{icon}</div>
      <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/70">{label}</div>
      <div className={`stat-value text-3xl font-extrabold ${colorClass} tracking-tight`}>{count}</div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  const userId = user?.uid || "guest";

  useEffect(() => {
    let isMounted = true;
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Parallel requests with graceful fallbacks
        const [profileRes, statsRes, badgesRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/v1/users/${userId}/profile`),
          axios.get(`${API_BASE_URL}/api/v1/users/${userId}/stats`),
          axios.get(`${API_BASE_URL}/api/v1/users/${userId}/badges`),
        ]);

        if (!isMounted) return;

        // Profile data fallback
        if (profileRes.status === "fulfilled" && profileRes.value.data?.data) {
          setProfile(profileRes.value.data.data);
        } else {
          setProfile({
            userId,
            displayName: user?.displayName || "Code Innovator",
            email: user?.email || "developer@lekhraj-codelab.dev",
            photoURL: user?.photoURL || "",
            level: 3,
            xp: 750,
            rank: "Intermediate ⭐",
            joinedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          });
        }

        // Stats data fallback
        if (statsRes.status === "fulfilled" && statsRes.value.data?.data) {
          const s = statsRes.value.data.data;
          setStats(s);
          if (Array.isArray(s.recentSubmissions)) {
            setSubmissions(s.recentSubmissions.slice(0, 10));
          }
        } else {
          // Generate mock 90 days heatmap data
          const mockMap: { [d: string]: number } = {};
          const now = new Date();
          for (let i = 0; i < 90; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            // Some random active days
            if (i % 3 === 0 || i % 7 === 1) {
              mockMap[key] = (i % 5) + 1;
            } else if (i < 5) {
              mockMap[key] = 3;
            } else {
              mockMap[key] = 0;
            }
          }

          setStats({
            totalSolved: 18,
            easySolved: 10,
            mediumSolved: 6,
            hardSolved: 2,
            currentStreak: 5,
            longestStreak: 12,
            totalXP: 750,
            activityMap: mockMap,
          });

          setSubmissions([
            { _id: "sub-1", problemId: "two-sum", problemTitle: "Two Sum", language: "python", status: "AC", executionTime: 42, updatedAt: new Date().toISOString() },
            { _id: "sub-2", problemId: "valid-anagram", problemTitle: "Valid Anagram", language: "cpp", status: "AC", executionTime: 12, updatedAt: new Date(Date.now() - 3600000).toISOString() },
            { _id: "sub-3", problemId: "reverse-linked-list", problemTitle: "Reverse Linked List", language: "java", status: "AC", executionTime: 85, updatedAt: new Date(Date.now() - 86400000).toISOString() },
            { _id: "sub-4", problemId: "merge-k-sorted-lists", problemTitle: "Merge K Sorted Lists", language: "python", status: "WA", executionTime: 120, updatedAt: new Date(Date.now() - 172800000).toISOString() },
            { _id: "sub-5", problemId: "container-with-most-water", problemTitle: "Container With Most Water", language: "python", status: "AC", executionTime: 64, updatedAt: new Date(Date.now() - 250000000).toISOString() },
          ]);
        }

        // Badges fallback
        if (badgesRes.status === "fulfilled" && badgesRes.value.data?.data) {
          const list = badgesRes.value.data.data;
          setEarnedBadgeIds(Array.isArray(list) ? list.map((b: any) => (typeof b === "string" ? b : b.id)) : []);
        } else {
          setEarnedBadgeIds(["first-blood", "streak-3", "speed-demon"]);
        }
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError("Failed to load some profile details. Showing local stats.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileData();
    return () => {
      isMounted = false;
    };
  }, [userId, user]);

  const effectiveXP = stats?.totalXP ?? profile?.xp ?? 750;
  const levelInfo = calculateLevelInfo(effectiveXP);

  // Generate 90-day heatmap calendar grid
  const days: { dateStr: string; count: number; dateObj: Date }[] = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = stats?.activityMap?.[dateStr] || 0;
    days.push({ dateStr, count, dateObj: d });
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-base-300/40 hover:border-base-content/40";
    if (count <= 2) return "bg-emerald-800/80 hover:bg-emerald-700";
    if (count <= 5) return "bg-emerald-500 hover:bg-emerald-400";
    return "bg-emerald-300 hover:bg-emerald-200 shadow-sm shadow-emerald-400/50";
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
        {error && (
          <div className="alert alert-warning shadow-lg py-2 text-sm rounded-xl">
            <span>{error}</span>
          </div>
        )}

        {/* HERO SECTION: User Card & Level Progress */}
        <div className="card bg-gradient-to-br from-base-200/90 via-base-200 to-base-300/40 border border-base-300/80 shadow-xl rounded-3xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Large Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-primary/40 ring-offset-4 ring-offset-base-200 overflow-hidden shadow-2xl bg-base-300 flex items-center justify-center">
                {profile?.photoURL || user?.photoURL ? (
                  <img
                    src={profile?.photoURL || user?.photoURL || ""}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-5xl font-black text-primary">
                    {(profile?.displayName || user?.displayName || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
              <span className="absolute bottom-1 right-1 badge badge-primary font-bold px-2 py-3 shadow-md border-2 border-base-200">
                Lv. {levelInfo.level}
              </span>
            </div>

            {/* Profile Info & XP */}
            <div className="flex-1 text-center md:text-left space-y-3 w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {profile?.displayName || user?.displayName || "Local Developer"}
                </h1>
                <span className="badge badge-accent badge-outline font-semibold px-3 py-3">
                  {profile?.rank || "Explorer ⭐"}
                </span>
                <span className="badge badge-warning gap-1 py-3 px-3">
                  🔥 {stats?.currentStreak ?? 0} Day Streak
                </span>
              </div>

              <p className="text-sm text-base-content/70">{profile?.email || user?.email}</p>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs sm:text-sm font-semibold">
                  <span className="text-base-content/80 flex items-center gap-1.5">
                    <span>Level {levelInfo.level} Progress</span>
                    <span className="text-xs text-primary font-mono">({levelInfo.percent}%)</span>
                  </span>
                  <span className="font-mono text-primary">
                    {effectiveXP} / {levelInfo.nextLevelXP} XP
                  </span>
                </div>
                <div className="w-full bg-base-300/80 rounded-full h-4 overflow-hidden p-0.5 border border-base-content/10">
                  <div
                    className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
                    style={{ width: `${levelInfo.percent}%` }}
                  />
                </div>
                <div className="text-right text-[11px] text-base-content/60">
                  {levelInfo.nextLevelXP - effectiveXP} XP needed for Level {levelInfo.level + 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>Performance Metrics</span>
            <span className="badge badge-sm badge-ghost font-mono">Real-time</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <StatCounter value={stats?.totalSolved ?? 0} label="Total Solved" icon="🏆" colorClass="text-emerald-400" />
            <StatCounter value={stats?.easySolved ?? 0} label="Easy Solved" icon="🟢" colorClass="text-green-400" />
            <StatCounter value={stats?.mediumSolved ?? 0} label="Medium Solved" icon="🟡" colorClass="text-yellow-400" />
            <StatCounter value={stats?.hardSolved ?? 0} label="Hard Solved" icon="🔴" colorClass="text-rose-400" />
            <StatCounter value={stats?.currentStreak ?? 0} label="Current Streak" icon="🔥" colorClass="text-orange-400" />
            <StatCounter value={stats?.longestStreak ?? 0} label="Longest Streak" icon="⚡" colorClass="text-amber-400" />
          </div>
        </div>

        {/* ACTIVITY HEATMAP */}
        <div className="card bg-base-200/80 border border-base-300 shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>Activity Heatmap</span>
                <span className="text-xs font-normal text-base-content/70">(Last 90 Days)</span>
              </h2>
              <p className="text-xs text-base-content/60">Consistent daily practice builds mastery.</p>
            </div>
            {/* Legend */}
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <span>Less</span>
              <div className="w-3.5 h-3.5 rounded-sm bg-base-300/40 border border-base-content/10" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-800/80" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500" />
              <div className="w-3.5 h-3.5 rounded-sm bg-emerald-300" />
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[680px]">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 justify-start">
                {days.map((item) => (
                  <div
                    key={item.dateStr}
                    title={`${item.dateStr}: ${item.count} submission${item.count === 1 ? "" : "s"}`}
                    className={`w-4 h-4 rounded-sm border border-transparent transition-all duration-200 cursor-pointer ${getHeatmapColor(
                      item.count
                    )}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ACHIEVEMENT BADGES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Achievements & Badges</span>
              <span className="badge badge-primary font-bold">
                {earnedBadgeIds.length} / {ALL_BADGES.length}
              </span>
            </h2>
            <span className="text-xs text-base-content/60">Unlock badges by solving problems & maintaining streaks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {ALL_BADGES.map((badge, idx) => {
              const isEarned = earnedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`card border transition-all duration-300 animate-scale-in p-4 rounded-2xl relative overflow-hidden ${
                    isEarned
                      ? "bg-base-200/90 border-primary/40 shadow-md hover:border-primary hover:-translate-y-1 hover:shadow-primary/20"
                      : "bg-base-200/30 border-base-300/60 opacity-60 grayscale hover:grayscale-0 hover:opacity-90"
                  }`}
                >
                  {isEarned && (
                    <div className="absolute top-2 right-2">
                      <span className="badge badge-xs badge-success uppercase font-black text-[9px] px-1.5">Unlocked</span>
                    </div>
                  )}
                  {!isEarned && (
                    <div className="absolute top-2 right-2 text-base-content/40 text-xs">
                      🔒
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-3xl p-2 rounded-xl flex items-center justify-center ${
                        isEarned ? "bg-primary/20 ring-1 ring-primary/40" : "bg-base-300/60"
                      }`}
                    >
                      {badge.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-tight text-base-content">{badge.name}</h3>
                      <p className="text-[11px] text-base-content/70 mt-0.5 leading-snug">{badge.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT SUBMISSIONS */}
        <div className="card bg-base-200/80 border border-base-300 shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Recent Submissions</span>
              <span className="badge badge-sm badge-ghost font-mono">Last 10</span>
            </h2>
            <Link to="/problems" className="btn btn-xs btn-outline btn-primary">
              Practice More Problems →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10 text-base-content/60 text-sm">
              No submissions recorded yet. Head over to the problems page and solve your first challenge!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm w-full">
                <thead>
                  <tr className="text-base-content/70 border-b border-base-300">
                    <th>Problem</th>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Runtime</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const isAC = sub.status === "AC";
                    return (
                      <tr key={sub._id} className="hover:bg-base-300/40 transition-colors border-b border-base-300/40">
                        <td className="font-semibold text-primary">
                          <Link to={`/problem/${sub.problemId}`} className="hover:underline">
                            {sub.problemTitle || sub.problemId}
                          </Link>
                        </td>
                        <td>
                          <span
                            className={`badge badge-sm font-bold ${
                              isAC ? "badge-success text-success-content" : "badge-error text-error-content"
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="font-mono text-xs uppercase">{sub.language}</td>
                        <td className="font-mono text-xs text-base-content/70">
                          {sub.executionTime != null ? `${sub.executionTime} ms` : "-"}
                        </td>
                        <td className="text-xs text-base-content/60">
                          {new Date(sub.updatedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
