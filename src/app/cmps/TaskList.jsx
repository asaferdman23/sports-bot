"use client";

import { useEffect, useRef } from 'react';

export function TaskList({ items = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Client-side only code for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div ref={containerRef} className="p-4 bg-blue-50 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">Tasks:</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-start p-2 bg-white rounded border border-blue-100 shadow-sm"
            style={{
              animation: `fade-in 0.3s ease-out forwards`,
              animationDelay: `${index * 0.1}s`,
              opacity: 0
            }}
          >
            <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex-shrink-0 mr-3 mt-0.5"></div>
            <span className="text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 