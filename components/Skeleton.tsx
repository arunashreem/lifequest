
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "relative overflow-hidden bg-slate-900/50 border border-white/5";
  const animationClasses = "after:absolute after:inset-0 after:-translate-x-full after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent after:animate-[shimmer_2s_infinite]";
  const shapeClasses = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded-md h-4' : 'rounded-[1.5rem]';

  return (
    <div className={`${baseClasses} ${animationClasses} ${shapeClasses} ${className}`}>
      {/* Subtle Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
    </div>
  );
};

export default Skeleton;
