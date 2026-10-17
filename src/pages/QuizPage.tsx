/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer?: number; // 0-indexed if local fallback
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  codeSnippet?: string;
  xpValue?: number;
}

const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    _id: "q-1",
    question: "What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL or Red-Black Tree)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "Because self-balancing trees guarantee a height bounded by O(log n), any search, insert, or delete operation takes O(log n) time in the worst case.",
    difficulty: "Easy",
    topic: "Data Structures",
    xpValue: 20,
  },
  {
    _id: "q-2",
    question: "Which of the following sorting algorithms is NOT stable by default?",
    options: ["Merge Sort", "Insertion Sort", "Quick Sort", "Bubble Sort"],
    correctAnswer: 2,
    explanation: "Quick Sort swaps non-adjacent elements over a pivot, which may reverse the relative order of equal keys, making it unstable in standard implementations.",
    difficulty: "Medium",
    topic: "Algorithms",
    xpValue: 30,
  },
  {
    _id: "q-3",
    question: "What does the 'Two Pointer' technique primarily optimize for in sorted array problems?",
    options: [
      "Reduces time complexity from O(n²) to O(n) without extra space",
      "Converts iteration into recursive divide-and-conquer",
      "Increases recursion stack depth for cache locality",
      "Eliminates integer overflow risks",
    ],
    correctAnswer: 0,
    explanation: "Two pointers allow you to prune search branches monotonically across sorted bounds, reducing quadratic brute-force loops into a single linear pass.",
    difficulty: "Medium",
    topic: "Two Pointers",
    xpValue: 30,
  },
  {
    _id: "q-4",
    question: "In Python, what is the average time complexity for checking if a key exists in a dict (`key in my_dict`)?",
    options: ["O(n)", "O(log n)", "O(1)", "O(k) where k is number of keys"],
    correctAnswer: 2,
    explanation: "Python dictionaries are implemented as hash tables with open addressing and quadratic/perturbation probing, offering O(1) expected time complexity.",
    difficulty: "Easy",
    topic: "Python & Hashing",
    xpValue: 20,
  },
  {
    _id: "q-5",
    question: "Which data structure is typically used to implement Breadth-First Search (BFS) in a graph?",
    options: ["Stack", "Queue", "Priority Queue", "Disjoint Set (Union-Find)"],
    correctAnswer: 1,
    explanation: "BFS explores nodes in level-by-level FIFO order, making a Queue the standard data structure. Stacks are used for DFS, and Priority Queues for Dijkstra.",
    difficulty: "Easy",
    topic: "Graphs",
    xpValue: 20,
  },
  {
    _id: "q-6",
    question: "What is the space complexity of an in-order traversal of a balanced binary tree using recursion?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 1,
    explanation: "The recursive call stack reaches a maximum depth equal to the tree height. For a balanced tree with n nodes, the height is O(log n).",
    difficulty: "Medium",
    topic: "Trees",
    xpValue: 30,
  },
  {
    _id: "q-7",
    question: "In Dynamic Programming, what are the two core prerequisites for a problem to be solvable via DP?",
    options: [
      "Optimal Substructure and Overlapping Subproblems",
      "Greedy Choice Property and Monotonicity",
      "Disjoint Partitions and Transitive Closure",
      "Bipartite Matching and Flow Conservation",
    ],
    correctAnswer: 0,
    explanation: "Dynamic programming applies when a global optimal solution can be built from optimal subproblem solutions (Optimal Substructure) and the subproblems recur repeatedly (Overlapping Subproblems).",
    difficulty: "Hard",
    topic: "Dynamic Programming",
    xpValue: 40,
  },
];

