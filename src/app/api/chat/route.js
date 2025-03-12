import { streamUI, createStreamableValue } from "ai/rsc";
import { createMistral } from "@ai-sdk/mistral";
import { NextResponse } from "next/server";

// Define a simple TextComponent to render the message
function TextComponent({ content }) {
  return <p className="text-white">{content}</p>;
}

// Initialize Mistral client
const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req) {
  if (!process.env.MISTRAL_API_KEY) {
    console.error("MISTRAL_API_KEY is not set");
    return new Response(JSON.stringify({ error: "API key missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { input } = await req.json();

  try {
    // Create a streamable value for progressive rendering
    const contentStream = createStreamableValue("");
    console.log("contentStream", contentStream);
    const textComponent = <TextComponent content={contentStream.value} />;

    const result = await streamUI({
      model: mistral("mistral-large-latest"),
      system: `You are a vintage sport Psychologist assistant bot. Provide helpful, accurate, and motivational information about sports, fitness, and exercise.`,
      prompt: input,
      temperature: 0.7,
      maxTokens: 500,
      text: async function* ({ content, done }) {
        if (!done) {
          // Update the stream with each chunk of content
          contentStream.update(content);
          return textComponent; // Stream the UI component progressively
        }

        // When streaming is complete, finalize the content
        contentStream.done();
        const finalContent = content.trim();
        console.log("Final content:", finalContent);

        // Return the final UI component with the complete content
        return <TextComponent content={finalContent} />;
      },
    });

    // Return the streamed UI component
    return new NextResponse(result.value, {
      headers: { "Content-Type": "text/html" }, // Indicate this is HTML-like content
    });
  } catch (error) {
    console.error("Stream error:", error);
    return new NextResponse(
      "<div>Sorry, I couldn't process your request.</div>",
      { headers: { "Content-Type": "text/html" } }
    );
  }
}