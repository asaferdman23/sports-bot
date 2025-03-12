export default function ChatMessage({ message }) {
    return (
      <div 
        className={`p-3 rounded-lg animate-fade-in ${
          message.role === 'user' 
            ? 'bg-blue-600/30 border border-blue-500/30 ml-12' 
            : 'bg-gray-700/50 border border-gray-600/50 mr-12'
        }`}
      >
        <p className="text-sm text-gray-400 mb-1">
          {message.role === 'user' ? 'You' : 'Sports Assistant'}
        </p>
        <p className="text-white">{message.content}</p>
      </div>
    );
  }