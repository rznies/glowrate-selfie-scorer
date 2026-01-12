import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { analyzeSelfiWithAI, getMockScore } from "@/lib/ai-scoring";

export const glowRouter = createTRPCRouter({
  processSelfie: publicProcedure
    .input(z.object({ 
      imageUri: z.string().optional(),
      imageBase64: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { imageBase64 } = input;
      
      let result;
      
      // Try AI scoring if base64 image provided and API key exists
      if (imageBase64 && process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
        try {
          result = await analyzeSelfiWithAI(imageBase64);
        } catch (error) {
          console.error('AI scoring failed, falling back to mock:', error);
          result = getMockScore();
        }
      } else {
        // Fallback to mock scoring
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = getMockScore();
      }

      return {
        id: Date.now().toString(),
        ...result,
        createdAt: new Date().toISOString(),
      };
    }),
});
