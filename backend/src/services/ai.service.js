import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-flash-lite-latest",
  apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to find relevant information on the internet.")
  })
})

const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool]
})

export async function generateResponse(messages) {

  const response = await agent.invoke({
    messages: messages.map(msg => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } 
      
      if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }

      return null;
    }).filter(Boolean)
  });

  return response.messages[response.messages.length - 1].content;
}

/**
 * Stream AI response chunk by chunk
 * Calls onChunk callback with each chunk as it arrives
 */
export async function generateResponseStream(messages, onChunk) {
  try {
    // Use streaming if available
    const stream = await geminiModel.stream(
      {
        messages: messages.map(msg => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } 
        
        if (msg.role === "ai") {
          return new AIMessage(msg.content);
        }

        return null;
      }).filter(Boolean)
    });

    // Process stream chunks
    for await (const chunk of stream) {
      if (chunk.content) {
        await onChunk(chunk.content);
      }
    }
  } catch (error) {
    console.error("Error in generateResponseStream:", error);
    // Fallback to non-streaming if streaming fails
    const fullResponse = await generateResponse(messages);
    await onChunk(fullResponse);
  }
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and relevant titles for chat conversations. 
      
      User will provide you with a message from a chat conversation, and your task is to generate a concise and relevant title that captures the essence of the conversation in a few words. The title should be clear, informative, and should reflect the main topic or theme of the conversation.
      `),
    new HumanMessage(`Generate a concise and relevant title for a chat conversation based on the following message: "${message}"`)
  ])
  
  return response.content.trim().replace(/(^"|"$)/g, '');
}