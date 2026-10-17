import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface DailyProblemData {
  _id: string;
  title: string;
  difficulty: string;
  topic?: string;
  category?: string;
}

interface Props {
  compact?: boolean;
}

const DailyProblem: React.FC<Props> = ({ compact = false }) => {
  const [problem, setProblem] = useState<DailyProblemData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchDailyProblem = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/v1/daily-problem`);
        const data = res.data?.data || res.data;
        if (isMounted) {
          if (data && (data._id || data.id)) {
            setProblem({
              _id: data._id || data.id,
              title: data.title || "Daily Coding Challenge",
              difficulty: data.difficulty || "Medium",
              topic: data.topic || data.category || "Algorithms",
            });
          } else {
            // Fallback problem if none returned
            setProblem({
              _id: "daily-1",
              title: "Reverse Integer",
              difficulty: "Easy",
              topic: "Math & Strings",
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch daily problem, using fallback:", err);
        if (isMounted) {
          setProblem({
            _id: "daily-1",
            title: "Two Sum",
            difficulty: "Easy",
            topic: "Arrays & Hashing",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDailyProblem();
    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown timer to midnight UTC
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextMidnightUTC = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          0,
          0,
          0
        )
      );
      const diffMs = nextMidnightUTC.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const difficultyLower = (problem?.difficulty || "medium").toLowerCase();
  const difficultyBadge =
    difficultyLower === "easy"
      ? "badge-success"
      : difficultyLower === "hard"
      ? "badge-error"
      : "badge-warning";

  if (loading) {
    return (
      <div className={`p-4 rounded-2xl bg-base-100 border border-base-300 animate-pulse ${compact ? "w-64" : "w-full"}`}>
        <div className="h-4 bg-base-300 rounded w-1/3 mb-2"></div>
        <div className="h-5 bg-base-300 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-base-300 rounded w-full"></div>
      </div>
    );
  }

  if (error || !problem) {
    return null;
  }

  if (compact) {
    return (
      <div className="w-72 p-4 rounded-xl bg-base-100 border-2 border-primary/40 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-50 pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <span>⚡</span> Daily Challenge
          </span>
          <span className="font-mono text-xs text-base-content/70 bg-base-200 px-2 py-0.5 rounded">
            ⏳ {timeLeft}
          </span>
        </div>
        <h4 className="font-bold text-sm text-base-content truncate mb-1" title={problem.title}>
          {problem.title}
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${difficultyBadge} badge-xs uppercase font-semibold`}>
            {problem.difficulty}
          </span>
          {problem.topic && (
            <span className="text-[11px] text-base-content/60 truncate">
              {problem.topic}
            </span>
          )}
        </div>
        <Link
          to={`/problem/${problem._id}`}
          className="btn btn-primary btn-xs w-full shadow-md"
        >
          Solve Now →
        </Link>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border-2 border-primary/50 bg-base-100/80 backdrop-blur-md p-6 shadow-xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
      {/* Glowing border effect animation */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-20 -z-10 animate-pulse pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-lg">
            ⭐
          </span>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Problem of the Day
            </h3>
            <p className="text-xs text-base-content/60">
              Refresh your streak and claim bonus +100 XP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-200/80 border border-base-300/80 font-mono text-xs font-medium">
          <span className="opacity-70">Resets in:</span>
          <span className="text-warning font-bold">{timeLeft}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${difficultyBadge} font-bold`}>
              {problem.difficulty}
            </span>
            {problem.topic && (
              <span className="badge badge-outline text-xs">
                {problem.topic}
              </span>
            )}
            <span className="badge badge-warning badge-sm font-semibold">
              +100 XP Bonus
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-base-content pt-1">
            {problem.title}
          </h2>
        </div>

        <div>
          <Link
            to={`/problem/${problem._id}`}
            className="btn btn-primary px-6 shadow-lg shadow-primary/20 group"
          >
            Solve Now <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DailyProblem;
