/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProblem } from "./apis/problem.api";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSocketConnection } from "./hooks/useSocketConnection";
import Description from "./pages/Description/Description";

function App() {
  const { id } = useParams();
  const [problem, setProblem] = useState<any>(null);
  const socket = useSocketConnection();
  const [fooEvents, setFooEvents] = useState<any>([]);
  console.log(fooEvents);

  useEffect(() => {
    if (id) {
      getProblem(id).then((res) => {
        setProblem(res.data.data);
      });
    }
  }, [id]);

  useEffect(() => {
    const handleFooEvent = (value: any) => {
      setFooEvents((previous: any) => [...previous, value]);
    };

    socket.on("submissionPayloadResponse", handleFooEvent);

    return () => {
      socket.off("submissionPayloadResponse", handleFooEvent);
    };
  }, [socket]);

  if (!problem) return null;

  return (
    <>
      <Navbar />
      <Description
        descriptionText={problem.description}
        testCases={problem.testCases}
        codeStubs={problem.codeStubs}
      />
      <Sidebar />
    </>
  );
}

export default App;
