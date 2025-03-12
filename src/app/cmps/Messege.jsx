"use client"
import { useEffect, useRef } from 'react';

export function Message({ role, content }) {
  const messageRef = useRef(null);
  
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content]);

  return (
    <div 
      ref={messageRef}
      className={`p-3 rounded-lg animate-fade-in ${
        role === 'user' 
          ? 'bg-blue-600/30 border border-blue-500/30 ml-12' 
          : 'bg-gray-700/50 border border-gray-600/50 mr-12'
      }`}
    >
      <p className="text-sm text-gray-400 mb-1">
        {role === 'user' ? 'You' : 'Sports Assistant'}
      </p>
      <div className="text-white">{content}</div>
    </div>
  );
}

export function TextStreamMessage({ content }) {
  return <div className="whitespace-pre-wrap">{content}</div>;
}