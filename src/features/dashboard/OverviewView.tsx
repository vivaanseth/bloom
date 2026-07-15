import { StatusPill } from "../../components/StatusPill";
import type {
  ActivityEvent,
  LearningState,
  PlatformCapabilities,
  Suggestion,
  SuggestionFeedback,
} from "../../types/domain";

interface OverviewViewProps {
  activity: ActivityEvent[];
  capabilities: PlatformCapabilities | null;
  lastFeedback: SuggestionFeedback | null;
  learning: LearningState;
  onPauseChange: (paused: boolean) => Promise<void>;
  suggestion: Suggestion | null;
}

export function OverviewView({
  activity,
  capabilities,
  lastFeedback,
  learning,
  onPauseChange,
  suggestion,
}: OverviewViewProps) {
  const unavailableCount = capabilities
    ? [
        capabilities.applicationObservation,
        capabilities.terminalIntegration,
        capabilities.localPersistence,
        capabilities.ollama,
      ].filter((capability) => capability.status === "unavailable").length
    : 0;

  return (
    <section aria-labelledby="overview-heading" className="dashboard-view overview-view">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-header__label">Private by default</p>
          <h2 id="overview-heading">Companion status</h2>
          <p>
            A quiet shell for suggestions, synthetic activity, and platform limits. No real
            monitoring or execution is active in this milestone.
          </p>
        </div>
        <button
          aria-checked={learning.isPaused}
          aria-label={learning.isPaused ? "Resume learning" : "Pause learning"}
          className="switch switch--compact"
          onClick={() => void onPauseChange(!learning.isPaused)}
          role="switch"
          type="button"
        >
          <span className="switch__track">
            <span className="switch__thumb" />
          </span>
          <span className="switch__label">{learning.isPaused ? "Paused" : "Learning"}</span>
        </button>
      </div>

      <div className="overview-grid">
        <article className="control-panel control-panel--hero">
          <div className="control-panel__topline">
            <span>Learning mode</span>
            <StatusPill
              label={learning.isPaused ? "Paused" : "Session only"}
              status={learning.isPaused ? "paused" : "active"}
            />
          </div>
          <p className="control-panel__statement">
            {learning.isPaused
              ? "Paused for this session. Fixture data stays visible."
              : "In-memory only. Synthetic activity. No execution."}
          </p>
          <dl className="fact-strip">
            <div>
              <dt>Storage</dt>
              <dd>In-memory</dd>
            </div>
            <div>
              <dt>Activity</dt>
              <dd>Synthetic</dd>
            </div>
            <div>
              <dt>Execution</dt>
              <dd>Off</dd>
            </div>
          </dl>
        </article>

        <article className="control-panel">
          <div className="control-panel__topline">
            <span>Current suggestion</span>
            <StatusPill status={suggestion?.status ?? "unavailable"} />
          </div>
          <h3>{suggestion?.title ?? "No suggestion"}</h3>
          <p>{suggestion?.body ?? "The companion is quiet."}</p>
          {lastFeedback ? (
            <p className="inline-receipt" role="status">
              Last feedback: {lastFeedback.feedback}. Action executed: no.
            </p>
          ) : (
            <p className="inline-receipt">Waiting for explicit feedback.</p>
          )}
        </article>

        <article className="control-panel control-panel--plain">
          <h3>Privacy boundary</h3>
          <ul className="boundary-list">
            <li>No screen recording</li>
            <li>No terminal hooks</li>
            <li>No browser history</li>
            <li>No command execution</li>
          </ul>
        </article>

        <article className="control-panel control-panel--plain">
          <div className="control-panel__topline">
            <span>Platform readiness</span>
            <StatusPill
              label={`${unavailableCount} deferred`}
              status={unavailableCount > 0 ? "unavailable" : "supported"}
            />
          </div>
          <p>
            Tray and transparent windows are wired. Observation, persistence, terminal support, and
            Ollama are intentionally deferred.
          </p>
        </article>
      </div>

      <section aria-labelledby="recent-activity-heading" className="activity-preview">
        <div className="section-title-row">
          <h3 id="recent-activity-heading">Recent synthetic activity</h3>
          <span>{activity.length} records</span>
        </div>
        <ol className="compact-timeline">
          {activity.slice(0, 3).map((event) => (
            <li key={event.id}>
              <time>{event.occurredAtLabel}</time>
              <strong>{event.summary}</strong>
              <span>{event.detail}</span>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
