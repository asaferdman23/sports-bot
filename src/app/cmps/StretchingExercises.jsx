export default function StretchingExercises({ content }) {
  // Extract stretching exercises from the content
  const exercises = extractExercises(content);
  
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-sports-blue mb-4">Stretching Exercises</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((exercise, index) => (
          <div key={index} className="bg-sports-dark-gray p-4 rounded-lg border-l-4 border-sports-green">
            <h3 className="text-xl font-semibold text-sports-green mb-2">{exercise.name}</h3>
            <p className="text-white mb-2">{exercise.description}</p>
            {exercise.benefit && (
              <p className="text-sm text-gray-300 italic">
                <span className="font-semibold">Benefit:</span> {exercise.benefit}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract exercises from text content
function extractExercises(content) {
  // This is a simple extraction - in a real app, you might want to use more sophisticated parsing
  const lines = content.split('\n');
  const exercises = [];
  let currentExercise = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line is an exercise name (usually starts with a number or has a colon)
    if (/^\d+\.\s/.test(trimmedLine) || /^[A-Z].*:/.test(trimmedLine)) {
      if (currentExercise) {
        exercises.push(currentExercise);
      }
      
      const name = trimmedLine.replace(/^\d+\.\s/, '').replace(/:$/, '');
      currentExercise = { name, description: '', benefit: '' };
    } 
    // Check if this line mentions benefits
    else if (currentExercise && (trimmedLine.toLowerCase().includes('benefit') || trimmedLine.toLowerCase().includes('helps'))) {
      currentExercise.benefit = trimmedLine;
    }
    // Otherwise, add to the description
    else if (currentExercise && trimmedLine.length > 0) {
      currentExercise.description += (currentExercise.description ? ' ' : '') + trimmedLine;
    }
  }
  
  // Add the last exercise
  if (currentExercise) {
    exercises.push(currentExercise);
  }
  
  // If we couldn't extract exercises properly, create a fallback
  if (exercises.length === 0) {
    return [{ name: 'Stretching Routine', description: content, benefit: '' }];
  }
  
  return exercises;
} 