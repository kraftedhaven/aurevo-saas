import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  callConsole: router({
    getSettings: protectedProcedure.query(async ({ ctx }) => {
      return db.getCallConsoleSettings(ctx.user.id);
    }),
    upsertSettings: protectedProcedure.input(z.object({
      calls: z.number(),
      ticket: z.number(),
      close: z.number(),
      weeks: z.number(),
      setup: z.number(),
      retainer: z.number(),
      cost: z.number(),
      buildcost: z.number(),
      newclients: z.number(),
      runningclients: z.number(),
      numbersHidden: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.upsertCallConsoleSettings({ ...input, userId: ctx.user.id });
    }),
  }),
  tracker: router({
    getEntries: protectedProcedure.query(async ({ ctx }) => {
      return db.getTrackerEntries(ctx.user.id);
    }),
    addEntry: protectedProcedure.input(z.object({
      date: z.string(),
      client: z.string(),
      note: z.string().optional(),
      value: z.number(),
      flag: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.addTrackerEntry({ ...input, userId: ctx.user.id });
    }),
    deleteEntry: protectedProcedure.input(z.object({
      id: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await db.deleteTrackerEntry(input.id, ctx.user.id);
    }),
  }),
  benchmarks: router({
    getBenchmarks: publicProcedure.query(async () => {
      return db.getTradeBenchmarks();
    }),
    addBenchmark: protectedProcedure.input(z.object({
      trade: z.string(),
      avgCalls: z.number(),
      avgTicket: z.number(),
      avgClose: z.number(),
    })).mutation(async ({ input }) => {
      await db.addTradeBenchmark(input);
    }),
  }),
  objections: router({
    getResponses: publicProcedure.input(z.object({
      trade: z.string().optional(),
      painPoint: z.string().optional(),
    })).query(async ({ input }) => {
      return db.getObjectionResponses(input.trade, input.painPoint);
    }),
    addResponse: protectedProcedure.input(z.object({
      objection: z.string(),
      response: z.string(),
      trade: z.string().optional(),
      painPoint: z.string().optional(),
    })).mutation(async ({ input }) => {
      await db.addObjectionResponse(input);
    }),
  }),
});

export type AppRouter = typeof appRouter;
