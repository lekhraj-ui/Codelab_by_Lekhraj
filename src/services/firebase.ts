import { API_MODE } from "../config/api";

export const SUBMISSION_LIMIT = 50;

export async function checkAndUpdateSubmissionCount(userId: string): Promise<boolean> {
  if (API_MODE !== "online") {
    const key = `lekhraj-codelab-submissions-${new Date().toISOString().slice(0, 10)}-${userId}`;
    const count = Number(localStorage.getItem(key) || "0");
    if (count >= SUBMISSION_LIMIT) return false;
    localStorage.setItem(key, String(count + 1));
    return true;
  }

  // Online mode: the deployed API is responsible for enforcing server-side limits.
  return true;
}
