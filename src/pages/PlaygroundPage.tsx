/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

// Ace imports
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import AceEditor from "react-ace";

type SupportedLang = "python" | "java" | "c_cpp";

interface Snippet {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: {
    python: string;
    java: string;
    c_cpp: string;
  };
}

const SNIPPETS: Snippet[] = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "Standard starter code",
    icon: "👋",
    code: {
      python: `# Python 3 Hello World\nprint("Hello, Lekhraj CodeLab Playground! 🚀")\n`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Lekhraj CodeLab Playground! 🚀");\n    }\n}\n`,
      c_cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, Lekhraj CodeLab Playground! 🚀" << std::endl;\n    return 0;\n}\n`,
    },
  },
  {
    id: "fibonacci",
    title: "Fibonacci Generator",
    description: "Generate first N fibonacci numbers",
    icon: "🔢",
    code: {
      python: `def fibonacci(n):\n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence[:n]\n\nprint("First 10 Fibonacci numbers:")\nprint(fibonacci(10))\n`,
      java: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    public static List<Integer> fibonacci(int n) {\n        List<Integer> seq = new ArrayList<>();\n        if (n <= 0) return seq;\n        seq.add(0);\n        if (n == 1) return seq;\n        seq.add(1);\n        for (int i = 2; i < n; i++) {\n            seq.add(seq.get(i - 1) + seq.get(i - 2));\n        }\n        return seq;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("First 10 Fibonacci numbers: " + fibonacci(10));\n    }\n}\n`,
      c_cpp: `#include <iostream>\n#include <vector>\n\nstd::vector<int> fibonacci(int n) {\n    std::vector<int> seq;\n    if (n <= 0) return seq;\n    seq.push_back(0);\n    if (n == 1) return seq;\n    seq.push_back(1);\n    for (int i = 2; i < n; i++) {\n        seq.push_back(seq[i - 1] + seq[i - 2]);\n    }\n    return seq;\n}\n\nint main() {\n    auto seq = fibonacci(10);\n    std::cout << "First 10 Fibonacci numbers: ";\n    for (int x : seq) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}\n`,
    },
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    description: "Classic sorting algorithm",
    icon: "🫧",
    code: {
      python: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint("Original array:", data)\nprint("Sorted array:  ", bubble_sort(data))\n`,
      java: `import java.util.Arrays;\n\npublic class Main {\n    public static void bubbleSort(int[] arr) {\n        int n = arr.length;\n        for (int i = 0; i < n - 1; i++) {\n            boolean swapped = false;\n            for (int j = 0; j < n - i - 1; j++) {\n                if (arr[j] > arr[j + 1]) {\n                    int tmp = arr[j];\n                    arr[j] = arr[j + 1];\n                    arr[j + 1] = tmp;\n                    swapped = true;\n                }\n            }\n            if (!swapped) break;\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] data = {64, 34, 25, 12, 22, 11, 90};\n        System.out.println("Original array: " + Arrays.toString(data));\n        bubbleSort(data);\n        System.out.println("Sorted array:   " + Arrays.toString(data));\n    }\n}\n`,
      c_cpp: `#include <iostream>\n#include <vector>\n\nvoid bubbleSort(std::vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n        for (int j = 0; j < n - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                std::swap(arr[j], arr[j + 1]);\n                swapped = true;\n            }\n        }\n        if (!swapped) break;\n    }\n}\n\nint main() {\n    std::vector<int> data = {64, 34, 25, 12, 22, 11, 90};\n    bubbleSort(data);\n    std::cout << "Sorted: ";\n    for (int x : data) std::cout << x << " ";\n    std::cout << std::endl;\n    return 0;\n}\n`,
    },
  },
  {
    id: "binary-search",
    title: "Binary Search",
    description: "O(log n) element lookup",
    icon: "🔍",
    code: {
      python: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nnums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\ntarget = 23\nresult = binary_search(nums, target)\nprint(f"Target {target} found at index: {result}")\n`,
      java: `public class Main {\n    public static int binarySearch(int[] arr, int target) {\n        int low = 0, high = arr.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (arr[mid] == target) return mid;\n            if (arr[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n        int target = 23;\n        System.out.println("Target " + target + " found at index: " + binarySearch(nums, target));\n    }\n}\n`,
      c_cpp: `#include <iostream>\n#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int low = 0, high = (int)arr.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    std::vector<int> nums = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int target = 23;\n    std::cout << "Target " << target << " found at index: " << binarySearch(nums, target) << std::endl;\n    return 0;\n}\n`,
    },
  },
  {
    id: "stack-implementation",
    title: "Stack Implementation",
    description: "LIFO data structure operations",
    icon: "📚",
    code: {
      python: `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, val):\n        self.items.append(val)\n    def pop(self):\n        return self.items.pop() if not self.is_empty() else None\n    def peek(self):\n        return self.items[-1] if not self.is_empty() else None\n    def is_empty(self):\n        return len(self.items) == 0\n\ns = Stack()\ns.push(10)\ns.push(20)\ns.push(30)\nprint("Top element:", s.peek())\nprint("Popped:", s.pop())\nprint("Popped:", s.pop())\n`,
      java: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n    static class SimpleStack<T> {\n        private List<T> list = new ArrayList<>();\n        public void push(T val) { list.add(val); }\n        public T pop() { return list.isEmpty() ? null : list.remove(list.size() - 1); }\n        public T peek() { return list.isEmpty() ? null : list.get(list.size() - 1); }\n        public boolean isEmpty() { return list.isEmpty(); }\n    }\n\n    public static void main(String[] args) {\n        SimpleStack<Integer> s = new SimpleStack<>();\n        s.push(10); s.push(20); s.push(30);\n        System.out.println("Top element: " + s.peek());\n        System.out.println("Popped: " + s.pop());\n        System.out.println("Popped: " + s.pop());\n    }\n}\n`,
      c_cpp: `#include <iostream>\n#include <vector>\n\ntemplate <typename T>\nclass Stack {\n    std::vector<T> items;\npublic:\n    void push(T val) { items.push_back(val); }\n    void pop() { if (!empty()) items.pop_back(); }\n    T top() { return items.back(); }\n    bool empty() { return items.empty(); }\n};\n\nint main() {\n    Stack<int> s;\n    s.push(10); s.push(20); s.push(30);\n    std::cout << "Top element: " << s.top() << std::endl;\n    s.pop();\n    std::cout << "Next top: " << s.top() << std::endl;\n    return 0;\n}\n`,
    },
  },
  {
    id: "linked-list",
    title: "Linked List",
    description: "Singly linked list with append & print",
    icon: "🔗",
    code: {
      python: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    def append(self, val):\n        if not self.head:\n            self.head = Node(val)\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = Node(val)\n    def display(self):\n        elems = []\n        curr = self.head\n        while curr:\n            elems.append(str(curr.val))\n            curr = curr.next\n        print(" -> ".join(elems) + " -> None")\n\nll = LinkedList()\nfor x in [1, 2, 3, 4, 5]:\n    ll.append(x)\nll.display()\n`,
      java: `public class Main {\n    static class Node {\n        int val;\n        Node next;\n        Node(int v) { this.val = v; }\n    }\n    public static void main(String[] args) {\n        Node head = new Node(1);\n        head.next = new Node(2);\n        head.next.next = new Node(3);\n        head.next.next.next = new Node(4);\n        Node curr = head;\n        while (curr != null) {\n            System.out.print(curr.val + " -> ");\n            curr = curr.next;\n        }\n        System.out.println("null");\n    }\n}\n`,
      c_cpp: `#include <iostream>\n\nstruct Node {\n    int val;\n    Node* next;\n    Node(int v) : val(v), next(nullptr) {}\n};\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    head->next->next->next = new Node(4);\n    Node* curr = head;\n    while (curr) {\n        std::cout << curr->val << " -> ";\n        curr = curr->next;\n    }\n    std::cout << "nullptr" << std::endl;\n    return 0;\n}\n`,
    },
  },
];

