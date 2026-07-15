type CompanionMood = "idle" | "suggestion" | "paused" | "accepted" | "muted";

interface CompanionCharacterProps {
  mood: CompanionMood;
  speaking: boolean;
}

export function CompanionCharacter({ mood, speaking }: CompanionCharacterProps) {
  return (
    <div
      className={`companion-character companion-character--${mood}`}
      data-speaking={speaking}
    >
      <svg
        aria-label={characterLabel(mood)}
        className="companion-character__svg"
        role="img"
        viewBox="0 0 180 180"
      >
        <defs>
          <linearGradient id="spirit-cloak" x1="48" x2="130" y1="31" y2="152">
            <stop offset="0" stopColor="#edf5ef" />
            <stop offset="0.55" stopColor="#d3e5dc" />
            <stop offset="1" stopColor="#a9cabd" />
          </linearGradient>
          <linearGradient id="spirit-hood" x1="56" x2="126" y1="31" y2="91">
            <stop offset="0" stopColor="#3e8175" />
            <stop offset="1" stopColor="#205d55" />
          </linearGradient>
          <linearGradient id="spirit-face" x1="72" x2="109" y1="63" y2="117">
            <stop offset="0" stopColor="#fffefa" />
            <stop offset="1" stopColor="#d8e7dd" />
          </linearGradient>
          <radialGradient id="spirit-lantern" cx="50%" cy="38%" r="68%">
            <stop offset="0" stopColor="#fff4c4" />
            <stop offset="0.48" stopColor="#e0b961" />
            <stop offset="1" stopColor="#a66a32" />
          </radialGradient>
        </defs>
        <ellipse className="companion-character__shadow" cx="91" cy="159" rx="57" ry="11" />
        <path className="companion-character__left-fin" d="M49 105c-20 4-30 20-24 34 11-2 24-11 32-25Z" />
        <path className="companion-character__right-fin" d="M132 105c20 4 30 20 24 34-11-2-24-11-32-25Z" />
        <path className="companion-character__left-foot" d="M65 145c-7 8-8 15-3 18 8 3 19-2 23-12Z" />
        <path className="companion-character__right-foot" d="M115 145c7 8 8 15 3 18-8 3-19-2-23-12Z" />
        <path
          className="companion-character__cloak"
          d="M90 31c32 1 51 28 48 68l-5 34c-3 18-18 28-43 28s-40-10-43-28l-5-34c-3-40 16-67 48-68Z"
          fill="url(#spirit-cloak)"
        />
        <path className="companion-character__cloak-fold" d="M90 82v69M61 114l17 37M119 114l-17 37" />
        <path
          className="companion-character__hood"
          d="M52 81c3-34 19-53 39-53 22 0 37 19 39 53-10-11-24-17-40-17-16 0-28 5-38 17Z"
          fill="url(#spirit-hood)"
        />
        <path className="companion-character__hood-seam" d="M90 33v21M58 67c12-8 22-12 32-12 11 0 22 4 33 12" />
        <path
          className="companion-character__face"
          d="M61 78c8-10 18-15 29-15 13 0 24 5 31 15v29c-7 12-17 18-31 18-13 0-23-6-29-18Z"
          fill="url(#spirit-face)"
        />
        <ellipse className="companion-character__cheek" cx="70" cy="104" rx="7" ry="3.7" />
        <ellipse className="companion-character__cheek" cx="110" cy="104" rx="7" ry="3.7" />
        <path className="companion-character__brow" d="M69 83c4-3 9-3 13 0M98 83c4-3 9-3 13 0" />
        <ellipse className="companion-character__eye" cx="76" cy="92" rx="5" ry="6.5" />
        <ellipse className="companion-character__eye" cx="104" cy="92" rx="5" ry="6.5" />
        <circle className="companion-character__eye-glint" cx="78" cy="90" r="1.5" />
        <circle className="companion-character__eye-glint" cx="106" cy="90" r="1.5" />
        <path className="companion-character__eyelid" d="M68 91c4-5 12-5 16 0M96 91c4-5 12-5 16 0" />
        <path
          className="companion-character__mouth"
          d="M78 111c6 5 17 5 24 0"
          fill="none"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path className="companion-character__lantern-ribbon" d="M90 124v18" />
        <circle className="companion-character__lantern" cx="90" cy="128" r="10" fill="url(#spirit-lantern)" />
        <path className="companion-character__lantern-mark" d="M86 128h8M90 124v8" />
        <path className="companion-character__signal" d="M130 63c10 6 16 16 17 28" />
      </svg>
    </div>
  );
}

function characterLabel(mood: CompanionMood): string {
  const labels: Record<CompanionMood, string> = {
    idle: "Companion resting in its corner dock",
    suggestion: "Companion has a suggestion",
    paused: "Companion is paused",
    accepted: "Companion recorded an accepted suggestion",
    muted: "Companion is staying quiet",
  };

  return labels[mood];
}
