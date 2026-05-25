import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

// Initialize tRPC with our created request Context type
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;

// tRPC Middleware to enforce authenticated admin sessions
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated as an admin to access this procedure.",
    });
  }

  return next({
    ctx: {
      // Infers that session and user are non-nullable
      session: {
        ...ctx.session,
        user: ctx.session.user,
      },
    },
  });
});

// Admin-only procedure
export const adminProcedure = t.procedure.use(isAdmin);
