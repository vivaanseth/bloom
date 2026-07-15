interface StatusPillProps {
  label?: string;
  status: string;
}

export function StatusPill({ label, status }: StatusPillProps) {
  return (
    <span className={`status-pill status-pill--${status}`} data-status={status}>
      {label ?? readableStatus(status)}
    </span>
  );
}

function readableStatus(status: string): string {
  return status
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase());
}
