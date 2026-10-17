import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import XPBar from "./XPBar";
import StreakTracker from "./StreakTracker";
import DailyProblem from "./DailyProblem";
import { useReward } from "../context/RewardContext";

// Safe wrapper so if RewardContext is ever missing, it doesn't crash the whole navbar
const SafeRewardWidgets: React.FC = () => {
  try {
    const reward = useReward();
    if (!reward) return null;
    return (
      <div className="flex items-center gap-2">
        <XPBar />
        <StreakTracker />
      </div>
    );
  } catch (err) {
    return null;
  }
};

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const route = window.location.pathname.split("/")[1];

  return (
    <div className="navbar sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-300/80 px-3 md:px-6 shadow-sm transition-all">
      {/* Navbar Start: Drawer toggle and Safe XP widgets */}
      <div className="navbar-start flex items-center gap-3">
        {route !== "problems" && (
          <div className="dropdown">
            <label htmlFor="my-drawer" aria-label="Toggle drawer">
              <div role="button" className="btn btn-ghost btn-circle btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
            </label>
          </div>
        )}

        {/* Brand / Logo */}
        <Link to="/" className="btn btn-ghost normal-case text-lg md:text-xl font-bold tracking-tight px-2">
          <span className="text-primary font-mono">&lt;/&gt;</span>
          <span className="bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text">
            CodeLab
          </span>
        </Link>

        {/* XPBar and StreakTracker on the left side after logo */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-base-300/60">
          <SafeRewardWidgets />
        </div>
      </div>

      {/* Navbar Center: centered on large screens if desired */}
      <div className="navbar-center hidden sm:flex lg:hidden">
        <SafeRewardWidgets />
      </div>

      {/* Navbar End: Daily problem dropdown and User menu */}
      <div className="navbar-end flex items-center gap-2 md:gap-3">
        {/* Daily Problem Dropdown */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle btn-sm relative"
            title="Problem of the Day"
            aria-label="Daily Problem"
          >
            <span className="text-base">⭐</span>
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
            </span>
          </div>
          <div
            tabIndex={0}
            className="dropdown-content z-50 mt-3 p-1 shadow-2xl bg-base-100 rounded-2xl border border-base-300"
          >
            <DailyProblem compact={true} />
          </div>
        </div>

        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar border border-base-300/80 hover:border-primary transition"
              title={user.displayName || user.email || "User profile"}
            >
              <div className="w-9 rounded-full ring-1 ring-primary/30">
                <img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="profile"
                  referrerPolicy="no-referrer"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-2xl bg-base-100 border border-base-300 rounded-2xl w-60 space-y-1"
            >
              {/* User summary header */}
              <li className="menu-title px-3 py-1.5 border-b border-base-200 mb-1">
                <Link to="/profile" className="flex flex-col items-start gap-0 p-0 hover:bg-transparent">
                  <span className="font-bold text-sm text-base-content truncate max-w-[190px]">
                    {user.displayName || "Developer"}
                  </span>
                  <span className="text-xs text-base-content/60 truncate max-w-[190px]">
                    {user.email}
                  </span>
                </Link>
              </li>

              {/* Navigation items requested */}
              <li>
                <Link to="/profile" className="justify-between py-2">
                  <span>Profile</span>
                  <span className="badge badge-primary badge-xs">New</span>
                </Link>
              </li>
              <li>
                <Link to="/problems" className="py-2">
                  Problems
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="py-2">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/playground" className="py-2">
                  Playground
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="py-2">
                  Quiz
                </Link>
              </li>
              <li>
                <Link to="/daily-challenge" className="py-2">
                  Daily Challenge
                </Link>
              </li>

              {user.email === "admin@example.com" && (
                <li>
                  <Link to="/addProblem" className="py-2 text-warning">
                    Add Problem
                  </Link>
                </li>
              )}

              <div className="divider my-1"></div>

              <li>
                <button
                  onClick={handleLogout}
                  className="py-2 text-error hover:bg-error/10 hover:text-error"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm px-4">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
