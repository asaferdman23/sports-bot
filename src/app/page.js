// src/app/page.js
"use client";

import { useState, useRef } from "react";
import "./styles/sports-ui.css";
import ChatMessage from "./cmps/ChatMessage";
import SuggestedAction from "./cmps/SuggestedAction";
import LoadingIndicator from "./cmps/LoadingIndicator";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const { continueConversation } = useActions();
  const [conversation, setConversation] = useUIState();

  const suggestedActions = [
    {
      title: "Give me",
      label: "a workout plan",
      action: "Give me a workout plan for beginners",
    },
    {
      title: "Show me",
      label: "some stretching exercises",
      action: "Show me some stretching exercises",
    },
    {
      title: "What are",
      label: "benefits of running?",
      action: "What are the benefits of running?",
    },
    {
      title: "Motivate me",
      label: "to exercise today",
      action: "I need motivation to exercise today",
    },
  ];

  const handleSubmit = async (e, actionInput = null) => {
    e.preventDefault();
    const messageInput = actionInput || input;
    if (!messageInput.trim()) return;

    setIsLoading(true);

    const userMessage = {
      id: generateId(),
      role: "user",
      display: <ChatMessage content={messageInput} role="user" />,
    };
    setConversation((currentConversation) => [...currentConversation, userMessage]);

    try {
      const response = await continueConversation(messageInput);
      setConversation((currentConversation) => [
        ...currentConversation,
        {
          id: response.id,
          role: "assistant",
          display: <ChatMessage content={response.display} role="assistant" />,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setConversation((currentConversation) => [
        ...currentConversation,
        {
          id: generateId(),
          role: "assistant",
          display: <ChatMessage content="Error: Couldn’t process that." role="assistant" error />,
        },
      ]);
    } finally {
      setIsLoading(false);
      if (!actionInput) setInput("");
    }
  };

  const handleSuggestedAction = (action) => {
    handleSubmit({ preventDefault: () => {} }, action);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 sports-container">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 sports-header">
          Sports Assistant <span className="text-sports-blue">ASE</span>
        </h1>
        <p className="text-gray-300 mb-8">
          Your AI companion for Sports Motivator.
        </p>

        <div className="bg-sports-gray border border-sports-green rounded-xl p-6 mb-6 min-h-[800px] max-h-[500px] overflow-y-auto sports-chat">
          {conversation.length === 0 ? (
            <p className="text-gray-400 italic text-center">
              Ask me about sports, fitness, or exercise!
            </p>
          ) : (
            <div className="space-y-4">
              {conversation.map((message) => (
                <div key={message.id}>{message.display}</div>
              ))}
            </div>
          )}
        </div>

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

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sports, fitness, or exercise..."
            className="flex-1 p-4 bg-sports-dark-gray border border-sports-green rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-6 py-4 bg-sports-blue text-white font-semibold rounded-lg hover:bg-sports-blue-dark transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "..." : "Ask"}
          </button>
        </form>

        <footer className="mt-8 text-gray-500 text-sm">
          Built with Mistral AI & Next.js
        </footer>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(46,125,50,0.1),transparent_50%)] opacity-20" />
      </div>
    </div>
  );
}