const QuizPage: React.FC = () => {
  const { user } = useAuth();

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);
  const [explanation, setExplanation] = useState<string>("");
  const [xpEarned, setXpEarned] = useState<number>(0);

  // Session stats
  const [totalAnswered, setTotalAnswered] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);
  const [sessionXP, setSessionXP] = useState<number>(0);

  // Confetti particles state
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(false);

  // Fallback question index tracking
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setCorrectAnswerIndex(null);
    setExplanation("");
    setShowConfetti(false);
    setShowXpPopup(false);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/quiz/random`, {
        timeout: 4000,
      });

      if (res.data?.data) {
        setCurrentQuestion(res.data.data);
      } else {
        // Fallback
        const q = FALLBACK_QUESTIONS[fallbackIndex % FALLBACK_QUESTIONS.length];
        setFallbackIndex((prev) => prev + 1);
        setCurrentQuestion(q);
      }
    } catch (err) {
      console.warn("Quiz API unavailable, using local question set:", err);
      const q = FALLBACK_QUESTIONS[fallbackIndex % FALLBACK_QUESTIONS.length];
      setFallbackIndex((prev) => prev + 1);
      setCurrentQuestion(q);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectOption = async (index: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(index);
    setIsAnswered(true);

    try {
      // POST answer to backend
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/quiz/answer`,
        {
          quizId: currentQuestion._id,
          answer: index,
          userId: user?.uid || "guest",
        },
        { timeout: 3500 }
      );

      const data = res.data?.data || res.data;
      const correct = Boolean(data.isCorrect);
      const cIndex = data.correctAnswer !== undefined ? data.correctAnswer : currentQuestion.correctAnswer ?? 0;
      const expl = data.explanation || currentQuestion.explanation;
      const earned = data.xpEarned || (correct ? currentQuestion.xpValue || 25 : 0);

      setIsCorrect(correct);
      setCorrectAnswerIndex(cIndex);
      setExplanation(expl);
      setXpEarned(earned);

      setTotalAnswered((prev) => prev + 1);
      if (correct) {
        setTotalCorrect((prev) => prev + 1);
        setSessionXP((prev) => prev + earned);
        setShowConfetti(true);
        setShowXpPopup(true);
      }
    } catch {
      // Offline fallback handling
      const cIndex = currentQuestion.correctAnswer ?? 0;
      const correct = index === cIndex;
      const earned = correct ? currentQuestion.xpValue || 25 : 0;

      setIsCorrect(correct);
      setCorrectAnswerIndex(cIndex);
      setExplanation(currentQuestion.explanation);
      setXpEarned(earned);

      setTotalAnswered((prev) => prev + 1);
      if (correct) {
        setTotalCorrect((prev) => prev + 1);
        setSessionXP((prev) => prev + earned);
        setShowConfetti(true);
        setShowXpPopup(true);
      }
    }
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case "Hard":
        return <span className="badge badge-error badge-sm font-bold">Hard 🔴</span>;
      case "Medium":
        return <span className="badge badge-warning badge-sm font-bold">Medium 🟡</span>;
      default:
        return <span className="badge badge-success badge-sm font-bold">Easy 🟢</span>;
    }
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Confetti Animation Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm animate-confetti"
              style={{
                left: `${(i * 2.5) % 100}%`,
                top: `${(i * 3) % 40 + 20}%`,
                backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6"][i % 6],
                animationDelay: `${(i % 10) * 80}ms`,
                transform: `rotate(${i * 25}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* XP Earned Floating Popup */}
      {showXpPopup && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="badge badge-success text-success-content font-extrabold text-base px-6 py-4 shadow-2xl border-2 border-emerald-300 gap-2">
            <span>✨</span>
            <span>+{xpEarned} XP Earned!</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-up">
        {/* TITLE & HEADER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-base-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider mb-1">
              <span>Interactive Knowledge Check</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <span>Coding Quiz 🧠</span>
            </h1>
          </div>

          {/* SCORE TRACKER & SESSION STATS */}
          <div className="flex items-center gap-3 bg-base-200/90 border border-base-300/80 px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="text-right">
              <div className="text-xs text-base-content/60 font-semibold uppercase">Score</div>
              <div className="text-xl font-black text-primary font-mono">
                {totalCorrect} / {totalAnswered}
              </div>
            </div>
            <div className="divider divider-horizontal m-0" />
            <div className="text-left">
              <div className="text-xs text-base-content/60 font-semibold uppercase">Session XP</div>
              <div className="text-xl font-black text-warning font-mono">
                +{sessionXP} XP
              </div>
            </div>
          </div>
        </div>

        {/* QUIZ CARD */}
        {loading ? (
          <div className="card bg-base-200/80 border border-base-300 shadow-xl rounded-3xl p-16 flex flex-col items-center justify-center space-y-4">
            <span className="loading loading-spinner loading-lg text-primary" />
            <p className="text-sm font-mono text-base-content/70">Generating algorithmic challenge...</p>
          </div>
        ) : !currentQuestion ? (
          <div className="card bg-base-200 border border-base-300 rounded-3xl p-8 text-center space-y-4">
            <p className="text-lg">No question available right now.</p>
            <button onClick={fetchQuestion} className="btn btn-primary btn-sm mx-auto">
              Try Again
            </button>
          </div>
        ) : (
          <div
            className={`card bg-base-200/90 border shadow-2xl rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
              isAnswered && isCorrect
                ? "border-emerald-500/80 bg-emerald-950/20 shadow-emerald-500/10"
                : isAnswered && !isCorrect
                ? "border-rose-500/80 bg-rose-950/20 shadow-rose-500/10"
                : "border-base-300"
            }`}
          >
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-base-300/80">
              <div className="flex items-center gap-2">
                <span className="badge badge-outline badge-primary font-semibold text-xs px-3 py-2">
                  Topic: {currentQuestion.topic}
                </span>
                {getDifficultyBadge(currentQuestion.difficulty)}
              </div>
              <div className="text-xs font-mono font-bold text-warning flex items-center gap-1">
                <span>⭐</span>
                <span>+{currentQuestion.xpValue || 25} XP on correct</span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-xl sm:text-2xl font-bold leading-relaxed mb-6 text-base-content">
              {currentQuestion.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQuestion.codeSnippet && (
              <pre className="bg-base-300/90 border border-base-content/10 p-4 rounded-2xl font-mono text-xs mb-6 overflow-x-auto">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isTargetCorrect = isAnswered && (correctAnswerIndex === idx);
                const isWrongSelection = isAnswered && isSelected && !isCorrect;

                let cardStyle = "bg-base-100 hover:bg-base-300/80 border-base-300 hover:border-primary/50 text-base-content";
                let badgeStyle = "bg-base-200 text-base-content";

                if (isTargetCorrect) {
                  cardStyle = "bg-emerald-600 text-white border-emerald-400 font-bold shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-300 scale-[1.02]";
                  badgeStyle = "bg-white text-emerald-800 font-black";
                } else if (isWrongSelection) {
                  cardStyle = "bg-rose-600 text-white border-rose-400 font-bold shadow-lg shadow-rose-600/30 ring-2 ring-rose-300";
                  badgeStyle = "bg-white text-rose-800 font-black";
                } else if (isAnswered) {
                  cardStyle = "bg-base-100/40 opacity-50 border-base-300/40 text-base-content/60 cursor-not-allowed";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`card p-5 rounded-2xl border-2 transition-all duration-200 text-left flex flex-row items-center gap-4 group ${cardStyle}`}
                  >
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-110 ${badgeStyle}`}
                    >
                      {optionLabels[idx] || idx + 1}
                    </span>
                    <span className="text-sm sm:text-base leading-snug flex-1">
                      {opt}
                    </span>
                    {isTargetCorrect && <span className="text-xl shrink-0">✅</span>}
                    {isWrongSelection && <span className="text-xl shrink-0">❌</span>}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback / Explanation */}
            {isAnswered && (
              <div
                className={`p-5 rounded-2xl border mb-6 animate-fade-up ${
                  isCorrect
                    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/60 text-rose-200"
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base mb-2">
                  <span>{isCorrect ? "🎉 Excellent! That's Correct." : "❌ Not Quite Right."}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  <strong className="underline mr-1">Explanation:</strong> {explanation}
                </p>
              </div>
            )}

            {/* Next Question Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={fetchQuestion}
                  className="btn btn-primary btn-md rounded-2xl shadow-lg gap-2 font-bold px-6 animate-scale-in"
                >
                  <span>Next Question</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
