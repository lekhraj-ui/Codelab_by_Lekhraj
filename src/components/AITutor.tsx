import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import axios from "axios";
import { FiCpu, FiSend, FiX } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface Props { problemId: string; code: string; language: string; }
export default function AITutor({ problemId, code, language }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"hint" | "solve" | "explain">("hint");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState("Preprocessed");

  async function ask(type = mode) {
    setBusy(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/ai/tutor`, {
        problemId, code, language, userId: user?.uid || "local", mode: type, question,
      });
      setAnswer(response.data.answer || "No answer returned.");
      setSource(response.data.mode || "offline");
    } catch (error) {
      console.error(error);
      setAnswer("Lekhraj CodeLab Tutor could not reach the backend. Make sure the backend is running on localhost:3000.");
    } finally { setBusy(false); }
  }

  return (
    <div className="border-t border-base-300 bg-base-100">
      <button className="btn btn-ghost w-full justify-between rounded-none" onClick={() => setOpen(!open)}>
        <span className="flex items-center gap-2"><FiCpu /> Lekhraj CodeLab Tutor <span className="badge badge-primary badge-sm">Preprocessed + AI when needed</span></span>
        <span>{open ? "Hide" : "Open"}</span>
      </button>
      {open && <div className="p-3 space-y-3">
        <div className="flex gap-2 flex-wrap">
          <button className={`btn btn-sm ${mode === "hint" ? "btn-primary" : "btn-outline"}`} onClick={() => {setMode("hint"); ask("hint");}}>Hint</button>
          <button className={`btn btn-sm ${mode === "explain" ? "btn-primary" : "btn-outline"}`} onClick={() => {setMode("explain"); ask("explain");}}>Explain</button>
          <button className={`btn btn-sm ${mode === "solve" ? "btn-primary" : "btn-outline"}`} onClick={() => {setMode("solve"); ask("solve");}}>Solve</button>
        </div>
        <div className="join w-full">
          <input className="input input-bordered join-item flex-1" value={question} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)} placeholder="Ask the AI about your approach or code..." onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") ask(); }} />
          <button className="btn btn-primary join-item" onClick={() => ask()} disabled={busy}><FiSend /></button>
        </div>
        {busy ? <div className="loading loading-dots loading-md" /> : answer && <div className="rounded-lg bg-base-200 p-3 text-sm whitespace-pre-wrap max-h-56 overflow-auto"><div className="mb-2 text-xs opacity-60">Source: {source}</div>{answer}</div>}
        <button className="btn btn-ghost btn-xs" onClick={() => {setAnswer("");setQuestion("");setOpen(false);}}><FiX /> Close</button>
      </div>}
    </div>
  );
}
