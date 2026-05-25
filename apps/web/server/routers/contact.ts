import { router, publicProcedure, adminProcedure } from "../trpc";
import { contacts } from "@portfolio/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { checkRateLimit } from "../middleware/rateLimit";
import { sendContactNotification } from "../../lib/email";

export const contactRouter = router({
  // Public inquiry submission procedure
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters long."),
        email: z.string().email("Please provide a valid email address."),
        message: z.string().min(10, "Message must be at least 10 characters long."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. IP-based rate limiting check (Upstash sliding window limit)
      const limitResult = await checkRateLimit(ctx.ip);
      if (!limitResult.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You have sent too many messages. Please try again in an hour.",
        });
      }

      try {
        // 2. Persist contact inquiry in Postgres
        const createdContacts = await ctx.db
          .insert(contacts)
          .values({
            name: input.name,
            email: input.email,
            message: input.message,
            ip: ctx.ip,
          })
          .returning();

        const newContact = createdContacts[0];
        if (!newContact) {
          throw new Error("Failed to record inquiry.");
        }

        // 3. Send email notification via Resend
        await sendContactNotification({
          name: input.name,
          email: input.email,
          message: input.message,
        });

        return { success: true, contactId: newContact.id };
      } catch (error) {
        console.error("❌ Submission handling failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process inquiry. Please try again later.",
        });
      }
    }),

  // Admin procedure listing inquiries sorted by arrival
  list: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }),

  // Admin procedure marking inquiries as read
  markRead: adminProcedure
    .input(z.object({ id: z.string().uuid(), read: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const [updatedContact] = await ctx.db
        .update(contacts)
        .set({ read: input.read })
        .where(eq(contacts.id, input.id))
        .returning();

      return updatedContact;
    }),
});
