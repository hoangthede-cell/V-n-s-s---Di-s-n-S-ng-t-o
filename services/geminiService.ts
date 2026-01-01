
import { GoogleGenAI, GenerateContentResponse, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found in environment variables");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// Helper to format the entire message history for the Gemini API.
const buildApiHistory = (messages: Message[]): Content[] => {
  // The API requires a valid conversation history, starting with a 'user' role
  // and alternating between 'user' and 'model'. This function filters out any initial
  // 'model' messages that are just for UI display purposes.

  // Find the index of the first message from a user.
  const firstUserMessageIndex = messages.findIndex(m => m.role === 'user');

  // If there are no user messages, we can't make a valid API call.
  if (firstUserMessageIndex === -1) {
    return [];
  }

  // Slice the array to start the history from the first user message.
  // This ensures the [user, model, user, ...] sequence is correct for the API.
  const validApiHistory = messages.slice(firstUserMessageIndex);

  // Map to the format required by the Gemini API.
  return validApiHistory.map(message => ({
    role: message.role,
    parts: [{ text: message.text }]
  }));
};

export interface GeminiResponse {
  text: string;
  groundingMetadata?: any;
}

// Now uses a stateless approach
export const sendMessageToGemini = async (messageHistory: Message[]): Promise<GeminiResponse> => {
  try {
    const geminiAI = getAi();
    const contents = buildApiHistory(messageHistory);

    // Ensure there is content to send to avoid API errors
    if (contents.length === 0) {
        return { text: "Xin hãy bắt đầu cuộc trò chuyện." };
    }

    const response = await geminiAI.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            tools: [{ googleSearch: {} }],
        }
    });

    return {
      text: response.text || "Rất xin lỗi, tôi chưa thể đưa ra câu trả lời lúc này. Bạn vui lòng thử lại sau nhé.",
      groundingMetadata: response.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Có lỗi xảy ra khi kết nối với Văn Sĩ Số. Vui lòng kiểm tra kết nối mạng.");
  }
};