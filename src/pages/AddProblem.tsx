/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "react-toastify";
import rehypeRaw from "rehype-raw";

import { createProblem } from "../apis/problem.api";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import CodeStubEditor from "../components/CodeStubEditor";
import TestCases from "../components/TestCases";

interface TestCase {
  input: string;
  output: string;
}

export default function AddProblem() {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [codeStubs, setCodeStubs] = useState<any>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [aiTopic, setAiTopic] = useState("arrays and strings");
  const [aiBusy, setAiBusy] = useState(false);

  async function generateWithAI() {
    setAiBusy(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/ai/generate-problem`, { topic: aiTopic, difficulty, language: "python", count: 1 });
      const generated = response.data?.data?.[0];
      if (!generated) throw new Error("No problem was generated.");
      setTitle(generated.title || "");
      setMarkdown(generated.description || "");
      setDifficulty(generated.difficulty || difficulty);
      setCodeStubs(generated.codeStubs || []);
      setTestCases(generated.testCases || []);
      toast.success("AI generated a new problem. Review it before publishing.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Online AI is not configured or the request failed.");
    } finally {
      setAiBusy(false);
    }
  }

  async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await createProblem(
        title,
        markdown,
        codeStubs,
        testCases,
        difficulty
      );
      console.log(response);
      setTitle("");
      setMarkdown("");
      setCodeStubs([]);
      setTestCases([]);
      setDifficulty("easy");
      toast.info("Successfully created the problem!");
    } catch (error) {
      console.log("Something went wrong");
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Create a new problem
      </h1>
      <div className="w-full max-w-4xl p-5 bg-white rounded shadow-lg">
        <form className="grid grid-cols-1 gap-6" onSubmit={onFormSubmit}>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <label className="flex-1">
                <span className="text-sm font-medium text-gray-700">Generate a new practice task with online AI</span>
                <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} className="input input-bordered mt-1 w-full bg-white" placeholder="e.g. sliding window, graphs, SQL" />
              </label>
              <button type="button" className="btn btn-primary" onClick={generateWithAI} disabled={aiBusy}>
                {aiBusy ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-600">Uses the configured online AI only when you request generation. Review the generated statement and tests before publishing.</p>
          </div>

          <label className="block">
            <span className="text-gray-700">Problem Title: </span>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              name="title"
              value={title}
            />
          </label>

          <label>
            <span className="text-gray-700">Problem Description: </span>
            <textarea
              name="description"
              rows={30}
              onChange={(e) => setMarkdown(e.target.value)}
              value={markdown}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </label>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Description Preview
            </h2>
            <div className="mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
              <Markdown
                rehypePlugins={[rehypeRaw]}
                className="prose prose-gray max-w-none prose-headings:text-gray-800 prose-strong:text-gray-800"
              >
                {markdown}
              </Markdown>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              className="select select-bordered w-full"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <CodeStubEditor codeStubs={codeStubs} setCodeStubs={setCodeStubs} />
          <TestCases testCases={testCases} setTestCases={setTestCases} />

          <button className="btn btn-wide btn-info">Submit</button>
        </form>
      </div>
    </div>
  );
}
