import { StatusPill } from "./StatusPill";
import type { CapabilityDetail } from "../types/domain";

interface CapabilityListProps {
  capabilities: CapabilityDetail[];
}

export function CapabilityList({ capabilities }: CapabilityListProps) {
  return (
    <dl className="capability-list">
      {capabilities.map((capability) => (
        <div className="capability-row" data-status={capability.status} key={capability.label}>
          <dt>
            <span>{capability.label}</span>
            <StatusPill status={capability.status} />
          </dt>
          <dd>{capability.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
