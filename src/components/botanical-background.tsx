
'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export const BotanicalBackground = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }

  const lineColor = resolvedTheme === 'dark' ? 'hsla(210, 40%, 98%, 0.1)' : 'hsla(220, 44%, 15%, 0.1)';

  return (
    <div className="fixed inset-0 -z-20 h-full w-full overflow-hidden pointer-events-none">
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
                <g id="botanical-art">
                     <path d="M 20 20 C 40 40, 60 40, 80 20" stroke={lineColor} fill="none" strokeWidth="0.5" />
                     <path d="M 50 20 Q 50 50, 80 60" stroke={lineColor} fill="none" strokeWidth="0.5" />
                     <path d="M 50 20 Q 50 50, 20 60" stroke={lineColor} fill="none" strokeWidth="0.5" />
                </g>
            </defs>

            {/* Top Left */}
            <use href="#botanical-art" x="-40" y="-30" transform="scale(0.8)"/>
            
            {/* Bottom Right */}
            <use href="#botanical-art" x="87%" y="85%" transform="scale(1.2) rotate(180)"/>
        </svg>
    </div>
  );
};
