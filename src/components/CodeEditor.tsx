import AceEditor from "react-ace";

import Languages from "../constant/Languages";
import Themes from "../constant/Themes";
import SubmissionStatus, {
  SubmissionPhase,
} from "./SubmissionStatus";

interface CodeEditorProps {
  language: string;
  setLanguage: (lang: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  code: string;
  setCode: (code: string) => void;
  handleSubmission: () => void;
  submissionPhase: SubmissionPhase;
  resultStatus?: string | null;
}

function CodeEditor({
  language,
  setLanguage,
  theme,
  setTheme,
  code,
  setCode,
  handleSubmission,
  submissionPhase,
  resultStatus,
}: CodeEditorProps) {
  const isBusy =
    submissionPhase === "submitting" ||
    submissionPhase === "queued" ||
    submissionPhase === "evaluating";

  return (
    <div className="flex-grow flex flex-col min-h-0">
      <div className="flex gap-x-2 justify-start items-center px-4 py-2 relative z-20 shrink-0">
        <button
          type="button"
          className="btn btn-success btn-sm"
          disabled={isBusy}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmission();
          }}
        >
          {isBusy ? (
            <span className="flex items-center gap-2">
              <span className="loading loading-spinner loading-xs" />
              Running
            </span>
          ) : (
            "Submit"
          )}
        </button>
        <button
          type="button"
          className="btn btn-warning btn-sm"
          disabled={isBusy}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmission();
          }}
        >
          Run Code
        </button>
        <select
          className="select select-sm select-info w-full max-w-xs"
          value={language}
          disabled={isBusy}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {Languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.languageName}
            </option>
          ))}
        </select>
        <select
          className="select select-info w-full select-sm max-w-xs"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          {Themes.map((theme) => (
            <option key={theme.value} value={theme.value}>
              {theme.themeName}
            </option>
          ))}
        </select>

        <div className="ml-auto">
          <SubmissionStatus
            phase={submissionPhase}
            resultStatus={resultStatus}
          />
        </div>
      </div>

      <div className="editorContainer flex-grow min-h-0 overflow-hidden relative z-0">
        <AceEditor
          mode={language}
          theme={theme}
          value={code}
          onChange={setCode}
          name="codeEditor"
          className="editor"
          style={{ width: "100%", height: "100%" }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            fontSize: 16,
            readOnly: isBusy,
          }}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
