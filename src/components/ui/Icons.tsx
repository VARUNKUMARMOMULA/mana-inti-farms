import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// 🐔 Country Hen Icon
export const HenIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Body outline */}
    <path d="M4 14c0 2 1.5 4 4 4c2.5 0 5-1.5 7-3c3.5 1.5 5 1 5-2c0-2-1-4.5-3-5.5" />
    {/* Tail feathers */}
    <path d="M3 10c0.5-2 1.5-3.5 3-4c-0.5 1.5-0.5 3.5 0 5" />
    <path d="M2 13c1-2 2-3 4-3" />
    {/* Neck and Head */}
    <path d="M15 13c1-2 1.5-5 3-6.5c1-1 2-0.5 2.5 0.5c0.5 1 0.5 2-0.5 3" />
    {/* Beak */}
    <path d="M21 7.5l2 0.5l-2 1" />
    {/* Comb (Crest) */}
    <path d="M18.5 6.5c-0.5-1.5 0.5-2.5 1-2.5c0.5 1 0.5 2 0 2.5" fill="currentColor" opacity="0.8" />
    <path d="M17.5 7c-0.5-1 0-2 0.5-2" />
    {/* Eye */}
    <circle cx="19.2" cy="7.8" r="0.8" fill="currentColor" />
    {/* Wattle (under beak) */}
    <path d="M20.5 9.5c0 1-0.5 1.5-1 1.5s-0.5-0.5-0.5-1.5" fill="currentColor" opacity="0.8" />
    {/* Legs */}
    <path d="M9 18v3" />
    <path d="M8 21h2" />
    <path d="M12 17.5v3.5" />
    <path d="M11 21h2" />
  </svg>
);

// 🥚 Egg Basket Icon
export const BasketIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Basket Handle */}
    <path d="M6 10c0-6 12-6 12 0" />
    {/* Basket Body */}
    <path d="M3 10h18l-1.5 8c-0.3 1.5-1.5 3-3 3H7.5c-1.5 0-2.7-1.5-3-3L3 10z" />
    {/* Basket Weave lines */}
    <path d="M7 10v11" />
    <path d="M12 10v11" />
    <path d="M17 10v11" />
    <path d="M3.5 14h17" />
    <path d="M4 18h16" />
    {/* Eggs inside basket */}
    <path d="M8 10c0-1.5 1-3 2.5-3s2.5 1.5 2.5 3" fill="currentColor" fillOpacity="0.1" />
    <path d="M11.5 10c0-1.8 1.2-3.5 3-3.5s3 1.7 3 3.5" fill="currentColor" fillOpacity="0.1" />
  </svg>
);

// 🌿 Fresh Leaves Icon
export const LeafIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Main Leaf */}
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1 -9 8.2z" />
    {/* Leaf Stem */}
    <path d="M19 2c-2.2 2.2-6 6-11 15" />
    {/* Leaf Veins */}
    <path d="M10 11c1.5-.5 3-.5 4.5-1" />
    <path d="M12.5 8.5c1-.5 2.5-.5 3.5-1" />
    <path d="M8 13.5c1.2-.3 2.5-.3 3.5-.8" />
  </svg>
);

// 🌾 Wheat / Grain Icon
export const WheatIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Stem */}
    <path d="M4 22c4-4 6-10 6-18" />
    {/* Grains (left & right) */}
    <path d="M10 4c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5c1 1 2.5 1 3.5 0" />
    <path d="M10 4c1-1 2.5-1 3.5 0s1 2.5 0 3.5c-1 1-2.5 1-3.5 0" />
    
    <path d="M9.5 8c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5c1 1 2.5 1 3.5 0" />
    <path d="M9.5 8c1-1 2.5-1 3.5 0s1 2.5 0 3.5c-1 1-2.5 1-3.5 0" />
    
    <path d="M9 12c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5c1 1 2.5 1 3.5 0" />
    <path d="M9 12c1-1 2.5-1 3.5 0s1 2.5 0 3.5c-1 1-2.5 1-3.5 0" />

    <path d="M8.5 16c-1-1-2.5-1-3.5 0s-1 2.5 0 3.5c1 1 2.5 1 3.5 0" />
    <path d="M8.5 16c1-1 2.5-1 3.5 0s1 2.5 0 3.5c-1 1-2.5 1-3.5 0" />
  </svg>
);

// 🏪 Farm Barn Icon
export const FarmIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Roof */}
    <path d="M2 11L12 3l10 8" />
    {/* Main Barn structure */}
    <path d="M4 11v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9" />
    {/* Barn Door */}
    <path d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
    {/* Barn Door Cross braces (traditional X door) */}
    <path d="M9 14l6 7" />
    <path d="M15 14l-6 7" />
    {/* Loft window */}
    <circle cx="12" cy="7.5" r="1.5" />
  </svg>
);

// 🥚 Simple Egg Icon
export const EggIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
    {...props}
  >
    {/* Egg Shape */}
    <path
      d="M12 2C7.5 2 4 7 4 12c0 4.5 3.5 8 8 8s8-3.5 8-8c0-5-3.5-10-8-10z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 🍖 Chicken Leg / Meat Icon
export const ChickenMeatIcon = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Meat part */}
    <path d="M15 3c-4.5 0-9 4.5-9 9c0 1.8.8 3.5 2 4.5c0.5 0.4 1 0.5 1 1.5c0 1.5-1 3.5-3 3.5s-2.5-1-2.5-2.5" />
    <path d="M15 3c4.5 0 6 3 6 6s-1.5 6.5-6 7.5" />
    {/* Bone part */}
    <path d="M9.5 16.5l-3.5 3.5" />
    {/* Bone joints */}
    <circle cx="5" cy="21" r="1.5" />
    <circle cx="3.5" cy="19.5" r="1.5" />
  </svg>
);
