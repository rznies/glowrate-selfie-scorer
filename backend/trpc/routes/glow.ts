import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { generateMockScore, getRandomTips, getRandomRoast } from "@/mocks/glowData";

export const glowRouter = createTRPCRouter({
  processSelfie: publicProcedure
    .input(z.object({ imageUri: z.string().optional() }))
    .mutation(async ({ input }) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { score, breakdown } = generateMockScore();
      const tips = getRandomTips(3);
      const roast = getRandomRoast();

      return {
        id: Date.now().toString(),
        score,
        breakdown,
        tips,
        roast,
        createdAt: new Date().toISOString(),
      };
    }),
});
