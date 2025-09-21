
'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const particleColor =
    resolvedTheme === 'dark'
      ? 'hsla(195, 83%, 85%, 0.2)'
      : 'hsla(220, 44%, 25%, 0.2)';
      
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
        <style jsx>{`
            #particles-js {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
            }
            .particle {
                position: absolute;
                border-radius: 50%;
                background-color: ${particleColor};
                animation: float 25s infinite linear;
                opacity: 0;
            }
            @keyframes float {
                0% {
                transform: translateY(100vh);
                opacity: 0;
                }
                10% {
                opacity: 1;
                }
                90% {
                opacity: 1;
                }
                100% {
                transform: translateY(-10vh);
                opacity: 0;
                }
            }
        `}</style>

      <div id="particles-js">
        {Array.from({ length: 30 }).map((_, i) => {
          const size = Math.random() * 4 + 1;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 20 + 15;
          const animationDelay = Math.random() * -25;
          return (
            <div
              key={i}
              className="particle"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}vw`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export { AnimatedBackground };
