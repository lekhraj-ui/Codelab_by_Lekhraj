/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface DailyProblem {
  _id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";
  description?: string;
  topic?: string;
  pattern?: string;
  xpReward?: number;
  solvedToday?: boolean;
}

const MOTIVATIONAL_QUOTES = [
  "\"Small daily improvements over time lead to stunning algorithmic mastery.\"",
  "\"The secret of getting ahead is getting started — one problem every day.\"",
  "\"Consistency isn't about perfection; it's about refusing to give up.\"",
  "\"A complex problem is merely a series of simple questions waiting to be solved.\"",
  "\"Every line of code you write today strengthens your computational intuition.\"",
  "\"Mastery is not an accident; it is the compound interest of daily practice.\"",
  "\"Your future self will thank you for the code you write today.\"",
];

function getDailyQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

const STREAK_REWARDS = [
  { days: 3, label: "3-Day Streak", badge: "🔥 On Fire badge", xp: "+150 XP" },
  { days: 7, label: "7-Day Streak", badge: "⚡ Unstoppable", xp: "+500 XP" },
  { days: 30, label: "30-Day Streak", badge: "👑 Legendary", xp: "+2,500 XP" },
];

const DailyChallengePage: React.FC = () => {
  const { user } = useAuth();
  const [problem, setProblem] = useState<DailyProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState<number>(5);
  const [solvedDates, setSolvedDates] = useState<number[]>([1, 2, 4, 7, 8, 9, 10]); // Day numbers of current month
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate countdown to midnight UTC
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnightUTC = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
      );
      const diffMs = Math.max(0, nextMidnightUTC.getTime() - now.getTime());

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch daily problem & user streak
  useEffect(() => {
    let mounted = true;
    const fetchDailyChallenge = async () => {
      setLoading(true);
      try {
        const [dailyRes, statsRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/v1/daily-problem`, { timeout: 4000 }),
          axios.get(`${API_BASE_URL}/api/v1/users/${user?.uid || "guest"}/stats`, { timeout: 4000 }),
        ]);

        if (!mounted) return;

        if (dailyRes.status === "fulfilled" && dailyRes.value.data?.data) {
          setProblem(dailyRes.value.data.data);
        } else {
          // Fallback to first available problem or mock daily challenge
          try {
            const probListRes = await axios.get(`${API_BASE_URL}/api/v1/problems`);
            const pList = probListRes.data?.data;
            if (Array.isArray(pList) && pList.length > 0) {
              const dayIndex = new Date().getDate() % pList.length;
              setProblem(pList[dayIndex]);
            } else {
              setProblem({
                _id: "two-sum",
                title: "Two Sum",
                difficulty: "Easy",
                topic: "Arrays & Hash Table",
                pattern: "Hash Map Lookup",
                xpReward: 50,
              });
            }
          } catch {
            setProblem({
              _id: "two-sum",
              title: "Two Sum",
              difficulty: "Easy",
              topic: "Arrays & Hash Table",
              pattern: "Hash Map Lookup",
              xpReward: 50,
            });
          }
        }

        if (statsRes.status === "fulfilled" && statsRes.value.data?.data) {
          const s = statsRes.value.data.data;
          setStreak(s.currentStreak || 5);
          if (s.activityMap) {
            const currMonthStr = new Date().toISOString().slice(0, 7);
            const activeDays = Object.keys(s.activityMap)
              .filter((dateStr) => dateStr.startsWith(currMonthStr) && s.activityMap[dateStr] > 0)
              .map((dateStr) => parseInt(dateStr.slice(8, 10), 10));
            if (activeDays.length > 0) setSolvedDates(activeDays);
          }
        }
      } catch (err) {
        console.warn("Daily challenge fetch failed, showing fallback:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDailyChallenge();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Calendar generation for current month
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const monthName = today.toLocaleString("default", { month: "long" });

  const getDifficultyBadge = (diff?: string) => {
    const d = (diff || "medium").toLowerCase();
    if (d === "hard") return <span className="badge badge-error font-bold">Hard 🔴</span>;
    if (d === "medium") return <span className="badge badge-warning font-bold">Medium 🟡</span>;
    return <span className="badge badge-success font-bold">Easy 🟢</span>;
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-up">
        {/* HEADER & MOTIVATIONAL QUOTE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-bold uppercase tracking-wider mb-1">
            <span>Daily Discipline</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-3">
            <span>Daily Challenge</span>
            <span className="text-4xl animate-bounce">⚡</span>
          </h1>
          <p className="text-sm sm:text-base italic text-base-content/70 max-w-2xl mx-auto">
            {getDailyQuote()}
          </p>
        </div>

        {/* HERO SECTION: TODAY'S CHALLENGE + COUNTDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Problem Card (8 cols) */}
          <div className="lg:col-span-8 card bg-gradient-to-br from-base-200 via-base-200/90 to-base-300/40 border border-base-300 shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary font-bold uppercase text-xs tracking-wider px-3 py-2.5">
                    Today's Problem
                  </span>
                  {getDifficultyBadge(problem?.difficulty)}
                </div>
                <div className="text-xs font-mono font-bold text-accent flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>+{problem?.xpReward || 50} Bonus XP</span>
                </div>
              </div>

              {loading ? (
                <div className="py-12 flex justify-center">
                  <span className="loading loading-spinner loading-lg text-primary" />
                </div>
              ) : (
                <div className="space-y-4 my-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                    {problem?.title || "Algorithmic Challenge"}
                  </h2>
                  <p className="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
                    Solve today's featured problem to extend your streak and earn badge progress. Solve before the UTC midnight reset!
                  </p>
                  {problem?.topic && (
                    <div className="flex items-center gap-2 text-xs text-base-content/60 font-mono">
                      <span>Category: {problem.topic}</span>
                      {problem.pattern && <span>• Pattern: {problem.pattern}</span>}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-base-300 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-base-content/60">
                Resets daily at <strong>00:00 UTC</strong>
              </div>
              <Link
                to={`/problem/${problem?._id || "two-sum"}`}
                className="btn btn-primary btn-md rounded-2xl shadow-lg gap-2 font-bold px-8 hover:scale-105 transition-transform"
              >
                <span>Solve Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* COUNTDOWN & CURRENT STREAK (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            {/* Countdown Timer */}
            <div className="card bg-base-200/90 border border-base-300 shadow-xl rounded-3xl p-6 text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                Time Remaining
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                <div className="bg-base-300/80 rounded-2xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-mono font-black text-primary">
                    {pad(timeLeft.hours)}
                  </div>
                  <div className="text-[10px] text-base-content/60 uppercase font-semibold">Hours</div>
                </div>
                <div className="bg-base-300/80 rounded-2xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-mono font-black text-primary">
                    {pad(timeLeft.minutes)}
                  </div>
                  <div className="text-[10px] text-base-content/60 uppercase font-semibold">Mins</div>
                </div>
                <div className="bg-base-300/80 rounded-2xl p-2.5">
                  <div className="text-2xl sm:text-3xl font-mono font-black text-primary">
                    {pad(timeLeft.seconds)}
                  </div>
                  <div className="text-[10px] text-base-content/60 uppercase font-semibold">Secs</div>
                </div>
              </div>
              <p className="text-[11px] text-base-content/50">Countdown to next challenge reset</p>
            </div>

            {/* Streak Counter */}
            <div className="card bg-gradient-to-br from-orange-950/30 to-base-200 border border-orange-500/30 shadow-xl rounded-3xl p-6 text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl animate-bounce">🔥</span>
                <span className="text-4xl font-black font-mono text-orange-400">{streak}</span>
              </div>
              <h3 className="font-bold text-sm text-base-content">Active Streak Days</h3>
              <p className="text-xs text-base-content/70">Solve today's problem to reach {streak + 1} days!</p>
            </div>
          </div>
        </div>

        {/* STREAK REWARDS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Streak Milestones & Rewards</span>
              <span className="badge badge-sm badge-outline">Unlockable</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STREAK_REWARDS.map((reward) => {
              const isUnlocked = streak >= reward.days;
              return (
                <div
                  key={reward.days}
                  className={`card p-5 rounded-2xl border transition-all duration-300 ${
                    isUnlocked
                      ? "bg-base-200/90 border-warning/40 shadow-lg shadow-warning/5"
                      : "bg-base-200/40 border-base-300/60 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-base-content/60 uppercase">{reward.label}</div>
                      <div className="text-lg font-extrabold mt-1 text-base-content">{reward.badge}</div>
                    </div>
                    <span className="badge badge-warning badge-sm font-mono font-bold">{reward.xp}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-base-content/10 flex items-center justify-between text-xs">
                    <span className="text-base-content/70">Progress</span>
                    <span className="font-mono font-bold text-primary">
                      {Math.min(streak, reward.days)} / {reward.days} Days
                    </span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2 mt-1.5 overflow-hidden">
                    <div
                      className="bg-warning h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (streak / reward.days) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CALENDAR VIEW OF THE MONTH */}
        <div className="card bg-base-200/90 border border-base-300 shadow-xl rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>{monthName} {currentYear}</span>
                <span className="text-xs font-normal text-base-content/60">Challenge History</span>
              </h2>
              <p className="text-xs text-base-content/60">
                Green dots indicate days on which you solved the daily coding problem.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Solved</span>
              <span className="w-2.5 h-2.5 rounded-full bg-base-300 ml-2" />
              <span>Unsolved</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="max-w-2xl mx-auto">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-base-content/50 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty offset spaces */}
              {[...Array(firstDayOfWeek)].map((_, i) => (
                <div key={`offset-${i}`} className="h-12 rounded-xl bg-transparent" />
              ))}

              {/* Day cells */}
              {[...Array(daysInMonth)].map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === currentDay;
                const isSolved = solvedDates.includes(dayNum);

                return (
                  <div
                    key={dayNum}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center p-1 relative border transition-all duration-200 ${
                      isToday
                        ? "border-primary ring-2 ring-primary/40 bg-primary/10 font-bold"
                        : "border-base-300/40 bg-base-100/50 hover:bg-base-300/40"
                    }`}
                  >
                    <span className={`text-xs ${isToday ? "text-primary font-bold" : "text-base-content/80"}`}>
                      {dayNum}
                    </span>
                    {isSolved && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shadow-sm shadow-emerald-400/50 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyChallengePage;
