/**
 * BizBot AI — Brand Logo Component
 * Premium SVG logo mark + wordmark.
 * Usage: <Logo size="md" variant="full" /> | <Logo size="sm" variant="mark" />
 */

export default function Logo({ size = "md", variant = "full", className = "" }) {
  const sizes = {
    xs: { mark: 24, text: 13 },
    sm: { mark: 28, text: 14 },
    md: { mark: 36, text: 16 },
    lg: { mark: 48, text: 20 },
    xl: { mark: 64, text: 26 },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Mark */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="bb-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="bb-spark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>

        {/* Background rounded square */}
        <rect width="40" height="40" rx="10" fill="url(#bb-grad)" />

        {/* Subtle inner glow */}
        <rect width="40" height="40" rx="10" fill="white" fillOpacity="0.06" />

        {/* Letter B — vertical stroke */}
        <rect x="11" y="10" width="3.5" height="20" rx="1.75" fill="white" />

        {/* Letter B — top bump */}
        <path
          d="M14.5 10 H21 C23.8 10 26 12 26 14.75 C26 17.5 23.8 19.5 21 19.5 H14.5 V10Z"
          fill="white"
          fillOpacity="0.95"
        />

        {/* Letter B — bottom bump (slightly larger) */}
        <path
          d="M14.5 19.5 H21.5 C24.8 19.5 27.5 21.7 27.5 25 C27.5 28.3 24.8 30 21.5 30 H14.5 V19.5Z"
          fill="white"
        />

        {/* Inner cutouts to make the B look proper */}
        <rect x="15" y="11.5" width="5.8" height="6.5" rx="2.5" fill="url(#bb-grad)" />
        <rect x="15" y="21" width="6.3" height="7.5" rx="3" fill="url(#bb-grad)" />

        {/* Spark dot — top right accent */}
        <circle cx="32" cy="9" r="3" fill="url(#bb-spark)" fillOpacity="0.9" />
        <circle cx="32" cy="9" r="1.5" fill="white" fillOpacity="0.9" />
      </svg>

      {/* Wordmark */}
      {variant === "full" && (
        <div style={{ lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: s.text,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            BizBot
          </span>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: s.text,
              letterSpacing: "-0.03em",
              color: "#4F46E5",
            }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}

/** Standalone icon mark only (no text) */
export function LogoMark({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="bm-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="bm-spark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="10" fill="url(#bm-grad)" />
      <rect width="40" height="40" rx="10" fill="white" fillOpacity="0.06" />
      <rect x="11" y="10" width="3.5" height="20" rx="1.75" fill="white" />
      <path d="M14.5 10 H21 C23.8 10 26 12 26 14.75 C26 17.5 23.8 19.5 21 19.5 H14.5 V10Z" fill="white" fillOpacity="0.95" />
      <path d="M14.5 19.5 H21.5 C24.8 19.5 27.5 21.7 27.5 25 C27.5 28.3 24.8 30 21.5 30 H14.5 V19.5Z" fill="white" />
      <rect x="15" y="11.5" width="5.8" height="6.5" rx="2.5" fill="url(#bm-grad)" />
      <rect x="15" y="21" width="6.3" height="7.5" rx="3" fill="url(#bm-grad)" />
      <circle cx="32" cy="9" r="3" fill="url(#bm-spark)" fillOpacity="0.9" />
      <circle cx="32" cy="9" r="1.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}
