
'use client';

import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export const StaticBackground = () => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const blobColor1 = 
    resolvedTheme === 'dark'
      ? 'hsla(195, 83%, 85%, 0.1)'
      : 'hsla(220, 44%, 25%, 0.1)';

  const blobColor2 =
    resolvedTheme === 'dark'
      ? 'hsla(220, 40%, 20%, 0.15)'
      : 'hsla(200, 80%, 50%, 0.1)';
      
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-30 h-full w-full bg-background overflow-hidden">
        <style jsx>{`
            .blob {
                position: absolute;
                border-radius: 50%;
                opacity: 0.5;
                filter: blur(80px);
            }
        `}</style>
      <div 
        className="blob" 
        style={{ 
            backgroundColor: blobColor1, 
            width: '40vw', 
            height: '40vw', 
            top: '-20vw', 
            right: '-20vw',
        }}
      ></div>
      <div 
        className="blob" 
        style={{ 
            backgroundColor: blobColor2, 
            width: '30vw', 
            height: '30vw', 
            bottom: '-15vw', 
            left: '-15vw' 
        }}
      ></div>
    </div>
  );
};
