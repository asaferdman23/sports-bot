// src/app/ai.js
import { createAI } from "ai/rsc";
import { continueConversation } from "./api/chat/route";

export const AI = createAI({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});