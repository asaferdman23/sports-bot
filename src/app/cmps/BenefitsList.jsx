export default function BenefitsList({ content }) {
  // Extract benefits from the content
  const benefits = extractBenefits(content);
  
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-sports-blue mb-4">Benefits of Running</h2>
      
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-sports-dark-gray p-4 rounded-lg flex items-start">
            <div className="bg-sports-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sports-green mb-1">{benefit.title}</h3>
              <p className="text-white">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract benefits from text content
function extractBenefits(content) {
  // This is a simple extraction - in a real app, you might want to use more sophisticated parsing
  const lines = content.split('\n');
  const benefits = [];
  let currentBenefit = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line is a benefit title (usually starts with a number or has a colon)
    if (/^\d+\.\s/.test(trimmedLine) || /^[A-Z].*:/.test(trimmedLine)) {
      if (currentBenefit) {
        benefits.push(currentBenefit);
      }
      
      const title = trimmedLine.replace(/^\d+\.\s/, '').replace(/:$/, '');
      currentBenefit = { title, description: '' };
    } 
    // Otherwise, add to the description
    else if (currentBenefit && trimmedLine.length > 0) {
      currentBenefit.description += (currentBenefit.description ? ' ' : '') + trimmedLine;
    }
  }
  
  // Add the last benefit
  if (currentBenefit) {
    benefits.push(currentBenefit);
  }
  
  // If we couldn't extract benefits properly, create a fallback
  if (benefits.length === 0) {
    // Try to split the content into paragraphs and use those as benefits
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 1) {
      return paragraphs.map((p, i) => ({
        title: `Benefit ${i+1}`,
        description: p.trim()
      }));
    }
    
    // Last resort: just use the whole content
    return [{ title: 'Benefits of Running', description: content }];
  }
  
  return benefits;
} 