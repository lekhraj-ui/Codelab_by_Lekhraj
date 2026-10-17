import React, { useState } from "react";

interface TestCase {
  input: string;
  output: string;
}

interface TestCasesProps {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
}

const TestCases: React.FC<TestCasesProps> = ({ testCases, setTestCases }) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const addTestCase = () => {
    if (input.trim() && output.trim()) {
      setTestCases([...testCases, { input, output }]);
      setInput("");
      setOutput("");
    }
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Cases</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Input
          </label>
          <textarea
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Output
          </label>
          <textarea
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            value={output}
            onChange={(e) => setOutput(e.target.value)}
          ></textarea>
        </div>
      </div>
      <button
        className="btn btn-primary mb-4"
        onClick={(e) => {
          e.preventDefault();
          addTestCase();
        }}
      >
        Add Test Case
      </button>
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Current Test Cases:
        </h3>
        {testCases.map((testCase, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <p>
              <strong>Input:</strong> {testCase.input}
            </p>
            <p>
              <strong>Output:</strong> {testCase.output}
            </p>
            <button
              className="btn btn-sm btn-error mt-2"
              onClick={(e) => {
                e.preventDefault();
                removeTestCase(index);
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCases;
