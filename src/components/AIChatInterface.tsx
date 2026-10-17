import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react";
import axios from "axios";
import { FiCpu, FiSend, FiChevronDown, FiChevronUp, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  source?: string; // 'Preprocessed' | 'AI Powered' | 'Cached' | string
}

interface AIChatInterfaceProps {
  problemId: string;
  code: string;
  language: string;
}

export default function AIChatInterface({ problemId, code, language }: AIChatInterfaceProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro-1",
      sender: "ai",
      text: "👋 Hello! I am your Lekhraj CodeLab AI Tutor. Need a hint, algorithmic explanation, or code review? Choose a quick action or ask below!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      source: "AI Powered",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, isTyping, open]);

  const formatSource = (src?: string): string => {
    if (!src) return "AI Powered";
    const s = src.toLowerCase();
    if (s.includes("preprocess") || s.includes("template")) return "Preprocessed";
    if (s.includes("cache")) return "Cached";
    return "AI Powered";
  };

  const sendMessage = async (overridePrompt?: string, actionType?: "hint" | "solve" | "explain" | "review") => {
    const questionText = overridePrompt !== undefined ? overridePrompt : input;
    if (!questionText.trim() && !actionType) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: questionText.trim() || (actionType ? `Request: ${actionType.toUpperCase()}` : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (overridePrompt === undefined) {
      setInput("");
    }
    setIsTyping(true);

    try {
      const mode = actionType === "review" ? "explain" : actionType || "hint";
      const payloadQuestion =
        actionType === "review"
          ? `Please review my current code in ${language} and point out potential bugs or time/space complexity improvements: \n\n${code}`
          : questionText;

      const response = await axios.post(`${API_BASE_URL}/api/v1/ai/tutor`, {
        problemId,
        code,
        language,
        userId: user?.uid || "local",
        mode,
        question: payloadQuestion,
      });

      const rawAnswer = response.data.answer || response.data.data?.answer || "No response received.";
      const rawMode = response.data.mode || response.data.data?.mode || "AI Powered";

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: rawAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: formatSource(rawMode),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Tutor error:", error);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text: "⚠️ Lekhraj CodeLab Tutor could not reach the backend. Please check your backend connection or try again later.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: "Cached",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t border-base-300 bg-base-100 flex flex-col transition-all duration-300 shadow-md">
      {/* Collapsible Header toggle */}
      <button
        className="btn btn-ghost w-full justify-between rounded-none px-4 py-2 h-auto min-h-[44px] hover:bg-base-200/60"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-semibold text-sm">
          <FiCpu className="text-primary text-base animate-pulse" />
          <span>Lekhraj CodeLab AI Tutor</span>
          <span className="badge badge-primary badge-xs py-2 px-2 uppercase font-bold tracking-wider">
            Smart Assistant
          </span>
        </span>
        <div className="flex items-center gap-2 text-xs opacity-70">
          <span>{open ? "Collapse" : "Open Chat"}</span>
          {open ? <FiChevronDown /> : <FiChevronUp />}
        </div>
      </button>

      {/* Collapsible Panel with smooth slide */}
      {open && (
        <div className="flex flex-col h-80 border-t border-base-200 bg-base-200/40">
          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 p-2.5 bg-base-100/90 border-b border-base-300/60 overflow-x-auto text-xs">
            <span className="text-[11px] font-semibold text-base-content/60 uppercase tracking-wider pl-1">
              Quick:
            </span>
            <button
              disabled={isTyping}
              className="btn btn-xs btn-outline btn-primary rounded-full gap-1 whitespace-nowrap"
              onClick={() => sendMessage("Can you give me a subtle hint without spoiling the full solution?", "hint")}
            >
              💡 Hint
            </button>
            <button
              disabled={isTyping}
              className="btn btn-xs btn-outline rounded-full gap-1 whitespace-nowrap"
              onClick={() => sendMessage("Can you explain the optimal logic and algorithmic approach for this problem?", "explain")}
            >
              📖 Explain
            </button>
            <button
              disabled={isTyping}
              className="btn btn-xs btn-outline btn-secondary rounded-full gap-1 whitespace-nowrap"
              onClick={() => sendMessage("Can you provide the complete solution with step-by-step walkthrough?", "solve")}
            >
              🔧 Solve
            </button>
            <button
              disabled={isTyping}
              className="btn btn-xs btn-outline btn-accent rounded-full gap-1 whitespace-nowrap"
              onClick={() => sendMessage("", "review")}
            >
              🔍 Review My Code
            </button>
            <div className="ml-auto">
              <button
                className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-error"
                title="Clear Chat"
                onClick={() => setMessages([])}
              >
                <FiTrash2 />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"} max-w-[85%] ${
                    isAi ? "mr-auto" : "ml-auto"
                  }`}
                >
                  <div
                    className={`p-3 text-xs md:text-sm leading-relaxed shadow-sm ${
                      isAi
                        ? "chat-bubble-ai text-slate-100"
                        : "chat-bubble-user text-white"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-base-content/50 font-mono">
                    <span>{msg.timestamp}</span>
                    {isAi && msg.source && (
                      <span
                        className={`badge badge-ghost badge-xs px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                          msg.source === "AI Powered"
                            ? "text-primary border-primary/30"
                            : msg.source === "Preprocessed"
                            ? "text-secondary border-secondary/30"
                            : "text-accent border-accent/30"
                        }`}
                      >
                        {msg.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start max-w-[85%] mr-auto">
                <div className="chat-bubble-ai p-3 rounded-2xl flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                </div>
                <span className="text-[10px] text-base-content/50 mt-1 px-1 font-mono">
                  Thinking...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom input area */}
          <div className="p-2.5 bg-base-100 border-t border-base-300 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              placeholder="Ask about logic, complexity, debugging, or hints..."
              className="input input-bordered input-sm flex-1 focus:outline-none focus:border-primary text-xs"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              className="btn btn-primary btn-sm px-3"
              aria-label="Send message"
            >
              <FiSend className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
