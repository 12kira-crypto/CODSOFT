/**
 * PaceRing — the app's signature progress indicator.
 * A circular ring instead of the generic linear progress bar; used on
 * project cards and the project detail header to show completion.
 */
export default function PaceRing({ percent = 0, size = 48, stroke = 4, label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <div className="pace-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="pace-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="pace-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="pace-ring-label" style={{ fontSize: size * 0.26 }}>
        {label !== undefined ? label : `${percent}%`}
      </span>
    </div>
  );
}
