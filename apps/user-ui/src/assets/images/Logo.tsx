// components/Logo.jsx
import React from 'react';

export default function Logo({ width = 45, height = 45 }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 120 120" 
      width={width} 
      height={height} 
      fill="none"
      className="shrink-0"
    >
      <path d="M20 50 L100 50 L106 95 C107 105 100 112 90 112 L30 112 C20 112 13 105 14 95 Z" fill="#E8F2FF" />
      <path d="M40 50 V35 C40 20 80 20 80 35 V50" stroke="#3489FF" strokeWidth="10" strokeLinecap="round" />
      <path d="M36 65 H84" stroke="#3489FF" strokeWidth="10" strokeLinecap="round" />
      <path d="M36 82 H70" stroke="#3489FF" strokeWidth="10" strokeLinecap="round" />
      <path d="M36 99 H84" stroke="#3489FF" strokeWidth="10" strokeLinecap="round" />
      <path d="M36 65 V99" stroke="#3489FF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}