import React from 'react';

export const Icons = {
  logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6l-9 12-4.5-9" />
      <path d="M18 6l-2.5 1.5L13 6" />
      <path d="M6 6l2.5 1.5L11 6" />
      <path d="M9 18l2.5-1.5L14 18" />
    </svg>
  ),
};
