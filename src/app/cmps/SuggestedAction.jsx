// src/app/cmps/SuggestedAction.js
export default function SuggestedAction({ action, onClick, disabled }) {
  return (
    <button
      onClick={() => onClick(action.action)}
      className={`p-2 bg-sports-dark-gray text-white rounded-lg hover:bg-sports-green transition ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      <span className="font-bold text-sports-blue">{action.title}</span>{" "}
      {action.label}
    </button>
  );
}