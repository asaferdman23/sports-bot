export default function MotivationalQuote({ content }) {
  // Extract a quote from the content if possible
  const quote = extractQuote(content);
  
  return (
    <div className="w-full animate-fade-in">
      <div className="bg-gradient-to-r from-sports-blue to-sports-green p-1 rounded-lg">
        <div className="bg-sports-dark-gray p-6 rounded-lg">
          <div className="text-5xl text-sports-blue mb-4">"</div>
          <p className="text-xl text-white italic mb-6">{quote.text}</p>
          {quote.author && (
            <p className="text-right text-sports-green font-semibold">— {quote.author}</p>
          )}
          <div className="text-5xl text-sports-blue text-right">"</div>
        </div>
      </div>
      
      {quote.additionalText && (
        <div className="mt-6 text-white">
          {quote.additionalText}
        </div>
      )}
    </div>
  );
}

// Helper function to extract a quote from text content
function extractQuote(content) {
  // Try to find a quote in the content (text between quotation marks)
  const quoteMatch = content.match(/"([^"]+)"/);
  
  if (quoteMatch) {
    const text = quoteMatch[1];
    
    // Try to find the author (often follows the quote with a dash or hyphen)
    const authorMatch = content.match(/[""].*[""][\s]*[-—–][\s]*([^,.]+)/);
    const author = authorMatch ? authorMatch[1].trim() : '';
    
    // Get any additional text (everything except the quote and author)
    let additionalText = content
      .replace(quoteMatch[0], '')
      .replace(authorMatch ? authorMatch[0] : '', '')
      .trim();
      
    return { text, author, additionalText };
  }
  
  // If no quote is found, just use the whole content as the quote
  return { text: content, author: '', additionalText: '' };
} 