import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { CompanionWindow } from "../features/companion/CompanionWindow";
import { __resetCompanionApiMock } from "../services/companionApi";
import type { LearningState, Suggestion } from "../types/domain";

const activeLearning: LearningState = {
  isPaused: false,
  pausedReason: null,
};

const readySuggestion: Suggestion = {
  id: "speech-bubble-fixture",
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
    ],
  },
};

describe("Bloom shell", () => {
  beforeEach(() => {
    __resetCompanionApiMock();
    window.history.pushState({}, "", "/?surface=dashboard");
  });

  it("records accept feedback without executing the mock action", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/?surface=companion");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Open ChatGPT" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Accept" }));

    expect(await screen.findByText("Recorded as accepted. No action was run.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toBeDisabled();
  });

  it("shows structured explanation and snoozes for a fixed demo duration", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/?surface=companion");

    render(<App />);

    await user.click(await screen.findByRole("button", { name: "Why am I seeing this?" }));

    expect(screen.getByText("Previous app")).toBeInTheDocument();
    expect(screen.getByText("Edge was opened before this suggestion.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Snooze" }));

    expect(await screen.findByText("Snoozed for 15 minutes.")).toBeInTheDocument();
  });

  it("puts the suggestion inside a live speech bubble", () => {
    render(
      <CompanionWindow
        error={null}
        isLoading={false}
        lastFeedback={null}
        learning={activeLearning}
        onRespond={vi.fn().mockResolvedValue(undefined)}
        suggestion={readySuggestion}
      />,
    );

    const bubble = screen.getByTestId("suggestion-speech-bubble");
    expect(bubble).toHaveAttribute("role", "status");
    expect(bubble).toHaveTextContent("Open ChatGPT");
    expect(bubble).toHaveTextContent("Action preview: Open ChatGPT");
  });

  it("keeps Snooze, Disable, and Why controls keyboard-accessible", async () => {
    const user = userEvent.setup();
    const onRespond = vi.fn().mockResolvedValue(undefined);

    render(
      <CompanionWindow
        error={null}
        isLoading={false}
        lastFeedback={null}
        learning={activeLearning}
        onRespond={onRespond}
        suggestion={readySuggestion}
      />,
    );

    const whyButton = screen.getByRole("button", { name: "Why am I seeing this?" });
    whyButton.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Previous app")).toBeInTheDocument();

    const snoozeButton = screen.getByRole("button", { name: "Snooze" });
    snoozeButton.focus();
    await user.keyboard("{Enter}");

    const disableButton = screen.getByRole("button", { name: "Disable this suggestion" });
    disableButton.focus();
    await user.keyboard("{Enter}");

    expect(onRespond).toHaveBeenNthCalledWith(1, "snoozed");
    expect(onRespond).toHaveBeenNthCalledWith(2, "disabled");
  });

  it("prioritizes compact status bubbles over an available suggestion", () => {
    const { rerender } = render(
      <CompanionWindow
        error="Could not load the companion."
        isLoading={true}
        lastFeedback={null}
        learning={activeLearning}
        onRespond={vi.fn().mockResolvedValue(undefined)}
        suggestion={readySuggestion}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Could not load the companion.");
    expect(screen.queryByTestId("suggestion-speech-bubble")).not.toBeInTheDocument();

    rerender(
      <CompanionWindow
        error={null}
        isLoading={true}
        lastFeedback={null}
        learning={activeLearning}
        onRespond={vi.fn().mockResolvedValue(undefined)}
        suggestion={readySuggestion}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Getting the companion ready...");

    rerender(
      <CompanionWindow
        error={null}
        isLoading={false}
        lastFeedback={null}
        learning={{ isPaused: true, pausedReason: "Paused by user" }}
        onRespond={vi.fn().mockResolvedValue(undefined)}
        suggestion={readySuggestion}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Learning is paused. I will stay quiet.");
  });

  it("toggles paused learning from dashboard settings", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(await screen.findByRole("tab", { name: "Settings" }));

    const toggle = screen.getByRole("switch", { name: "Pause learning" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);

    await waitFor(() => {
      expect(screen.getByRole("switch", { name: "Resume learning" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
    expect(screen.getByRole("switch", { name: "Resume learning" })).toHaveTextContent("Paused");
  });

  it("displays honest platform capability status labels", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(await screen.findByRole("tab", { name: "Platform" }));

    expect(await screen.findByText("System tray")).toBeInTheDocument();
    expect(screen.getByText("Application observation")).toBeInTheDocument();
    expect(screen.getAllByText("Unavailable").length).toBeGreaterThan(0);
  });
});
