// app/page.js
"use client";

import { useState } from "react";
import "./styles/animations.css";
import ChatMessage from "./cmps/ChatMessege";
import SuggestedAction from "./cmps/SuggestedAction";
import LoadingIndicator from "./cmps/LoadingIndicatior";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Suggested actions for sports-related queries
  const suggestedActions = [
    { title: "Give me", label: "a workout plan", action: "Give me a workout plan for beginners" },
    { title: "Show me", label: "some stretching exercises", action: "Show me some stretching exercises" },
    { title: "What are", label: "benefits of running?", action: "What are the benefits of running?" },
    { title: "Motivate me", label: "to exercise today", action: "I need motivation to exercise today" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    // Add user message
    setMessages((prev) => [
      ...prev,
      <ChatMessage key={prev.length} content={input} role="user" />,
    ]);
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      // Add a loading message
      setMessages((prev) => [
        ...prev,
        <ChatMessage
          key={prev.length}
          content={<LoadingIndicator />}
          role="assistant"
        />,
      ]);

      // Stream the response
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Final update with complete content
          setMessages((prev) => [
            ...prev.slice(0, -1), // Remove loading message
            <ChatMessage
              key={prev.length}
              content={accumulatedContent}
              role="assistant"
            />,
          ]);
          break;
        }

        // Decode and accumulate the streamed content
        accumulatedContent += decoder.decode(value, { stream: true });
        // Update UI progressively, replacing the loading message
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove previous assistant message
          <ChatMessage
            key={prev.length}
            content={accumulatedContent}
            role="assistant"
          />,
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        <ChatMessage
          key={prev.length}
          content="Error: Couldn’t process that."
          role="assistant"
          error
        />,
      ]);
    } finally {
      setIsLoading(false);
      // if (!actionInput) setInput(""); // Only clear input if not from suggested action
    }
  };

  // Handle clicking a suggested action
  const handleSuggestedAction = (action) => {
    handleSubmit({ preventDefault: () => {} }, action); // Simulate form submit
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Sports Assistant <span className="text-blue-400">ASE</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Your AI companion for sports insights—powered by Mistral.
        </p>

        {/* Output Area */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Ask me about sports, fitness, or exercise!
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
            </div>
          )}
        </div>

        {/* Suggested Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Try asking about:</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedActions.map((action, index) => (
              <SuggestedAction 
                key={index} 
                action={action} 
                onClick={handleSuggestedAction} 
                disabled={isLoading} 
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sports, fitness, or exercise..."
            className="flex-1 p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </form>

        {/* Footer */}
        <footer className="mt-8 text-gray-500 text-sm">
          Built with Mistral AI & Next.js
        </footer>
      </div>

      {/* Subtle Sci-Fi Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.1),transparent_50%)] opacity-20" />
      </div>
    </div>
  );
}