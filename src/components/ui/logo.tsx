import React from 'react';
import Image from 'next/image';

export function Logo({ className = "", width = 24, height = 24 }: { className?: string; width?: number; height?: number }) {
  return (
    <div style={{ width, height }} className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Clove's Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}
