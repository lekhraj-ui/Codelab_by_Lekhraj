import axios from "axios";
import { API_BASE_URL } from "../config/api";

export async function createProblem(problemTitle: string, problemDescription: string, codeStubs: {language:string;startSnippet:string;userSnippet:string;endSnippet:string}[], testCases:{input:string;output:string}[], difficulty:string) {
  return axios.post(`${API_BASE_URL}/api/v1/problems`, { title: problemTitle, description: problemDescription, codeStubs, testCases, difficulty });
}
export async function getProblem(problemId:string) { return axios.get(`${API_BASE_URL}/api/v1/problems/${problemId}`); }
export async function getUserSubmissions(userId:string, problemId:string) { return axios.get(`${API_BASE_URL}/api/v1/submissions/user/${userId}/problem/${problemId}`); }
