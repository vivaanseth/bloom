import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import type {
  ActivityEvent,
  LearningState,
  PlatformCapabilities,
  Suggestion,
  SuggestionFeedback,
  SuggestionFeedbackRequest,
} from "../types/domain";

type LearningListener = (state: LearningState) => void;

let mockLearningState: LearningState = {
  isPaused: false,
  pausedReason: null,
};
let mockFeedbackCounter = 0;
const mockLearningListeners = new Set<LearningListener>();

export function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && window.__TAURI_INTERNALS__ !== undefined;
}

async function command<T>(
  name: string,
  args: Record<string, unknown>,
  fallback: () => T,
): Promise<T> {
  if (!isTauriRuntime()) {
    return fallback();
  }

  return invoke<T>(name, args);
}

export async function getPlatformCapabilities(): Promise<PlatformCapabilities> {
  return command("get_platform_capabilities", {}, fallbackCapabilities);
}

export async function getMockSuggestion(): Promise<Suggestion> {
  return command("get_mock_suggestion", {}, fallbackSuggestion);
}

export async function listMockActivity(): Promise<ActivityEvent[]> {
  return command("list_mock_activity", {}, fallbackActivity);
}

export async function getLearningState(): Promise<LearningState> {
  return command("get_learning_state", {}, () => mockLearningState);
}

export async function setLearningPaused(paused: boolean): Promise<LearningState> {
  return command("set_learning_paused", { paused }, () => {
    mockLearningState = {
      isPaused: paused,
      pausedReason: paused ? "Paused by user" : null,
    };
    mockLearningListeners.forEach((listener) => listener(mockLearningState));
    return mockLearningState;
  });
}

export async function respondToMockSuggestion(
  request: SuggestionFeedbackRequest,
): Promise<SuggestionFeedback> {
  return command("respond_to_mock_suggestion", { request }, () => {
    mockFeedbackCounter += 1;
    return {
      id: `feedback-${mockFeedbackCounter}`,
      suggestionId: request.suggestionId,
      feedback: request.feedback,
      snoozeMinutes: request.snoozeMinutes ?? null,
      recordedAtLabel: "Recorded in browser preview",
      actionWasExecuted: false,
    };
  });
}

export async function onLearningStateChanged(
  listener: LearningListener,
): Promise<() => void> {
  if (!isTauriRuntime()) {
    mockLearningListeners.add(listener);
    return () => {
      mockLearningListeners.delete(listener);
    };
  }

  const unlisten = await listen<LearningState>("learning-state-changed", (event) => {
    listener(event.payload);
  });
  return unlisten;
}

export function __resetCompanionApiMock(): void {
  mockLearningState = {
    isPaused: false,
    pausedReason: null,
  };
  mockFeedbackCounter = 0;
  mockLearningListeners.clear();
}

function fallbackCapabilities(): PlatformCapabilities {
  return {
    operatingSystem: "Browser preview",
    systemTray: {
      status: "supported",
      label: "System tray",
      detail: "Implemented in the Rust shell when running under Tauri.",
    },
    transparentWindow: {
      status: "supported",
      label: "Transparent companion window",
      detail: "Configured in Tauri. The browser preview uses a fixed canvas.",
    },
    applicationObservation: {
      status: "unavailable",
      label: "Application observation",
      detail: "Deferred. No real application monitoring is active.",
    },
    terminalIntegration: {
      status: "unavailable",
      label: "Terminal integration",
      detail: "Deferred. No terminal hooks are installed.",
    },
    localPersistence: {
      status: "unavailable",
      label: "SQLite persistence",
      detail: "Deferred to Milestone 3. State resets after restart.",
    },
    ollama: {
      status: "unavailable",
      label: "Ollama",
      detail: "Optional local model support is deferred and disabled.",
    },
  };
}

function fallbackSuggestion(): Suggestion {
  return {
    id: "mock-open-chatgpt-after-edge",
    title: "Open ChatGPT",
    body: "You usually open ChatGPT after Edge in the afternoon.",
    actionLabel: "Open ChatGPT",
    action: {
      kind: "openUrl",
      url: "https://chatgpt.com/",
    },
    status: "ready",
    confidence: 0.72,
    explanation: {
      summary: "Synthetic demo pattern from the visual shell milestone.",
      factors: [
        {
          label: "Previous app",
          detail: "Edge was opened before this suggestion.",
          weight: 0.32,
          synthetic: true,
        },
        {
          label: "Transition frequency",
          detail: "ChatGPT followed Edge in 8 of 10 synthetic examples.",
          weight: 0.28,
          synthetic: true,
        },
        {
          label: "Time bucket",
          detail: "This mock pattern is marked as an afternoon habit.",
          weight: 0.12,
          synthetic: true,
        },
      ],
    },
  };
}

function fallbackActivity(): ActivityEvent[] {
  return [
    {
      id: "synthetic-edge-opened",
      source: "synthetic",
      category: "Application",
      occurredAtLabel: "Today, 2:10 PM",
      summary: "Edge opened",
      detail: "Demo event only. No real application monitoring is active.",
    },
    {
      id: "synthetic-chatgpt-followed",
      source: "synthetic",
      category: "Pattern",
      occurredAtLabel: "Today, 2:12 PM",
      summary: "ChatGPT followed Edge",
      detail: "Synthetic transition used to explain the mock suggestion.",
    },
    {
      id: "synthetic-pause-available",
      source: "synthetic",
      category: "Control",
      occurredAtLabel: "Always available",
      summary: "Pause Learning can be toggled",
      detail: "The toggle changes in-memory state only for this milestone.",
    },
  ];
}
