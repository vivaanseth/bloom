import { CapabilityList } from "../../components/CapabilityList";
import type { CapabilityDetail, PlatformCapabilities } from "../../types/domain";

interface PlatformViewProps {
  capabilities: PlatformCapabilities | null;
}

export function PlatformView({ capabilities }: PlatformViewProps) {
  const capabilityItems: CapabilityDetail[] = capabilities
    ? [
        capabilities.systemTray,
        capabilities.transparentWindow,
        capabilities.applicationObservation,
        capabilities.terminalIntegration,
        capabilities.localPersistence,
        capabilities.ollama,
      ]
    : [];

  return (
    <section aria-labelledby="platform-heading" className="dashboard-view platform-view">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-header__label">
            {capabilities?.operatingSystem ?? "Detecting"}
          </p>
          <h2 id="platform-heading">Platform support</h2>
          <p>
            Support labels are intentionally conservative. A feature is marked supported only when
            this milestone actually wires it.
          </p>
        </div>
      </div>

      {capabilities ? (
        <CapabilityList capabilities={capabilityItems} />
      ) : (
        <p role="status">Loading platform capabilities...</p>
      )}
    </section>
  );
}
