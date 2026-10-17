export default [
  {
    languageName: "CPP",
    value: "c_cpp",
    backendLanguage: "CPP",
  },
  {
    languageName: "Java",
    value: "java",
    backendLanguage: "JAVA",
  },
  {
    languageName: "Python",
    value: "python",
    backendLanguage: "PYTHON",
  },
];

/** Map Ace editor language id (or any alias) to backend stub language enum. */
export function toBackendLanguage(language: string): string {
  const lower = language.toLowerCase();
  if (lower === "c_cpp" || lower === "cpp" || lower === "c++") return "CPP";
  if (lower === "java") return "JAVA";
  if (lower === "python") return "PYTHON";
  return language.toUpperCase();
}
