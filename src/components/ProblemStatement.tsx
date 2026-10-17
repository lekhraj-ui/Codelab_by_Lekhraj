import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Submissions from "./Submissions";

interface ProblemStatementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sanitizedMarkdown: string;
  submissions: {
    _id: string;
    userId: string;
    problemId: string;
    code: string;
    status: string;
    language: string;
    executionTime: number;
    updatedAt: string;
  }[];
}

function ProblemStatement({
  activeTab,
  setActiveTab,
  sanitizedMarkdown,
  submissions,
}: ProblemStatementProps) {
  const isActiveTab = (tabName: string) => {
    if (activeTab === tabName) {
      return "tab tab-active";
    }
    return "tab";
  };

  return (
    <>
      <div role="tablist" className="tabs tabs-boxed w-3/5">
        <a
          role="tab"
          className={isActiveTab("statement")}
          onClick={() => setActiveTab("statement")}
        >
          Problem Statement
        </a>
        <a
          role="tab"
          className={isActiveTab("editorial")}
          onClick={() => setActiveTab("editorial")}
        >
          Editorial
        </a>
        <a
          role="tab"
          className={isActiveTab("submissions")}
          onClick={() => setActiveTab("submissions")}
        >
          Submissions
        </a>
      </div>

      <div className="content-container p-[20px]">
        {activeTab === "statement" && (
          <div className="markdownViewer">
            <Markdown
              rehypePlugins={[rehypeRaw]}
              className="prose prose-stone max-w-none prose-headings:text-white prose-strong:text-white text-white !important"
            >
              {sanitizedMarkdown}
            </Markdown>
          </div>
        )}
        {activeTab === "submissions" && (
          <Submissions submissions={submissions} />
        )}
      </div>
    </>
  );
}

export default ProblemStatement;
