export type SubmissionPhase =
  | "idle"
  | "submitting"
  | "queued"
  | "evaluating"
  | "completed"
  | "failed";

interface SubmissionStatusProps {
  phase: SubmissionPhase;
  resultStatus?: string | null;
}

function isSuccess(status?: string | null) {
  const s = (status || "").toUpperCase();
  return s === "COMPLETED" || s === "SUCCESS" || s === "AC";
}

export default function SubmissionStatus({
  phase,
  resultStatus,
}: SubmissionStatusProps) {
  if (phase === "idle") return null;

  const isEvaluating =
    phase === "submitting" || phase === "queued" || phase === "evaluating";

  if (isEvaluating) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-medium text-sky-300 ring-1 ring-sky-500/30">
        <span className="loading loading-spinner loading-xs" />
        Evaluating
      </span>
    );
  }

  const success = phase === "completed" && isSuccess(resultStatus);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        success
          ? "bg-green-500/15 text-green-300 ring-green-500/30"
          : "bg-red-500/15 text-red-300 ring-red-500/30"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          success ? "bg-green-400" : "bg-red-400"
        }`}
      />
      Completed
    </span>
  );
}
