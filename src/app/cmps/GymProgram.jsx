import React from 'react';

export default async function GymProgram({ jsonString }) {
  // Try to extract the JSON part from the string
  const extractJson = (str) => {
    try {
      // First, try to find a complete JSON object
      const jsonRegex = /{[\s\S]*}/;
      const match = str.match(jsonRegex);
      
      if (match) {
        // Clean up the JSON string - remove any text before or after the JSON object
        let jsonStr = match[0];
        
        // Try to parse it
        try {
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log("Initial parsing failed, trying to clean the JSON string");
          
          // If parsing fails, try to clean up the JSON string
          // Sometimes the JSON might be malformed or have extra content
          
          // Remove any content before the first {
          const startIndex = str.indexOf('{');
          // Find the last } in the string
          const endIndex = str.lastIndexOf('}');
          
          if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            jsonStr = str.substring(startIndex, endIndex + 1);
            
            // Try to parse again
            try {
              return JSON.parse(jsonStr);
            } catch (innerError) {
              console.error("Error parsing cleaned JSON:", innerError);
              
              // As a last resort, try to manually fix common JSON issues
              // Replace any unescaped newlines, tabs, etc.
              jsonStr = jsonStr.replace(/[\n\r\t]/g, " ");
              // Remove any trailing commas in arrays or objects
              jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");
              
              try {
                return JSON.parse(jsonStr);
              } catch (finalError) {
                console.error("Final attempt to parse JSON failed:", finalError);
                return null;
              }
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Error in JSON extraction process:", error);
      return null;
    }
  };

  // Parse the JSON string
  const data = extractJson(jsonString);
  
  if (!data || !data.workout_plan) {
    return (
      <div className="p-4 bg-sports-dark-gray rounded-lg text-white">
        <p>Unable to parse workout plan data.</p>
        <p className="text-xs mt-2 text-gray-400">Please check the format of the workout plan data.</p>
      </div>
    );
  }

  const { name, description, days } = data.workout_plan;
  const quote = data.motivational_quote;

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="bg-sports-blue text-white p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-sm opacity-90 mt-1">{description}</p>
      </div>

      {/* Workout Days */}
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-6">
          <h3 className="text-xl font-bold text-sports-green bg-sports-dark-gray p-3 border-l-4 border-sports-green">
            {day.day_name}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sports-dark-gray text-white">
                  <th className="p-3 rounded-tl-lg">Exercise</th>
                  <th className="p-3 text-center">Sets</th>
                  <th className="p-3 text-center">Reps</th>
                  <th className="p-3 text-center rounded-tr-lg">Rest</th>
                </tr>
              </thead>
              <tbody>
                {day.exercises.map((exercise, exIndex) => (
                  <tr
                    key={exIndex}
                    className={`${
                      exIndex % 2 === 0 ? "bg-sports-gray" : "bg-sports-dark-gray"
                    } border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors`}
                  >
                    <td className="p-3 font-medium">{exercise.name}</td>
                    <td className="p-3 text-center">{exercise.sets}</td>
                    <td className="p-3 text-center">{exercise.reps}</td>
                    <td className="p-3 text-center">{exercise.rest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Motivational Quote */}
      {quote && (
        <div className="mt-6 p-4 bg-sports-dark-gray rounded-lg border-l-4 border-sports-blue italic text-white">
          {quote}
        </div>
      )}
    </div>
  );
}