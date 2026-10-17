import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App.tsx";
import Login from "./components/Auth/Login.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import AddProblem from "./pages/AddProblem.tsx";
import DailyChallengePage from "./pages/DailyChallengePage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import PlaygroundPage from "./pages/PlaygroundPage.tsx";
import Privacy from "./pages/Privacy.tsx";
import ProblemList from "./pages/ProblemList.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import QuizPage from "./pages/QuizPage.tsx";
import Terms from "./pages/Terms.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/problems",
    element: (
      <ProtectedRoute>
        <ProblemList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/problem/:id",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/addProblem",
    element: (
      <ProtectedRoute>
        <AddProblem />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/leaderboard",
    element: <LeaderboardPage />,
  },
  {
    path: "/playground",
    element: <PlaygroundPage />,
  },
  {
    path: "/quiz",
    element: <QuizPage />,
  },
  {
    path: "/daily",
    element: <DailyChallengePage />,
  },
  {
    path: "/daily-challenge",
    element: <DailyChallengePage />,
  },
  {
    path: "/challenge",
    element: <DailyChallengePage />,
  },
]);

import { RewardProvider } from "./context/RewardContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RewardProvider>
        <RouterProvider router={router} />
        <ToastContainer position="top-right" autoClose={3000} />
      </RewardProvider>
    </AuthProvider>
  </React.StrictMode>
);
