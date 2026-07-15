import type { LearningState } from "../../types/domain";

interface SettingsViewProps {
  learning: LearningState;
  onPauseChange: (paused: boolean) => Promise<void>;
}

export function SettingsView({ learning, onPauseChange }: SettingsViewProps) {
  return (
    <section aria-labelledby="settings-heading" className="dashboard-view settings-view">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-header__label">Session controls</p>
          <h2 id="settings-heading">Settings</h2>
          <p>
            Only controls that exist in the current milestone are interactive. Future controls are
            shown as disabled commitments.
          </p>
        </div>
      </div>

      <div className="setting-row">
        <div>
          <h3>Pause Learning</h3>
          <p>Stops new learning state changes for this session.</p>
        </div>
        <button
          aria-checked={learning.isPaused}
          aria-label={learning.isPaused ? "Resume learning" : "Pause learning"}
          className="switch"
          onClick={() => void onPauseChange(!learning.isPaused)}
          role="switch"
          type="button"
        >
          <span className="switch__track">
            <span className="switch__thumb" />
          </span>
          <span className="switch__label">
            {learning.isPaused ? "Paused" : "Learning"}
          </span>
        </button>
      </div>

      <div className="settings-stack" aria-label="Deferred settings">
        <div className="setting-row setting-row--disabled">
          <h3>Suggestion frequency</h3>
          <p>Cooldowns and interruption limits start after prediction exists.</p>
          <span>Deferred</span>
        </div>
        <div className="setting-row setting-row--disabled">
          <h3>Reduced motion</h3>
          <p>The shell already respects the system setting. A manual override comes later.</p>
          <span>System</span>
        </div>
        <div className="setting-row setting-row--disabled">
          <h3>Delete learned data</h3>
          <p>Durable storage has not been introduced, so there is nothing to delete yet.</p>
          <span>Deferred</span>
        </div>
      </div>
    </section>
  );
}
