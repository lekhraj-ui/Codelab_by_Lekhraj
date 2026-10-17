import React from "react";
import { Link } from "react-router-dom";

export interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  topic?: string;
  category?: string;
  type?: "coding" | "mcq" | "debug" | "standard" | string;
}

export interface ProblemCardProps {
  problem: Problem;
  saved?: boolean;
  onToggleSave?: () => void;
  index?: number;
  solved?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  saved,
  onToggleSave,
  index = 0,
  solved = false,
}) => {
  const difficulty = (problem.difficulty || "medium").toLowerCase();
  const difficultyBadge =
    difficulty === "easy"
      ? "badge-success"
      : difficulty === "hard"
      ? "badge-error"
      : "badge-warning";

  // XP reward display ('+50 XP' for easy, '+100 XP' for medium, '+200 XP' for hard)
  const xpReward =
    difficulty === "easy" ? 50 : difficulty === "hard" ? 200 : 100;

  // Topic tag
  const topic = problem.topic || problem.category;

  // Problem type badge (default to 'Coding')
  const problemType = (problem.type || "Coding").toUpperCase();

  // Animation stagger style
  const animationDelay = `${Math.min(index * 60, 600)}ms`;

  return (
    <div
      style={{ animationDelay }}
      className={`card-3d group relative flex flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl animate-fade-up ${
        solved ? "bg-base-100/90" : ""
      }`}
    >
      {/* Solved checkmark banner / overlay badge */}
      {solved && (
        <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-[11px] font-bold text-success-content shadow-sm">
          <span>✓</span>
          <span>SOLVED</span>
        </div>
      )}

      {/* Bookmark button */}
      <button
        type="button"
        aria-label={saved ? "Remove bookmark" : "Save problem"}
        onClick={onToggleSave}
        className={`btn btn-circle btn-ghost btn-xs absolute right-3 top-3 text-base transition-colors ${
          saved ? "text-warning hover:text-warning" : "text-base-content/40 hover:text-base-content"
        }`}
      >
        {saved ? "★" : "☆"}
      </button>

      <div>
        {/* Top Badges: Difficulty, Problem Type, Topic, XP */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 pr-8">
          <span className={`badge ${difficultyBadge} badge-sm font-semibold capitalize`}>
            {problem.difficulty}
          </span>

          <span className="badge badge-ghost badge-sm text-[11px] font-medium opacity-80">
            {problemType}
          </span>

          {topic && (
            <span className="badge badge-outline badge-sm text-[11px] opacity-75">
              {topic}
            </span>
          )}

          <span className="badge badge-warning badge-outline badge-sm text-[11px] font-bold">
            +{xpReward} XP
          </span>
        </div>

        {/* Problem Title */}
        <h2 className="mb-6 min-h-12 text-lg font-bold tracking-tight text-base-content group-hover:text-primary transition-colors line-clamp-2">
          {problem.title}
        </h2>
      </div>

      {/* Action link */}
      <div>
        <Link
          to={`/problem/${problem._id}`}
          className={`btn btn-sm w-full gap-2 transition-all ${
            solved
              ? "btn-outline btn-success hover:btn-success"
              : "btn-primary shadow-sm hover:shadow-md"
          }`}
        >
          <span>{solved ? "Review Solution" : "Solve Challenge"}</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default ProblemCard;
