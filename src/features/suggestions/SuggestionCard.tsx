import { useState } from "react";

import { StatusPill } from "../../components/StatusPill";
import type {
  Suggestion,
  SuggestionFeedback,
  SuggestionFeedbackKind,
} from "../../types/domain";

interface SuggestionCardProps {
  lastFeedback: SuggestionFeedback | null;
  onRespond: (feedback: SuggestionFeedbackKind) => Promise<void>;
  suggestion: Suggestion;
}

export function SuggestionCard({
  lastFeedback,
  onRespond,
  suggestion,
}: SuggestionCardProps) {
  const [isExplaining, setIsExplaining] = useState(false);
  const isResolved = suggestion.status !== "ready";

  return (
    <article
      aria-labelledby="suggestion-title"
      aria-live="polite"
      className="speech-bubble suggestion-card"
      data-testid="suggestion-speech-bubble"
      role="status"
    >
      <div className="suggestion-card__header">
        <p className="suggestion-card__label">Suggestion</p>
        <StatusPill
          label={`${Math.round(suggestion.confidence * 100)}%`}
          status={suggestion.status}
        />
      </div>

      <h1 id="suggestion-title">{suggestion.title}</h1>
      <p>{suggestion.body}</p>
      <p className="suggestion-card__preview">
        Action preview: {suggestion.actionLabel}. Feedback is recorded, but no action runs in this milestone.
      </p>

      {lastFeedback ? (
        <p className="suggestion-card__receipt" role="status">
          {feedbackMessage(lastFeedback)}
        </p>
      ) : null}

      <div className="suggestion-card__controls" aria-label="Suggestion controls">
        <button
          className="button button--primary"
          disabled={isResolved}
          onClick={() => void onRespond("accepted")}
          type="button"
        >
          Accept
        </button>
        <button
          className="button"
          disabled={isResolved}
          onClick={() => void onRespond("dismissed")}
          type="button"
        >
          Dismiss
        </button>
        <button
          className="button"
          disabled={isResolved}
          onClick={() => void onRespond("snoozed")}
          type="button"
        >
          Snooze
        </button>
      </div>

      <div className="suggestion-card__secondary-controls">
        <button
          className="link-button"
          onClick={() => setIsExplaining((value) => !value)}
          type="button"
        >
          Why am I seeing this?
        </button>
        <button
          className="link-button"
          disabled={isResolved}
          onClick={() => void onRespond("disabled")}
          type="button"
        >
          Disable this suggestion
        </button>
      </div>

      {isExplaining ? (
        <div className="suggestion-card__why">
          <p>{suggestion.explanation.summary}</p>
          <ul>
            {suggestion.explanation.factors.map((factor) => (
              <li key={factor.label}>
                <span>{factor.label}</span>
                {factor.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function feedbackMessage(feedback: SuggestionFeedback): string {
  switch (feedback.feedback) {
    case "accepted":
      return "Recorded as accepted. No action was run.";
    case "dismissed":
      return "Dismissed for this session.";
    case "snoozed":
      return `Snoozed for ${feedback.snoozeMinutes ?? 15} minutes.`;
    case "disabled":
      return "Disabled for this session.";
  }
}
