import { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/api";
import { SUBMISSION_LIMIT } from "../services/firebase";

export default function SubmissionLimit() {
  const { user } = useAuth();
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchSubmissionCount() {
      if (!user) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/${user.uid}/submission-count`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setSubmissionCount(Number(data.count || 0));
      } catch {
        // Keep the counter at zero if the API is temporarily unavailable.
      }
    }
    fetchSubmissionCount();
    const timer = window.setInterval(fetchSubmissionCount, 10000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, [user]);

  const remainingSubmissions = Math.max(0, SUBMISSION_LIMIT - submissionCount);
  const percentage = Math.min(100, (submissionCount / SUBMISSION_LIMIT) * 100);

  return (
    <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-lg shadow-md relative z-10 shrink-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-300 font-medium">Daily Submissions</span>
          <FiInfo className="text-gray-400 cursor-help" data-tooltip-id="submission-limit-tooltip" />
          <Tooltip id="submission-limit-tooltip" className="max-w-xs bg-gray-700 text-sm z-[60]">
            Your local backend tracks submissions and resets the counter each UTC day.
          </Tooltip>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className={`h-full rounded-full transition-all duration-300 ${percentage < 50 ? "bg-green-500" : percentage < 80 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
        </div>
      </div>
      <div className="text-right"><span className="text-gray-300 font-mono">{remainingSubmissions}/{SUBMISSION_LIMIT}</span></div>
    </div>
  );
}
