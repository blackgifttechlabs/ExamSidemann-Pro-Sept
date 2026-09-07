import React from 'react';

interface ThreeStarAiIconProps {
  size?: number;
  className?: string;
}

export const ThreeStarAiIcon: React.FC<ThreeStarAiIconProps> = ({
  size = 20,
  className = 'text-cyan-500',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Center 4-pointed curved star */}
    <path
      d="M12 3.5C12 7.8 8 11.5 3.5 12C8 12.5 12 16.2 12 20.5C12 16.2 16 12.5 20.5 12C16 11.5 12 7.8 12 3.5Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top-right plus sparkle */}
    <path
      d="M19 2.5V6.5M17 4.5H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bottom-left small circle dot */}
    <circle cx="5" cy="19" r="1.75" fill="currentColor" />
  </svg>
);
