// src/app/cmps/LoadingIndicator.js
export default function LoadingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-sports-blue">
      <div className="w-2 h-2 bg-sports-green rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-sports-green rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-sports-green rounded-full animate-bounce delay-200"></div>
      <span>Loading...</span>
    </div>
  );
}