import { router, publicProcedure, adminProcedure } from "../trpc";
import { projects } from "@portfolio/db";
import { eq, and, asc } from "drizzle-orm";
import { z } from "zod";

// Media item input schema matching structural types
const mediaItemSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  order: z.number().int(),
});

export const projectsRouter = router({
  // Public list of published projects ordered by custom sequence hierarchy
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(projects)
      .where(eq(projects.published, true))
      .orderBy(asc(projects.order));
  }),

  // Admin procedure listing all projects regardless of publishing state
  listAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(projects)
      .orderBy(asc(projects.order));
  }),

  // Public retrieval by unique slug identifier
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(projects)
        .where(and(eq(projects.slug, input.slug), eq(projects.published, true)))
        .limit(1);

      return results[0] || null;
    }),

  // Admin retrieval by slug regardless of visibility
  getBySlugAdmin: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.slug, input.slug))
        .limit(1);

      return results[0] || null;
    }),

  // Admin mutation creating a new portfolio case study
  create: adminProcedure
    .input(
      z.object({
        slug: z.string().min(2),
        title: z.string().min(2),
        client: z.string().optional(),
        year: z.number().int().min(1900),
        tags: z.array(z.string()),
        summary: z.string().optional(),
        description: z.string().optional(),
        coverImage: z.string().optional(),
        coverVideo: z.string().optional(),
        images: z.array(mediaItemSchema).optional(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
        order: z.number().int().optional(),
        seoTitle: z.string().optional(),
        seoDesc: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newProject] = await ctx.db
        .insert(projects)
        .values({
          ...input,
          images: input.images || [],
        })
        .returning();

      return newProject;
    }),

  // Admin mutation updating an existing portfolio case study
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        slug: z.string().min(2),
        title: z.string().min(2),
        client: z.string().optional().nullable(),
        year: z.number().int().min(1900),
        tags: z.array(z.string()),
        summary: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        coverImage: z.string().optional().nullable(),
        coverVideo: z.string().optional().nullable(),
        images: z.array(mediaItemSchema).optional().nullable(),
        featured: z.boolean().optional(),
        published: z.boolean().optional(),
        order: z.number().int().optional(),
        seoTitle: z.string().optional().nullable(),
        seoDesc: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const [updatedProject] = await ctx.db
        .update(projects)
        .set({
          ...updateData,
          images: updateData.images || undefined,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

      return updatedProject;
    }),

  // Admin mutation deleting an existing project
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedProject] = await ctx.db
        .delete(projects)
        .where(eq(projects.id, input.id))
        .returning();

      return deletedProject;
    }),

  // Admin mutation for bulk updating sorting parameters
  reorder: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.string().uuid(),
          order: z.number().int(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const updatePromises = input.map((item) =>
        ctx.db
          .update(projects)
          .set({ order: item.order, updatedAt: new Date() })
          .where(eq(projects.id, item.id))
      );

      await Promise.all(updatePromises);
      return { success: true };
    }),
});
