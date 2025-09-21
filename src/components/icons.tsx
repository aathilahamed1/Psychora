export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className="w-8 h-8"
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <g transform="scale(1.2) translate(-8, -5)">
      {/* Brain shape */}
      <path
        d="M 50,20 C 30,20 20,35 20,50 C 20,65 30,80 50,80 C 60,80 70,75 70,65 C 70,55 60,50 60,40 C 60,30 65,25 70,25 C 75,25 80,30 80,35"
        stroke="url(#logoGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Sprouting Leaf */}
      <path
        d="M 70,25 Q 75,20 80,15"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 80,15 C 78,22 85,25 88,18" fill="url(#logoGradient)" />
    </g>
  </svg>
);
