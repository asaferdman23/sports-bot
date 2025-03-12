// src/app/cmps/ChatMessage.js
export default function ChatMessage({ content, role, error }) {
  return (
    <div
      className={`p-3 rounded-lg shadow-md ${
        role === "user"
          ? "bg-sports-green text-white"
          : error
          ? "bg-sports-red text-white"
          : "bg-sports-blue text-white"
      }`}
    >
      {content}
    </div>
  );
}