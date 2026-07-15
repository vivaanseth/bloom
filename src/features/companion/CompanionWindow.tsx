import { CompanionCharacter } from "./CompanionCharacter";
import { SuggestionCard } from "../suggestions/SuggestionCard";
import type {
  LearningState,
  Suggestion,
  SuggestionFeedback,
  SuggestionFeedbackKind,
} from "../../types/domain";

interface CompanionWindowProps {
  error: string | null;
  isLoading: boolean;
  lastFeedback: SuggestionFeedback | null;
  learning: LearningState;
  onRespond: (feedback: SuggestionFeedbackKind) => Promise<void>;
  suggestion: Suggestion | null;
}

export function CompanionWindow({
  error,
  isLoading,
  lastFeedback,
  learning,
  onRespond,
  suggestion,
}: CompanionWindowProps) {
  const mood = characterMood(learning, suggestion, lastFeedback);
  const statusBubble = getStatusBubble(error, isLoading, learning);
  const isSpeaking = statusBubble !== null || suggestion !== null;

  return (
    <main className="companion-shell" data-surface="companion">
      <div className="companion-stage" data-speaking={isSpeaking}>
        <div className="companion-drag-region" data-tauri-drag-region="">
          <CompanionCharacter mood={mood} speaking={isSpeaking} />
        </div>
        <div aria-hidden="true" className="companion-corner-dock" />

        {statusBubble ? (
          <p
            className={`speech-bubble speech-bubble--status speech-bubble--${statusBubble.tone}`}
            role={statusBubble.tone === "error" ? "alert" : "status"}
          >
            {statusBubble.message}
          </p>
        ) : null}

        {!statusBubble && suggestion ? (
          <SuggestionCard
            lastFeedback={lastFeedback}
            onRespond={onRespond}
            suggestion={suggestion}
          />
        ) : null}
      </div>
    </main>
  );
}

function getStatusBubble(
  error: string | null,
  isLoading: boolean,
  learning: LearningState,
): { message: string; tone: "error" | "neutral" } | null {
  if (error) {
    return { message: error, tone: "error" };
  }

  if (isLoading) {
    return { message: "Getting the companion ready...", tone: "neutral" };
  }

  if (learning.isPaused) {
    return { message: "Learning is paused. I will stay quiet.", tone: "neutral" };
  }

  return null;
}

function characterMood(
  learning: LearningState,
  suggestion: Suggestion | null,
  lastFeedback: SuggestionFeedback | null,
): "idle" | "suggestion" | "paused" | "accepted" | "muted" {
  if (learning.isPaused) {
    return "paused";
  }

  if (lastFeedback?.feedback === "accepted") {
    return "accepted";
  }

  if (suggestion?.status && suggestion.status !== "ready") {
    return "muted";
  }

  return suggestion ? "suggestion" : "idle";
}
