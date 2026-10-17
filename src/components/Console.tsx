interface ConsoleProps {
  testCaseTab: string;
  setTestCaseTab: (tab: string) => void;
  currentTestCase: {
    input: string;
    output: string;
  };
  responseData: {
    output: string;
    status: string;
  } | null;
}

function Console({
  testCaseTab,
  setTestCaseTab,
  currentTestCase,
  responseData,
}: ConsoleProps) {
  const isInputTabActive = (tabName: string) => {
    if (testCaseTab === tabName) {
      return "tab tab-active";
    }
    return "tab";
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "WA":
        return "Wrong Answer";
      case "AC":
      case "COMPLETED":
      case "SUCCESS":
        return "Correct";
      case "TLE":
        return "Time Limit Exceeded";
      case "MLE":
        return "Memory Limit Exceeded";
      case "RE":
      case "ERROR":
        return "Runtime Error";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WA":
        return "text-red-500";
      case "AC":
      case "COMPLETED":
      case "SUCCESS":
        return "text-green-500";
      case "TLE":
      case "MLE":
      case "RE":
      case "ERROR":
        return "text-yellow-500";
      default:
        return "text-white";
    }
  };

  return (
    <div className="bg-base-300">
      <div className="bg-primary text-primary-content p-2">Console</div>
      <div className="bg-primary text-primary-content p-4">
        <div role="tablist" className="tabs tabs-boxed w-3/5 mb-4">
          <a
            onClick={() => setTestCaseTab("testCase")}
            role="tab"
            className={isInputTabActive("testCase")}
          >
            Test Case
          </a>
          <a
            onClick={() => setTestCaseTab("result")}
            role="tab"
            className={isInputTabActive("result")}
          >
            Test Result
          </a>
        </div>
        {testCaseTab === "testCase" ? (
          <div className="bg-neutral text-neutral-content p-4 rounded-sm space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Input:</h3>
              <pre>{currentTestCase.input}</pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Expected Output:</h3>
              <pre>{currentTestCase.output}</pre>
            </div>
          </div>
        ) : (
          <div className="bg-neutral text-neutral-content p-4 rounded-sm">
            {responseData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Status:</h3>
                  <p
                    className={`font-bold ${getStatusColor(
                      responseData.status
                    )}`}
                  >
                    {getStatusDisplay(responseData.status)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Input:</h3>
                  <pre>{currentTestCase.input}</pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Your Output:</h3>
                  <pre>{responseData.output}</pre>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expected Output:</h3>
                  <pre>{currentTestCase.output}</pre>
                </div>
              </div>
            ) : (
              <p>No test results available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Console;
