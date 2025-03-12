export function Motivation({ message }) {
  console.log("message", message);
    return (
      <div className="p-4 bg-green-100 rounded-lg text-center">
        <p className="text-lg font-semibold text-green-800">{message}</p>
      </div>
    );
  }