export type CapabilityStatus =
  | "supported"
  | "beta"
  | "experimental"
  | "unavailable";

export interface CapabilityDetail {
  status: CapabilityStatus;
  label: string;
  detail: string;
}

export interface PlatformCapabilities {
  operatingSystem: string;
  systemTray: CapabilityDetail;
  transparentWindow: CapabilityDetail;
  applicationObservation: CapabilityDetail;
  terminalIntegration: CapabilityDetail;
  localPersistence: CapabilityDetail;
  ollama: CapabilityDetail;
}

export type RegisteredAction =
  | {
      kind: "openApplication";
      identifier: string;
    }
  | {
      kind: "openUrl";
      url: string;
    }
  | {
      kind: "runApprovedCommand";
      commandId: string;
      arguments: string[];
    }
  | {
      kind: "launchRoutine";
      routineId: string;
    };

export interface PredictionFactor {
  label: string;
  detail: string;
  weight: number;
  synthetic: boolean;
}

export interface PredictionExplanation {
  summary: string;
  factors: PredictionFactor[];
}

export type SuggestionStatus =
  | "ready"
  | "accepted"
  | "dismissed"
  | "snoozed"
  | "disabled";

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  actionLabel: string;
  action: RegisteredAction;
  status: SuggestionStatus;
  confidence: number;
  explanation: PredictionExplanation;
}

export type SuggestionFeedbackKind =
  | "accepted"
  | "dismissed"
  | "snoozed"
  | "disabled";

export interface SuggestionFeedbackRequest {
  suggestionId: string;
  feedback: SuggestionFeedbackKind;
  snoozeMinutes?: number;
}

export interface SuggestionFeedback {
  id: string;
  suggestionId: string;
  feedback: SuggestionFeedbackKind;
  snoozeMinutes: number | null;
  recordedAtLabel: string;
  actionWasExecuted: boolean;
}

export interface ActivityEvent {
  id: string;
  source: string;
  category: string;
  occurredAtLabel: string;
  summary: string;
  detail: string;
}

export interface LearningState {
  isPaused: boolean;
  pausedReason: string | null;
}
