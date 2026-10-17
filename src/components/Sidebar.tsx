import { Link, useParams } from "react-router-dom";

import useFetchProblems from "../hooks/useFetchProblems";

const Sidebar = () => {
  const { problems, error } = useFetchProblems();
  const { id: currentProblemId } = useParams();

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="text-lg font-bold mb-4">Available Problems</li>
          {error && <li className="text-red-500">{error}</li>}
          {problems.map((problem) => (
            <li key={problem._id}>
              <Link
                to={`/problem/${problem._id}`}
                className={`${
                  problem._id === currentProblemId
                    ? "bg-primary text-white"
                    : ""
                }`}
              >
                {problem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
