export default function SuggestedAction({ action, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(action.action)}
      className="bg-gray-800 hover:bg-gray-700 text-left transition-colors px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      disabled={disabled}
    >
      <span className="text-blue-400 font-medium">{action.title}</span>
      <span className="text-gray-300"> {action.label}</span>
    </button>
  );
}