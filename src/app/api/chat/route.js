"use server";

import { getMutableAIState, streamUI } from "ai/rsc";
import { createMistral } from "@ai-sdk/mistral";
import { generateId } from "ai";
import GymProgram from "@/app/cmps/GymProgram";
import StretchingExercises from "@/app/cmps/StretchingExercises";
import BenefitsList from "@/app/cmps/BenefitsList";
import MotivationalQuote from "@/app/cmps/MotivationalQuote";
import TextComponent from "@/app/cmps/TextComponent";

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function continueConversation(input) {
  "use server";
  let isLoading = true;
  let lastUpdateTime = Date.now();
  const debounceTime = 300; // milliseconds
  const history = getMutableAIState();
  
  // Determine the type of request based on input
  const isWorkoutPlanRequest = input.toLowerCase().includes("workout plan") || 
                              input.toLowerCase().includes("gym program");
  
  const isStretchingRequest = input.toLowerCase().includes("stretching") || 
                             input.toLowerCase().includes("stretch exercises");
  
  const isRunningBenefitsRequest = input.toLowerCase().includes("benefits of running") || 
                                  input.toLowerCase().includes("why run");
  
  const isMotivationRequest = input.toLowerCase().includes("motivate me") || 
                             input.toLowerCase().includes("motivation to exercise");
  
  console.log("Input type:", { 
    isWorkoutPlanRequest, 
    isStretchingRequest, 
    isRunningBenefitsRequest, 
    isMotivationRequest 
  });
  
  const result = await streamUI({
    model: mistral("mistral-large-latest"),
    system: `You are a vintage sport Psychologist assistant bot. Provide helpful, accurate, and motivational 
    information about sports, fitness, and exercise.
    
    If the user asks for a gym program or workout plan, respond with a structured JSON workout plan including days, 
    exercises, sets, reps, and rest periods. The response should be in this format:
    {
      "workout_plan": {
        "name": "Name of the plan",
        "description": "Brief description",
        "days": [
          {
            "day_name": "Day 1",
            "exercises": [
              {
                "name": "Exercise name",
                "sets": number,
                "reps": number or string,
                "rest": "rest period"
              }
            ]
          }
        ]
      },
      "motivational_quote": "A motivational quote"
    }
    
    If the user asks about stretching exercises, provide a list of stretching exercises with descriptions and benefits.
    
    If the user asks about benefits of running, provide a structured list of benefits with brief explanations.
    
    If the user asks for motivation, provide an inspiring and motivational message to encourage exercise.`,
    messages: [...history.get(), { role: "user", content: input }],
    temperature: 0.7,
    maxTokens: 2500,
    text: ({ content, done }) => {
      const currentTime = Date.now();
      if (done || currentTime - lastUpdateTime > debounceTime) {
        isLoading = false;
        lastUpdateTime = currentTime;
        
        if (done) {
          history.done((messages) => [
            ...messages,
            { role: "assistant", content },
          ]);
        }
      }

      // Render different components based on the request type
      if (isWorkoutPlanRequest) {
        console.log("Workout plan request");
        return <GymProgram jsonString={content} />;
      } else if (isStretchingRequest) {
        console.log("Stretching request");
        return <StretchingExercises content={content} />;
      } else if (isRunningBenefitsRequest) {
        console.log("Running benefits request");
        return <BenefitsList content={content} />;
      } else if (isMotivationRequest) {
        console.log("Motivation request");
        return <MotivationalQuote content={content} />;
      } else {
        // Default text response
        console.log("Default text response");
        return <TextComponent content={content} />;
      }

      if (isLoading) {
        return <div>Loading </div>;
      }
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}