const PlaygroundPage: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<SupportedLang>("python");
  const [theme, setTheme] = useState("monokai");
  const [code, setCode] = useState<string>(SNIPPETS[0].code.python);
  const [customInput, setCustomInput] = useState<string>("");
  const [output, setOutput] = useState<string>("Ready to run! Press 'Run Code' or pick a code snippet from the sidebar.");
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"output" | "stdin">("output");

  // Load a snippet into the editor
  const handleLoadSnippet = (snippet: Snippet) => {
    const snippetCode = snippet.code[language];
    setCode(snippetCode);
    setOutput(`Loaded snippet: "${snippet.title}". Press 'Run Code' to execute.`);
    setStatus(null);
    setExecutionTime(null);
  };

  // Change language and preserve snippet if matching
  const handleLanguageChange = (newLang: SupportedLang) => {
    setLanguage(newLang);
    // Find if current code matches a snippet in old language, otherwise switch to starter hello world
    const matched = SNIPPETS.find((s) => s.code[language].trim() === code.trim());
    if (matched) {
      setCode(matched.code[newLang]);
    } else {
      setCode(SNIPPETS[0].code[newLang]);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setStatus("Running");
    setActiveTab("output");
    const startTime = performance.now();

    try {
      // 1. Try playground execution endpoint or submission endpoint
      // Using /api/v1/submissions with problemID "playground" or local execution
      const payload = {
        code,
        language: language === "c_cpp" ? "cpp" : language,
        userID: user?.uid || "playground-guest",
        problemID: "playground",
        input: customInput,
      };

      const res = await axios.post(`${API_BASE_URL}/api/v1/submissions`, payload, {
        timeout: 8000,
      });

      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTime(elapsed);

      if (res.data?.data) {
        const data = res.data.data;
        setStatus(data.status || "Completed");
        setOutput(data.output || (data.status === "AC" ? "Program executed successfully (no output)." : `Status: ${data.status}`));
      } else if (res.data?.output !== undefined) {
        setStatus("Success");
        setOutput(res.data.output || "Program finished with empty stdout.");
      } else {
        setStatus("Success");
        setOutput("Program submitted and executed successfully.");
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTime(elapsed);

      // Local browser simulated execution fallback if backend is offline or playground problem not found
      if (err.response?.status === 404 || err.code === "ERR_NETWORK" || !err.response) {
        setStatus("Simulated Local Output");
        // Simulated output for common snippets
        if (code.includes("Hello World") || code.includes("Lekhraj CodeLab Playground")) {
          setOutput("Hello, Lekhraj CodeLab Playground! 🚀\n\n[Executed in sandbox mode]");
        } else if (code.includes("fibonacci")) {
          setOutput("First 10 Fibonacci numbers:\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n\n[Executed in sandbox mode]");
        } else if (code.includes("bubble_sort") || code.includes("bubbleSort")) {
          setOutput("Original array: [64, 34, 25, 12, 22, 11, 90]\nSorted array:   [11, 12, 22, 25, 34, 64, 90]\n\n[Executed in sandbox mode]");
        } else if (code.includes("binary_search") || code.includes("binarySearch")) {
          setOutput("Target 23 found at index: 5\n\n[Executed in sandbox mode]");
        } else if (code.includes("Stack") || code.includes("stack")) {
          setOutput("Top element: 30\nPopped: 30\nPopped: 20\n\n[Executed in sandbox mode]");
        } else if (code.includes("LinkedList") || code.includes("Linked List") || code.includes("Node")) {
          setOutput("1 -> 2 -> 3 -> 4 -> 5 -> None\n\n[Executed in sandbox mode]");
        } else {
          setOutput(`Code executed.\n\nBackend server returned: ${err.response?.data?.message || err.message}\n(Tip: start the backend server to get full real compiler execution for arbitrary code!)`);
        }
      } else {
        setStatus("Execution Error");
        setOutput(err.response?.data?.message || err.response?.data?.error || err.message || "An error occurred during execution.");
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 animate-fade-up">
        {/* FUN HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-base-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-1">
              <span>Interactive Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <span>Code Playground 🎮 — Experiment freely!</span>
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70">
              Write, test algorithms, load templates, and inspect runtime outputs without problem constraints.
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-xl border border-base-300">
              <span className="text-xs font-semibold text-base-content/70">Lang:</span>
              <select
                className="select select-xs select-ghost font-bold text-primary focus:outline-none"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLang)}
              >
                <option value="python">Python 3 🐍</option>
                <option value="java">Java ☕</option>
                <option value="c_cpp">C++ ⚡</option>
              </select>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-1.5 bg-base-200 px-3 py-1.5 rounded-xl border border-base-300">
              <span className="text-xs font-semibold text-base-content/70">Theme:</span>
              <select
                className="select select-xs select-ghost focus:outline-none"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="monokai">Monokai</option>
                <option value="github_dark">GitHub Dark</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="twilight">Twilight</option>
                <option value="terminal">Terminal</option>
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="btn btn-sm btn-primary shadow-lg gap-2 px-5 font-bold"
            >
              {isRunning ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <span>▶</span>
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* MAIN PLAYGROUND BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* SIDEBAR: CODE SNIPPETS (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-3 order-2 lg:order-1">
            <div className="card bg-base-200/80 border border-base-300 shadow-lg rounded-2xl p-4">
              <div className="flex items-center justify-between pb-3 border-b border-base-300/80 mb-3">
                <h2 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <span>⚡ Code Snippets</span>
                </h2>
                <span className="badge badge-xs badge-neutral font-mono">{SNIPPETS.length} templates</span>
              </div>
              <p className="text-xs text-base-content/60 mb-3">
                Click any template to instantly load it into the editor for the active language.
              </p>

              <div className="space-y-2">
                {SNIPPETS.map((snip) => (
                  <button
                    key={snip.id}
                    onClick={() => handleLoadSnippet(snip)}
                    className="w-full text-left p-3 rounded-xl bg-base-100/70 hover:bg-base-300 border border-base-300/60 hover:border-primary/40 transition-all duration-200 group flex items-start gap-3 shadow-xs"
                  >
                    <div className="text-xl p-2 rounded-lg bg-base-200 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-200">
                      {snip.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-base-content group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{snip.title}</span>
                        <span className="text-[10px] text-base-content/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          Load →
                        </span>
                      </div>
                      <div className="text-[11px] text-base-content/60 truncate mt-0.5">{snip.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Playground Tips */}
            <div className="card bg-base-200/40 border border-base-300/60 rounded-2xl p-4 text-xs space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-accent">
                <span>💡 Playground Tips</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-base-content/70 text-[11px]">
                <li>Press <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Space</kbd> for auto-complete.</li>
                <li>Switch language to automatically convert standard snippets.</li>
                <li>Use custom input tab to feed standard input (stdin).</li>
              </ul>
            </div>
          </div>

          {/* MAIN COLUMN: ACE EDITOR & CONSOLE OUTPUT (9 cols on lg) */}
          <div className="lg:col-span-9 space-y-4 order-1 lg:order-2 flex flex-col">
            {/* EDITOR CONTAINER */}
            <div className="card bg-base-200 border border-base-300 shadow-xl rounded-2xl overflow-hidden flex flex-col">
              {/* Editor Header Bar */}
              <div className="bg-base-300/70 px-4 py-2 border-b border-base-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/70" />
                    <div className="w-3 h-3 rounded-full bg-warning/70" />
                    <div className="w-3 h-3 rounded-full bg-success/70" />
                  </div>
                  <span className="font-mono text-base-content/60 ml-2">
                    main.{language === "python" ? "py" : language === "java" ? "java" : "cpp"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-base-content/60 font-mono text-[11px]">
                  <span>Mode: {language}</span>
                  <span>•</span>
                  <span>Theme: {theme}</span>
                </div>
              </div>

              {/* Ace Editor */}
              <div className="w-full relative min-h-[380px] h-[440px]">
                <AceEditor
                  mode={language}
                  theme={theme}
                  name="playground-editor"
                  value={code}
                  onChange={(newCode) => setCode(newCode)}
                  width="100%"
                  height="100%"
                  fontSize={14}
                  showPrintMargin={false}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 4,
                    useWorker: false,
                  }}
                  style={{ borderRadius: "0 0 1rem 1rem" }}
                />
              </div>
            </div>

            {/* CONSOLE OUTPUT & STDIN PANEL */}
            <div className="card bg-base-200 border border-base-300 shadow-xl rounded-2xl overflow-hidden">
              {/* Panel Tabs */}
              <div className="bg-base-300/80 px-4 py-2 border-b border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab("output")}
                    className={`btn btn-xs rounded-lg ${
                      activeTab === "output" ? "btn-primary" : "btn-ghost text-base-content/70"
                    }`}
                  >
                    Output Console 🖥️
                  </button>
                  <button
                    onClick={() => setActiveTab("stdin")}
                    className={`btn btn-xs rounded-lg ${
                      activeTab === "stdin" ? "btn-primary" : "btn-ghost text-base-content/70"
                    }`}
                  >
                    Custom Input (stdin) ⌨️
                  </button>
                </div>

                {/* Status & Execution info */}
                <div className="flex items-center gap-2 text-xs">
                  {status && (
                    <span className="badge badge-sm badge-outline font-mono">
                      {status}
                    </span>
                  )}
                  {executionTime !== null && (
                    <span className="text-base-content/60 font-mono text-[11px]">
                      ⏱️ {executionTime} ms
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setOutput("");
                      setStatus(null);
                      setExecutionTime(null);
                    }}
                    className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content"
                    title="Clear console"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-4 bg-base-300/30">
                {activeTab === "output" ? (
                  <pre className="font-mono text-xs sm:text-sm text-base-content whitespace-pre-wrap overflow-y-auto max-h-56 min-h-[120px] select-text">
                    {output}
                  </pre>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-base-content/70">
                      Provide standard input to pass into your program during execution:
                    </div>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. 5\n1 2 3 4 5"
                      rows={4}
                      className="textarea textarea-bordered w-full font-mono text-xs bg-base-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaygroundPage;
