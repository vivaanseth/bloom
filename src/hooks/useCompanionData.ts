import { useEffect, useState } from "react";

import {
  getLearningState,
  getMockSuggestion,
  getPlatformCapabilities,
  listMockActivity,
  onLearningStateChanged,
  respondToMockSuggestion,
  setLearningPaused,
} from "../services/companionApi";
import type {
  ActivityEvent,
  LearningState,
  PlatformCapabilities,
  Suggestion,
  SuggestionFeedback,
  SuggestionFeedbackKind,
  SuggestionStatus,
} from "../types/domain";

interface CompanionData {
  activity: ActivityEvent[];
  capabilities: PlatformCapabilities | null;
  error: string | null;
  isLoading: boolean;
  learning: LearningState;
  lastFeedback: SuggestionFeedback | null;
  respond: (feedback: SuggestionFeedbackKind) => Promise<void>;
  setPaused: (paused: boolean) => Promise<void>;
  suggestion: Suggestion | null;
}

const initialLearningState: LearningState = {
  isPaused: false,
  pausedReason: null,
};

export function useCompanionData(): CompanionData {
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [capabilities, setCapabilities] = useState<PlatformCapabilities | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [learning, setLearning] = useState<LearningState>(initialLearningState);
  const [lastFeedback, setLastFeedback] = useState<SuggestionFeedback | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    let isActive = true;
    let dispose: (() => void) | undefined;

    async function loadData() {
      try {
        const [nextCapabilities, nextSuggestion, nextActivity, nextLearning] =
          await Promise.all([
            getPlatformCapabilities(),
            getMockSuggestion(),
            listMockActivity(),
            getLearningState(),
          ]);

        if (!isActive) {
          return;
        }

        setCapabilities(nextCapabilities);
        setSuggestion(nextSuggestion);
        setActivity(nextActivity);
        setLearning(nextLearning);
        setError(null);
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load companion data.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    async function subscribe() {
      dispose = await onLearningStateChanged((nextLearning) => {
        setLearning(nextLearning);
      });
    }

    loadData();
    subscribe();

    return () => {
      isActive = false;
      dispose?.();
    };
  }, []);

  async function respond(feedback: SuggestionFeedbackKind) {
    if (!suggestion) {
      return;
    }

    const snoozeMinutes = feedback === "snoozed" ? 15 : undefined;
    const recorded = await respondToMockSuggestion({
      suggestionId: suggestion.id,
      feedback,
      snoozeMinutes,
    });
    setLastFeedback(recorded);
    setSuggestion((current) =>
      current
        ? {
            ...current,
            status: feedbackToStatus(feedback),
          }
        : current,
    );
  }

  async function setPaused(paused: boolean) {
    const nextLearning = await setLearningPaused(paused);
    setLearning(nextLearning);
  }

  return {
    activity,
    capabilities,
    error,
    isLoading,
    learning,
    lastFeedback,
    respond,
    setPaused,
    suggestion,
  };
}

function feedbackToStatus(feedback: SuggestionFeedbackKind): SuggestionStatus {
  switch (feedback) {
    case "accepted":
      return "accepted";
    case "dismissed":
      return "dismissed";
    case "snoozed":
      return "snoozed";
    case "disabled":
      return "disabled";
  }
}
