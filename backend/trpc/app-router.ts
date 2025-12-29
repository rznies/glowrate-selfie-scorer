import { createTRPCRouter } from "./create-context";
import { exampleRouter } from "./routes/example";

import { glowRouter } from "./routes/glow";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  glow: glowRouter,
});

export type AppRouter = typeof appRouter;
