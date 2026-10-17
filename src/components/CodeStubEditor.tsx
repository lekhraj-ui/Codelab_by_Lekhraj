import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";

import React, { useState } from "react";
import AceEditor from "react-ace";

import Languages from "../constant/Languages";

interface CodeStub {
  language: string;
  startSnippet: string;
  userSnippet: string;
  endSnippet: string;
}

interface CodeStubEditorProps {
  codeStubs: CodeStub[];
  setCodeStubs: React.Dispatch<React.SetStateAction<CodeStub[]>>;
}

const CodeStubEditor: React.FC<CodeStubEditorProps> = ({
  codeStubs,
  setCodeStubs,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(Languages[0].value);
  const [currentStartSnippet, setCurrentStartSnippet] = useState("");
  const [currentUserSnippet, setCurrentUserSnippet] = useState("");
  const [currentEndSnippet, setCurrentEndSnippet] = useState("");

  const getBackendLanguage = (aceValue: string) => {
    const lang = Languages.find((l) => l.value === aceValue);
    return lang?.backendLanguage ?? aceValue.toUpperCase();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    const backendLang = getBackendLanguage(e.target.value);
    const existingStub = codeStubs.find(
      (stub) => stub.language === backendLang
    );
    setCurrentStartSnippet(existingStub ? existingStub.startSnippet : "");
    setCurrentUserSnippet(existingStub ? existingStub.userSnippet : "");
    setCurrentEndSnippet(existingStub ? existingStub.endSnippet : "");
  };

  const addOrUpdateCodeStub = () => {
    const backendLang = getBackendLanguage(selectedLanguage);
    const updatedStubs = codeStubs.filter(
      (stub) => stub.language !== backendLang
    );
    updatedStubs.push({
      language: backendLang,
      startSnippet: currentStartSnippet,
      userSnippet: currentUserSnippet,
      endSnippet: currentEndSnippet,
    });
    setCodeStubs(updatedStubs);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Code Stubs</h2>
      <div className="flex items-center mb-4">
        <select
          className="select select-bordered w-full max-w-xs mr-4"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {Languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.languageName}
            </option>
          ))}
        </select>
        <button
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            addOrUpdateCodeStub();
          }}
        >
          Add/Update Stub
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Start Snippet</h3>
        <AceEditor
          mode={selectedLanguage}
          theme="monokai"
          onChange={setCurrentStartSnippet}
          name="start-snippet-editor"
          editorProps={{ $blockScrolling: true }}
          value={currentStartSnippet}
          width="100%"
          height="150px"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">User Snippet (Editable)</h3>
        <AceEditor
          mode={selectedLanguage}
          theme="monokai"
          onChange={setCurrentUserSnippet}
          name="user-snippet-editor"
          editorProps={{ $blockScrolling: true }}
          value={currentUserSnippet}
          width="100%"
          height="150px"
        />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">End Snippet</h3>
        <AceEditor
          mode={selectedLanguage}
          theme="monokai"
          onChange={setCurrentEndSnippet}
          name="end-snippet-editor"
          editorProps={{ $blockScrolling: true }}
          value={currentEndSnippet}
          width="100%"
          height="150px"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Current Code Stubs:
        </h3>
        <ul className="list-disc pl-5">
          {codeStubs.map((stub) => (
            <li key={stub.language}>{stub.language}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CodeStubEditor;
