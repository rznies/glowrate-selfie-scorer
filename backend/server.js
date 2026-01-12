const { Hono } = require('hono');
const { cors } = require('hono/cors');
const { trpcServer } = require('@hono/trpc-server');

// Simple mock router for now
const appRouter = {
  glow: {
    processSelfie: async ({ input }) => {
      // Mock scoring logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      const baseScore = Math.random() * 3 + 6.5;
      const variance = () => (Math.random() - 0.5) * 1.5;
      
      const breakdown = {
        smile: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
        lighting: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
        style: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
        vibe: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
      };
      
      return {
        id: Date.now().toString(),
        score: Math.round(((breakdown.smile + breakdown.lighting + breakdown.style + breakdown.vibe) / 4) * 10) / 10,
        breakdown,
        tips: [
          { id: '1', category: 'lighting', text: 'Try natural window light for a softer glow!', emoji: '💡' },
          { id: '2', category: 'pose', text: 'Tilt your chin slightly for a defined look!', emoji: '📐' },
          { id: '3', category: 'expression', text: 'Your smile is your superpower!', emoji: '😊' },
        ],
        roast: "You're giving main character energy! 🌟",
        createdAt: new Date().toISOString(),
      };
    }
  }
};

const createContext = async (opts) => {
  return {
    req: opts.req,
  };
};

const app = new Hono();

app.use("*", cors());

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

// Also handle the root trpc endpoint
app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
  }),
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "GlowRate API is running" });
});

const port = 3001;
console.log(`🚀 GlowRate API server running on http://localhost:${port}`);

// Start the server
const server = Bun.serve({
  port,
  fetch: app.fetch,
});

console.log(`✅ Server is listening on port ${port}`);
