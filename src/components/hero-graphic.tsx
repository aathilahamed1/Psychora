export const HeroGraphic = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className="w-48 h-48"
  >
    <defs>
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
       <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <g transform="translate(0, 5)" filter="url(#softGlow)">
      {/* Brain shape */}
      <path 
        d="M 50,20 C 30,20 20,35 20,50 C 20,65 30,80 50,80 C 60,80 70,75 70,65 C 70,55 60,50 60,40 C 60,30 65,25 70,25 C 75,25 80,30 80,35"
        stroke="url(#brainGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 50,20 C 55,28 58,40 50,50 C 42,60 45,70 50,80"
        stroke="url(#brainGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
      
      {/* Sprouting Leaf */}
      <path
        d="M 70,25 Q 75,20 80,15"
        stroke="hsl(var(--primary))"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 80,15 C 78,22 85,25 88,18"
        fill="hsl(var(--primary))"
        opacity="0.9"
      />
    </g>
  </svg>
);
