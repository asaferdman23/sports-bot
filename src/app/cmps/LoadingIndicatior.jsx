export default function LoadingIndicator() {
    return (
      <div className="flex items-center gap-3 text-gray-400 p-3 bg-gray-700/30 rounded-lg animate-fade-in mr-12">
        <p className="text-sm text-gray-400 mb-1">Sports Assistant</p>
        <div className="flex items-center gap-1">
          <span className="animate-pulse">•</span>
          <span className="animate-pulse delay-100">•</span>
          <span className="animate-pulse delay-200">•</span>
        </div>
      </div>
    );
  }