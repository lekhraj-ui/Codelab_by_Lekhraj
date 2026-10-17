import { useEffect, useState } from "react";
import {
  HiArrowRight,
  HiBolt,
  HiClock,
  HiCodeBracket,
  HiMoon,
  HiPlay,
  HiSparkles,
  HiSun,
  HiTrophy,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

import AnimatedCounter from "../components/AnimatedCounter";
import LandingEditorPreview from "../components/LandingEditorPreview";
import CosmicSwarmBackground from "../components/CosmicSwarmBackground";
import TypingAnimation from "../components/TypingAnimation";
import { useAuth } from "../context/AuthContext";

const THEME_KEY = "lekhraj-codelab-landing-theme";
const GITHUB_URL = "https://github.com/lekhraj102/Lekhraj CodeLabBackend";

const TOP_USERS = [
  { rank: 1, name: "alex_coder", xp: 14850, solved: 432, streak: 45, badge: "Master" },
  { rank: 2, name: "dev_priya", xp: 13200, solved: 389, streak: 32, badge: "Grandmaster" },
  { rank: 3, name: "marcus_k", xp: 11950, solved: 341, streak: 28, badge: "Expert" },
  { rank: 4, name: "sophia_tech", xp: 10420, solved: 310, streak: 19, badge: "Expert" },
  { rank: 5, name: "lekhraj_ai", xp: 9860, solved: 295, streak: 21, badge: "Pro" },
];

const ACHIEVEMENTS = [
  {
    icon: "🔥",
    name: "Streak Master",
    desc: "Solve daily problems for 30 consecutive days",
    tier: "Epic",
    xp: 500,
  },
  {
    icon: "⚡",
    name: "Speed Demon",
    desc: "Pass all hidden test suites within 60 seconds",
    tier: "Legendary",
    xp: 750,
  },
  {
    icon: "🎯",
    name: "Bug Hunter",
    desc: "Resolve 50 debugging and edge-case challenges",
    tier: "Rare",
    xp: 350,
  },
  {
    icon: "🏆",
    name: "Algorithm Knight",
    desc: "Conquer 25 hard graph & dynamic programming problems",
    tier: "Legendary",
    xp: 1000,
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const startPath = user ? "/problems" : "/login";
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark") {
      setIsDark(true);
      return;
    }
    if (stored === "light") {
      setIsDark(false);
      return;
    }
    setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  // Scroll reveal observer
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => {
      reveals.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`landing font-body-md text-on-surface min-h-screen relative overflow-hidden ${
        isDark ? "dark" : ""
      }`}
    >
      {/* Background Floating Particles */}
      <CosmicSwarmBackground isDark={isDark} />

      {/* Ambient Glowing Gradient Orbs */}
      <div className="glow-orb glow-orb-1" aria-hidden="true" />
      <div className="glow-orb glow-orb-2" aria-hidden="true" />
      <div className="glow-orb glow-orb-3" aria-hidden="true" />

      {/* Navigation Header */}
      <header className="bg-surface/80 backdrop-blur-md w-full sticky top-0 z-50 border-b border-outline-variant">
        <div className="flex justify-between items-center h-16 px-gutter max-w-[1280px] mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 font-display-lg text-headline-sm font-bold text-primary group"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              <HiCodeBracket className="w-5 h-5" />
            </span>
            <span className="tracking-tight">Lekhraj CodeLab</span>
          </Link>

          <div className="flex items-center space-x-md">
            <Link
              to="/playground"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-ui-label text-on-surface-variant hover:text-primary px-3 py-1.5 rounded transition-colors"
            >
              <HiPlay className="w-3.5 h-3.5 text-emerald-500" />
              Playground
            </Link>
            <Link
              to="/problems"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-ui-label text-on-surface-variant hover:text-primary px-3 py-1.5 rounded transition-colors"
            >
              Problems
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              className="p-sm text-on-surface-variant hover:text-primary transition-colors duration-100 active:scale-95 rounded-lg hover:bg-surface-container"
            >
              {isDark ? (
                <HiSun className="w-5 h-5 text-amber-400" aria-hidden />
              ) : (
                <HiMoon className="w-5 h-5" aria-hidden />
              )}
            </button>

            <Link
              to={startPath}
              className="bg-primary text-on-primary px-lg py-sm font-ui-label text-ui-label transition-all duration-200 active:scale-95 hover:opacity-90 shadow-sm rounded flex items-center gap-1"
            >
              <span>{user ? "See Problems" : "Get Started"}</span>
              <HiArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-xxl pb-xxl overflow-hidden border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-gutter relative z-10 text-center">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border border-outline-variant bg-surface-container-low/80 backdrop-blur mb-6 animate-fade-up">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-on-surface-variant">Lekhraj CodeLab 2.0 is live</span>
              <span className="text-primary font-semibold">Explore New Features →</span>
            </div>

            <div className="flex flex-col items-center space-y-lg">
              <h1 className="font-display-lg text-4xl sm:text-6xl md:text-[76px] leading-[1.08] max-w-4xl tracking-tight animate-fade-up min-h-[1.2em]">
                <TypingAnimation
                  texts={[
                    "Master your coding skills.",
                    "Level up every day.",
                    "Earn rewards as you code.",
                    "Challenge yourself daily.",
                  ]}
                  speed={75}
                  deleteSpeed={35}
                  pauseTime={2000}
                  className="gradient-text font-extrabold"
                />
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto animate-fade-up-delay leading-relaxed">
                Curated problems, an in-browser editor with multi-language execution,
                and real-time automated tests — engineered for technical interview mastery.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-up-delay-2">
                <Link
                  to={startPath}
                  className="bg-primary text-on-primary px-xxl py-3 rounded font-ui-label text-ui-label font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 hover:opacity-90 inline-flex items-center gap-2"
                >
                  <HiBolt className="w-4 h-4 text-amber-300" />
                  <span>Start Solving Free</span>
                </Link>
                <Link
                  to="/playground"
                  className="glass px-xl py-3 rounded font-ui-label text-ui-label text-on-surface hover:bg-surface-container transition-all duration-200 inline-flex items-center gap-2 border border-outline-variant"
                >
                  <HiPlay className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Playground</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive 3D Editor Preview */}
          <div className="mt-xxl max-w-[1100px] mx-auto px-gutter md:px-0 animate-fade-up-delay-2">
            <div className="card-3d border border-outline-variant p-sm bg-surface-container-low shadow-2xl rounded-xl overflow-hidden">
              <LandingEditorPreview />
            </div>
          </div>
        </section>

        {/* Stats Section with Animated Counters */}
        <section className="reveal border-b border-outline-variant bg-surface-container-lowest/60 backdrop-blur-sm py-12">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/40">
              <div className="p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display-lg text-primary tracking-tight">
                  <AnimatedCounter target={500} suffix="+" duration={1800} />
                </div>
                <div className="text-xs sm:text-sm font-ui-label text-on-surface-variant uppercase tracking-wider mt-1.5">
                  Problems
                </div>
              </div>

              <div className="p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display-lg text-primary tracking-tight">
                  <AnimatedCounter target={10} suffix="K+" duration={2000} />
                </div>
                <div className="text-xs sm:text-sm font-ui-label text-on-surface-variant uppercase tracking-wider mt-1.5">
                  Submissions
                </div>
              </div>

              <div className="p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display-lg text-primary tracking-tight">
                  <AnimatedCounter target={50} suffix="+" duration={1600} />
                </div>
                <div className="text-xs sm:text-sm font-ui-label text-on-surface-variant uppercase tracking-wider mt-1.5">
                  Topics
                </div>
              </div>

              <div className="p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display-lg text-primary tracking-tight">
                  <AnimatedCounter target={3} suffix=" Languages" duration={1200} />
                </div>
                <div className="text-xs sm:text-sm font-ui-label text-on-surface-variant uppercase tracking-wider mt-1.5">
                  Python, Java, C++
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Challenge Spotlight */}
        <section className="reveal py-xxl border-b border-outline-variant relative">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-2xl border border-outline-variant bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-low shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <span className="streak-fire text-base">🔥</span>
                  <span>PROBLEM OF THE DAY</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-display-lg font-bold text-on-surface">
                  Trapping Rain Water II
                </h3>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                  Given an <code>m x n</code> integer matrix representing the elevation of each unit cell in a 2D elevation map, calculate the volume of water it can trap after raining.
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="px-3 py-0.5 rounded text-xs font-code-block font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/30">
                    Hard
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-surface-container-high text-on-surface-variant border border-outline-variant">
                    Breadth-First Search
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-surface-container-high text-on-surface-variant border border-outline-variant">
                    Heap / Priority Queue
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold ml-1">
                    <HiBolt className="w-3.5 h-3.5" /> +150 XP Bonus
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-4 w-full md:w-auto relative z-10">
                <div className="glass px-4 py-2.5 rounded-xl border border-outline-variant flex items-center gap-3">
                  <HiClock className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                      Resets In
                    </div>
                    <div className="font-mono text-sm font-bold text-on-surface">
                      08h 42m 15s
                    </div>
                  </div>
                </div>

                <Link
                  to={startPath}
                  className="w-full sm:w-auto text-center bg-primary text-on-primary px-8 py-3 rounded font-ui-label text-ui-label font-bold transition-all duration-200 active:scale-95 hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                >
                  <span>Solve Daily Challenge</span>
                  <HiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Preview & Top Coders */}
        <section className="reveal py-xxl border-b border-outline-variant bg-surface-container-lowest/40">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold mb-2">
                  <HiTrophy className="w-4 h-4" />
                  <span>HALL OF MASTERY</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display-lg font-bold text-on-surface">
                  Weekly Leaderboard
                </h2>
                <p className="text-on-surface-variant text-sm mt-1">
                  Compete with engineers worldwide and climb the global rankings.
                </p>
              </div>
              <Link
                to={startPath}
                className="text-xs font-ui-label font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Standings</span>
                <HiArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container-high/50 text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Coder</th>
                      <th className="py-3 px-4 text-center">Badge</th>
                      <th className="py-3 px-4 text-center">Solved</th>
                      <th className="py-3 px-4 text-center">Streak</th>
                      <th className="py-3 px-4 text-right">XP Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 font-body-md text-sm">
                    {TOP_USERS.map((userItem) => (
                      <tr
                        key={userItem.rank}
                        className="hover:bg-surface-container transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {userItem.rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-black text-xs font-black shadow-sm">
                              1
                            </span>
                          ) : userItem.rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-black text-xs font-black shadow-sm">
                              2
                            </span>
                          ) : userItem.rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-black shadow-sm">
                              3
                            </span>
                          ) : (
                            <span className="text-on-surface-variant pl-2">
                              {userItem.rank}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-on-surface group-hover:text-purple-400 transition-colors">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                              {userItem.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{userItem.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-purple-500/30 bg-purple-500/10 text-purple-400">
                            {userItem.badge}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {userItem.solved}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="inline-flex items-center gap-1 text-amber-500">
                            <span className="streak-fire">🔥</span>
                            {userItem.streak}d
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                          {userItem.xp.toLocaleString()} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Showcase */}
        <section className="reveal py-xxl border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
                <HiSparkles className="w-4 h-4 text-amber-400" />
                <span>GAMIFIED CODING</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display-lg font-bold text-on-surface">
                Earn Badges & Unlock Trophies
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base">
                Every problem solved and streak maintained translates into experience points, rank badges, and public portfolio accolades.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ACHIEVEMENTS.map((item, index) => (
                <div
                  key={index}
                  className="card-3d p-6 rounded-xl border border-outline-variant bg-surface-container-low/70 backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-surface-container to-surface-container-high border border-outline-variant flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                        item.tier === "Legendary"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : item.tier === "Epic"
                          ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                          : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {item.tier}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-on-surface mb-1.5 group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-on-surface-variant">Reward</span>
                    <span className="text-emerald-400 font-bold">+{item.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Metadata: Languages & Difficulty */}
        <section className="reveal border-b border-outline-variant bg-surface-container-lowest py-lg">
          <div className="max-w-[1280px] mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-md">
            <div className="flex items-center gap-md">
              <span className="font-ui-label text-ui-label text-on-surface-variant uppercase tracking-widest text-[10px]">
                Languages Supported
              </span>
              <div className="flex gap-xs">
                <span className="px-sm py-[2px] border border-outline text-[12px] font-code-block text-on-surface">
                  PY
                </span>
                <span className="px-sm py-[2px] border border-outline text-[12px] font-code-block text-on-surface">
                  JAVA
                </span>
                <span className="px-sm py-[2px] border border-outline text-[12px] font-code-block text-on-surface">
                  C++
                </span>
              </div>
            </div>
            <div className="hidden md:block h-8 w-[1px] bg-outline-variant" />
            <div className="flex items-center gap-md">
              <span className="font-ui-label text-ui-label text-on-surface-variant uppercase tracking-widest text-[10px]">
                Challenge Tiering
              </span>
              <div className="flex gap-sm">
                <span className="px-md py-1 border border-[#10b981] text-[#059669] font-code-block text-[12px] uppercase">
                  Easy
                </span>
                <span className="px-md py-1 border border-[#f59e0b] text-[#d97706] font-code-block text-[12px] uppercase">
                  Medium
                </span>
                <span className="px-md py-1 border border-[#f43f5e] text-[#e11d48] font-code-block text-[12px] uppercase">
                  Hard
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="reveal py-xxl">
          <div className="max-w-[1280px] mx-auto px-gutter">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
              <div className="space-y-md border-l border-outline-variant pl-lg hover:border-purple-500 transition-colors">
                <span className="font-code-block text-primary opacity-30 text-headline-sm">
                  01
                </span>
                <h3 className="font-headline-sm text-headline-sm">
                  Pick a problem
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  Choose from a curated collection of data structures and
                  algorithms refined for technical interviews.
                </p>
              </div>
              <div className="space-y-md border-l border-outline-variant pl-lg hover:border-purple-500 transition-colors">
                <span className="font-code-block text-primary opacity-30 text-headline-sm">
                  02
                </span>
                <h3 className="font-headline-sm text-headline-sm">Write code</h3>
                <p className="font-body-md text-on-surface-variant">
                  Build your solution in our high-performance browser editor
                  with native monospaced typography.
                </p>
              </div>
              <div className="space-y-md border-l border-outline-variant pl-lg hover:border-purple-500 transition-colors">
                <span className="font-code-block text-primary opacity-30 text-headline-sm">
                  03
                </span>
                <h3 className="font-headline-sm text-headline-sm">
                  Get feedback
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  Run exhaustive test cases and receive immediate performance
                  analysis on space and time complexity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA with Playground link */}
        <section className="reveal bg-primary text-on-primary py-xxl relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-gutter text-center space-y-xl relative z-10">
            <h2 className="font-display-lg text-headline-md md:text-display-lg text-on-primary tracking-tight">
              Start practicing today.
            </h2>
            <p className="max-w-xl mx-auto text-on-primary/80 text-sm md:text-base">
              Sharpen your algorithmic instincts, beat competitive benchmarks, and prepare for top-tier software engineering roles.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to={startPath}
                className="inline-block bg-on-primary text-primary px-xxl py-md font-ui-label text-ui-label font-bold transition-all duration-200 active:scale-95 hover:opacity-90 shadow-lg"
              >
                {user ? "See Problems" : "Get Started Now"}
              </Link>
              <Link
                to="/playground"
                className="inline-block border border-on-primary/30 text-on-primary px-xl py-md font-ui-label text-ui-label font-semibold transition-all duration-200 active:scale-95 hover:bg-on-primary/10"
              >
                Try Playground
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface w-full border-t border-outline-variant relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center py-xl px-gutter max-w-[1280px] mx-auto space-y-md md:space-y-0">
          <div className="flex items-center gap-2 font-display-lg text-headline-sm font-bold text-primary">
            <HiCodeBracket className="w-5 h-5 text-purple-500" />
            <span>Lekhraj CodeLab</span>
          </div>
          <div className="flex items-center space-x-md font-ui-label text-ui-label">
            <Link
              to="/privacy"
              className="text-on-surface-variant hover:text-primary transition-all duration-200"
            >
              Privacy
            </Link>
            <span className="text-outline-variant">/</span>
            <Link
              to="/terms"
              className="text-on-surface-variant hover:text-primary transition-all duration-200"
            >
              Terms
            </Link>
            <span className="text-outline-variant">/</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-primary transition-all duration-200"
            >
              Github
            </a>
            <span className="text-outline-variant">/</span>
            <a
              href="mailto:hello@lekhraj-codelab.dev"
              className="text-on-surface-variant hover:text-primary transition-all duration-200"
            >
              Contact
            </a>
          </div>
          <div className="font-ui-label text-ui-label text-on-surface-variant text-xs">
            © 2026 Lekhraj CodeLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
