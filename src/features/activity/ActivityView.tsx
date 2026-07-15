import type { ActivityEvent } from "../../types/domain";

interface ActivityViewProps {
  activity: ActivityEvent[];
}

export function ActivityView({ activity }: ActivityViewProps) {
  return (
    <section aria-labelledby="activity-heading" className="dashboard-view activity-view">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-header__label">Synthetic source</p>
          <h2 id="activity-heading">Activity timeline</h2>
          <p>
            The activity below is fixture data for the visual shell. It is not collected from your
            machine.
          </p>
        </div>
        <div className="header-meter" aria-label={`${activity.length} synthetic records`}>
          <strong>{activity.length}</strong>
          <span>records</span>
        </div>
      </div>

      <ol className="activity-list">
        {activity.map((event, index) => (
          <li className="activity-item" key={event.id}>
            <div className="activity-item__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="activity-item__content">
              <p className="activity-item__summary">{event.summary}</p>
              <p>{event.detail}</p>
            </div>
            <div className="activity-item__meta">
              <span>{event.category}</span>
              <time>{event.occurredAtLabel}</time>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
