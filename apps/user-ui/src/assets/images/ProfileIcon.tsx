import React from 'react'

export default function ProfileIcon() {
  return (
    <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
    >
        {/* Shopping Bag Handle */}
        <path 
        d="M13 16V10a7 7 0 0 1 14 0v6" 
        fill="none" 
        stroke="#3489FF" 
        strokeWidth="3.5" 
        strokeLinecap="round"
        />
        {/* Shopping Bag Body */}
        <rect x="6" y="15" width="28" height="21" rx="5" fill="#3489FF" />
        {/* The letter 'E' inside the bag */}
        <rect x="15" y="19" width="10" height="2.5" rx="1" fill="white"/>
        <rect x="15" y="24" width="7" height="2.5" rx="1" fill="white"/>
        <rect x="15" y="29" width="10" height="2.5" rx="1" fill="white"/>
        <rect x="15" y="19" width="2.5" height="12.5" rx="1" fill="white"/>
    </svg>
  )
}
