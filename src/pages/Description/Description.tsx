/* eslint-disable simple-import-sort/imports  */
import { DragEvent, useEffect } from "react";
import { useState } from "react";
import DOMPurify from "dompurify";

// First import ace core
import "ace-builds/src-noconflict/ace";

// Then import mode-xxx files
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";

// Then import themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

// Finally import extensions
import "ace-builds/src-noconflict/ext-language_tools";

import axios from "axios";
import { socket } from "../../socket"; // Ensure you have the correct path to your socket instance
import ProblemStatement from "../../components/ProblemStatement";
import CodeEditor from "../../components/CodeEditor";
import Console from "../../components/Console";
import { useAuth } from "../../context/AuthContext";
import {
  checkAndUpdateSubmissionCount,
  SUBMISSION_LIMIT,
} from "../../services/firebase";
import { toast } from "react-toastify";
import SubmissionLimit from "../../components/SubmissionLimit";
import AIChatInterface from "../../components/AIChatInterface";
import { getUserSubmissions } from "../../apis/problem.api";
import { toBackendLanguage } from "../../constant/Languages";
import { SubmissionPhase } from "../../components/SubmissionStatus";

interface TestCase {
  input: string;
  output: string;
}

interface DescriptionProps {
  descriptionText: string;
  testCases: TestCase[];
  codeStubs: {
    language: string;
    startSnippet: string;
    userSnippet: string;
    endSnippet: string;
  }[];
}

import { API_BASE_URL } from "../../config/api";
const SUBMISSION_SERVICE_URL = API_BASE_URL;

interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  status: string;
  language: string;
  executionTime: number;
  updatedAt: string;
}

function Description({
  descriptionText,
  testCases,
  codeStubs,
}: DescriptionProps) {
  const sanitizedMarkdown = DOMPurify.sanitize(descriptionText);
  const [activeTab, setActiveTab] = useState("statement");
  const [testCaseTab, setTestCaseTab] = useState("testCase");
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("monokai");
  const [code, setCode] = useState("");
  const [responseData, setResponseData] = useState<{
    output: string;
    status: string;
  } | null>(null);
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [submissionPhase, setSubmissionPhase] =
    useState<SubmissionPhase>("idle");

  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleSubmissionResponse = (data: {
      response: {
        output: string;
        status: string;
      };
    }) => {
      setResponseData(data.response);
      setTestCaseTab("result");
      setSubmissionPhase(
        ["WA", "RE", "ERROR", "TLE", "MLE"].includes(
          (data.response.status || "").toUpperCase()
        )
          ? "failed"
          : "completed"
      );

      // Refresh submissions list so status moves off Pending
      if (user) {
        const problemId = window.location.pathname.split("/")[2];
        getUserSubmissions(user.uid, problemId)
          .then((result) => setSubmissions(result.data))
          .catch(() => {
            /* ignore refresh errors */
          });
      }
    };

    socket.on("submissionPayloadResponse", handleSubmissionResponse);

    return () => {
      socket.off("submissionPayloadResponse", handleSubmissionResponse);
    };
  }, [user]);

  useEffect(() => {
    const currentStub = codeStubs.find(
      (stub) => toBackendLanguage(stub.language) === toBackendLanguage(language)
    );
    if (currentStub) {
      setCode(currentStub.userSnippet);
    }
  }, [language, codeStubs]);

  useEffect(() => {
    async function fetchSubmissions() {
      if (isUserLoading) return;
      if (!user) {
        return;
      }

      try {
        const problemId = window.location.pathname.split("/")[2];

        const data = await getUserSubmissions(user.uid, problemId);
        setSubmissions(data.data);
        console.log(data);
      } catch (error) {
        toast.error("Failed to load submissions");
      }
    }

    if (activeTab === "submissions") {
      fetchSubmissions();
    }
  }, [user, activeTab, isUserLoading]);

  async function handleSubmission() {
    console.log("handleSubmission clicked", {
      hasUser: !!user,
      SUBMISSION_SERVICE_URL,
      language,
    });

    try {
      if (!user) {
        toast.error("Please log in to submit code");
        return;
      }

            if (
        submissionPhase === "submitting" ||
        submissionPhase === "queued" ||
        submissionPhase === "evaluating"
      ) {
        return;
      }

      const canSubmit = await checkAndUpdateSubmissionCount(user.uid);

      if (!canSubmit) {
        toast.error(
          `You've reached your daily limit of ${SUBMISSION_LIMIT} submissions`
        );
        return;
      }

      const problemID = window.location.pathname.split("/")[2];
      if (!problemID) {
        toast.error("Could not determine problem id");
        return;
      }

      setTestCaseTab("result");
      setResponseData(null);
      setSubmissionPhase("evaluating");

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/submissions`,
        {
          code,
          language,
          userID: user.uid,
          problemID,
        }
      );

      console.log("Submission API response:", response.data);
      return response;
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionPhase("failed");
      toast.error("Something went wrong with your submission");
    }
  }

  const startDragging = (e: DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const stopDragging = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newLeftWidth = (e.clientX / window.innerWidth) * 100;
    if (newLeftWidth > 10 && newLeftWidth < 90) {
      setLeftWidth(newLeftWidth);
    }
  };

  return (
    <div>
      <SubmissionLimit />
      <div
        className="flex w-screen h-screen"
        onMouseMove={onDrag}
        onMouseUp={stopDragging}
      >
        <div
          className="leftPanel h-full overflow-auto"
          style={{ width: `${leftWidth}%` }}
        >
          <ProblemStatement
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            sanitizedMarkdown={sanitizedMarkdown}
            submissions={submissions}
          />
        </div>

        <div
          className="divider cursor-col-resize w-[5px] bg-slate-200 h-full"
          onMouseDown={startDragging}
        ></div>

        <div
          className="rightPanel h-full overflow-hidden flex flex-col min-h-0"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            code={code}
            setCode={setCode}
            handleSubmission={handleSubmission}
            submissionPhase={submissionPhase}
            resultStatus={responseData?.status}
          />
          <AIChatInterface problemId={window.location.pathname.split("/")[2] || ""} code={code} language={language} />
          <Console
            testCaseTab={testCaseTab}
            setTestCaseTab={setTestCaseTab}
            currentTestCase={testCases[0]}
            responseData={responseData}
          />
        </div>
      </div>
    </div>
  );
}

export default Description;
