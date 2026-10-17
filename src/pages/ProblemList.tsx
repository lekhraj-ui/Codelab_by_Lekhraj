import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProblemCard, { Problem } from "../components/ProblemCard";
import DailyProblem from "../components/DailyProblem";
import useFetchProblems from "../hooks/useFetchProblems";

const COMMON_TOPICS = [
  "All Topics",
  "Arrays",
  "Strings",
  "Sorting",
  "Binary Search",
  "Problem Solving",
  "Dynamic Programming",
  "Trees",
  "Graphs",
  "Math",
];

const ProblemList: React.FC = () => {
  const { problems, error } = useFetchProblems();
  const [difficulty, setDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [problemType, setProblemType] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("lekhraj-codelab-bookmarks") || "[]")
  );
  const [solvedProblems, setSolvedProblems] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("lekhraj-codelab-solved") || "[]")
  );
  const [showSaved, setShowSaved] = useState(false);

  // Sync solved problems if stored elsewhere or update from submissions
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lekhraj-codelab-solved");
      if (stored) {
        setSolvedProblems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (id: string) => {
    const next = bookmarks.includes(id)
      ? bookmarks.filter((item) => item !== id)
      : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("lekhraj-codelab-bookmarks", JSON.stringify(next));
  };

  // Extract dynamic topics from problem set combined with common topics
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p: any) => {
      const t = p.topic || p.category;
      if (t && typeof t === "string" && t.trim()) {
        set.add(t.trim());
      }
    });
    COMMON_TOPICS.forEach((t) => {
      if (t !== "All Topics") set.add(t);
    });
    return ["All Topics", ...Array.from(set)];
  }, [problems]);

  const filteredProblems = useMemo(() => {
    const result = problems.filter((problem: any) => {
      const matchesQuery = (problem.title || "")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesDifficulty =
        difficulty === "all" ||
        (problem.difficulty || "").toLowerCase() === difficulty;
      const matchesSaved = !showSaved || bookmarks.includes(problem._id);

      // Topic filter
      const pTopic = (problem.topic || problem.category || "Problem Solving").toLowerCase();
      const matchesTopic =
        selectedTopic === "All Topics" ||
        pTopic.includes(selectedTopic.toLowerCase()) ||
        selectedTopic.toLowerCase().includes(pTopic);

      // Problem type filter: All, Coding, Quiz
      const pType = (problem.type || "Coding").toLowerCase();
      const matchesType =
        problemType === "All" ||
        (problemType === "Coding" && (pType.includes("coding") || pType === "standard")) ||
        (problemType === "Quiz" && (pType.includes("mcq") || pType.includes("quiz")));

      return matchesQuery && matchesDifficulty && matchesSaved && matchesTopic && matchesType;
    });

    if (sort === "title") return [...result].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "difficulty") {
      const order: Record<string, number> = { easy: 1, medium: 2, hard: 3 };
      return [...result].sort(
        (a, b) =>
          (order[(a.difficulty || "").toLowerCase()] || 9) -
          (order[(b.difficulty || "").toLowerCase()] || 9)
      );
    }
    return result;
  }, [problems, query, difficulty, sort, showSaved, bookmarks, selectedTopic, problemType]);

  const solvedCount = problems.filter((p: any) => solvedProblems.includes(p._id)).length;
  const totalCount = problems.length || 1;
  const progressPercent = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Daily Challenge Banner at the top */}
        <section>
          <DailyProblem compact={false} />
        </section>

        {/* Header with Stats & Quick links */}
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Practice Workspace
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Problems to Solve
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              Build problem solving consistency, earn XP, and level up your engineering skills.
            </p>
          </div>

          {/* Quick link action buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/playground"
              className="btn btn-outline btn-secondary btn-sm gap-2"
            >
              <span>💻</span> Coding Playground
            </Link>
            <Link
              to="/quiz"
              className="btn btn-outline btn-accent btn-sm gap-2"
            >
              <span>🧠</span> Take a Quiz
            </Link>
          </div>
        </div>

        {/* Stats Bar: X solved / Y total with progress bar */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
              📊
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                Overall Progress
              </div>
              <div className="text-lg font-bold">
                {solvedCount}{" "}
                <span className="text-xs font-normal text-base-content/60">
                  solved / {problems.length} total ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-base-content/70">
              <span>Mastery Progress</span>
              <span className="font-mono font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-base-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-primary transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="px-3 py-1.5 rounded-lg bg-base-200">
              Showing: <span className="text-primary font-bold">{filteredProblems.length}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-base-200">
              Bookmarks: <span className="text-warning font-bold">{bookmarks.length}</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm space-y-4">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_auto_auto_auto_auto]">
            {/* Search */}
            <label className="input input-bordered input-sm md:input-md flex items-center gap-2">
              <span className="opacity-50 text-sm">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by problem title..."
                className="w-full text-sm"
              />
            </label>

            {/* Difficulty Filter */}
            <select
              className="select select-bordered select-sm md:select-md text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Problem Type Filter: All, Coding, Quiz */}
            <div className="join">
              <button
                className={`join-item btn btn-sm md:btn-md ${problemType === "All" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setProblemType("All")}
              >
                All
              </button>
              <button
                className={`join-item btn btn-sm md:btn-md ${problemType === "Coding" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setProblemType("Coding")}
              >
                Coding
              </button>
              <button
                className={`join-item btn btn-sm md:btn-md ${problemType === "Quiz" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setProblemType("Quiz")}
              >
                Quiz
              </button>
            </div>

            {/* Sort */}
            <select
              className="select select-bordered select-sm md:select-md text-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="title">Sort: A–Z</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>

            {/* Bookmarked toggle */}
            <button
              className={`btn btn-sm md:btn-md ${showSaved ? "btn-warning" : "btn-outline"}`}
              onClick={() => setShowSaved(!showSaved)}
            >
              ★ Saved
            </button>
          </div>

          {/* Topic Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider shrink-0 pr-1">
              Topics:
            </span>
            {availableTopics.slice(0, 12).map((topic) => {
              const active = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`btn btn-xs rounded-full shrink-0 transition-all ${
                    active
                      ? "btn-primary font-bold shadow-sm"
                      : "btn-ghost bg-base-200/80 hover:bg-base-300 text-base-content/70"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </section>

        {/* Error message */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Problems Grid */}
        {filteredProblems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-16 text-center">
            <div className="text-4xl mb-3">🧩</div>
            <h2 className="text-xl font-bold">No problems found</h2>
            <p className="mt-2 text-sm text-base-content/60">
              Try adjusting your search query, difficulty, or topic filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProblems.map((problem: Problem, idx: number) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                index={idx}
                saved={bookmarks.includes(problem._id)}
                solved={solvedProblems.includes(problem._id)}
                onToggleSave={() => toggleBookmark(problem._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProblemList;
