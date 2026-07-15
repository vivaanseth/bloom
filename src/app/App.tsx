import { getCurrentWindow } from "@tauri-apps/api/window";
import { useMemo, useState } from "react";

import { CompanionWindow } from "../features/companion/CompanionWindow";
import { ActivityView } from "../features/activity/ActivityView";
import { OverviewView } from "../features/dashboard/OverviewView";
import { PlatformView } from "../features/settings/PlatformView";
import { SettingsView } from "../features/settings/SettingsView";
import { isTauriRuntime } from "../services/companionApi";
import { useCompanionData } from "../hooks/useCompanionData";

type Surface = "companion" | "dashboard";
type DashboardTab = "overview" | "activity" | "settings" | "platform";

const dashboardTabs: Array<{ id: DashboardTab; label: string; description: string }> = [
  {
    id: "overview",
    label: "Overview",
    description: "Session state",
  },
  {
    id: "activity",
    label: "Activity",
    description: "Synthetic log",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Learning controls",
  },
  {
    id: "platform",
    label: "Platform",
    description: "Support matrix",
  },
];

export default function App() {
  const surface = useMemo(detectSurface, []);
  const data = useCompanionData();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  if (surface === "companion") {
    return (
      <CompanionWindow
        error={data.error}
        isLoading={data.isLoading}
        lastFeedback={data.lastFeedback}
        learning={data.learning}
        onRespond={data.respond}
        suggestion={data.suggestion}
      />
    );
  }

  return (
    <main className="dashboard-shell" data-surface="dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand__mark" aria-hidden="true">
            bl
          </div>
          <div>
            <p>Bloom</p>
            <h1>Local control</h1>
          </div>
        </div>

        <nav aria-label="Dashboard sections" className="dashboard-tabs" role="tablist">
          {dashboardTabs.map((tab) => (
            <button
              aria-label={tab.label}
              aria-selected={activeTab === tab.id}
              className="dashboard-tab"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              type="button"
            >
              <span>{tab.label}</span>
              <small>{tab.description}</small>
            </button>
          ))}
        </nav>

        <div className="dashboard-sidebar__footer">
          <span>Milestone shell</span>
          <strong>{data.learning.isPaused ? "Paused" : "Ready"}</strong>
        </div>
      </aside>

      <section className="dashboard-content">
        {data.error ? (
          <p className="dashboard-error" role="alert">
            {data.error}
          </p>
        ) : null}
        {activeTab === "overview" ? (
          <OverviewView
            activity={data.activity}
            capabilities={data.capabilities}
            lastFeedback={data.lastFeedback}
            learning={data.learning}
            onPauseChange={data.setPaused}
            suggestion={data.suggestion}
          />
        ) : null}
        {activeTab === "activity" ? <ActivityView activity={data.activity} /> : null}
        {activeTab === "settings" ? (
          <SettingsView learning={data.learning} onPauseChange={data.setPaused} />
        ) : null}
        {activeTab === "platform" ? (
          <PlatformView capabilities={data.capabilities} />
        ) : null}
      </section>
    </main>
  );
}

function detectSurface(): Surface {
  const querySurface = new URLSearchParams(window.location.search).get("surface");
  if (querySurface === "companion" || querySurface === "dashboard") {
    return querySurface;
  }

  if (isTauriRuntime()) {
    const label = getCurrentWindow().label;
    return label === "dashboard" ? "dashboard" : "companion";
  }

  return "dashboard";
}
