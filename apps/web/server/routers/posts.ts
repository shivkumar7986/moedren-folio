import { router, publicProcedure, adminProcedure } from "../trpc";
import { posts } from "@portfolio/db";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

export const postsRouter = router({
  // Public list of published posts sorted by publication date
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt));
  }),

  // Admin list of all posts sorted by creation date
  listAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
  }),

  // Public retrieval by unique slug identifier
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, input.slug), eq(posts.published, true)))
        .limit(1);

      return results[0] || null;
    }),

  // Admin retrieval by slug regardless of published state
  getBySlugAdmin: adminProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db
        .select()
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .limit(1);

      return results[0] || null;
    }),

  // Admin mutation creating a new blog article
  create: adminProcedure
    .input(
      z.object({
        slug: z.string().min(2),
        title: z.string().min(2),
        excerpt: z.string().optional(),
        content: z.string().min(10),
        coverImage: z.string().optional(),
        tags: z.array(z.string()),
        published: z.boolean().optional(),
        publishedAt: z.string().datetime().optional().nullable(),
        seoTitle: z.string().optional(),
        seoDesc: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const parsedPublishedAt = input.publishedAt
        ? new Date(input.publishedAt)
        : (input.published ? new Date() : null);

      const [newPost] = await ctx.db
        .insert(posts)
        .values({
          ...input,
          publishedAt: parsedPublishedAt,
        })
        .returning();

      return newPost;
    }),

  // Admin mutation updating an existing blog article
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        slug: z.string().min(2),
        title: z.string().min(2),
        excerpt: z.string().optional().nullable(),
        content: z.string().min(10),
        coverImage: z.string().optional().nullable(),
        tags: z.array(z.string()),
        published: z.boolean().optional(),
        publishedAt: z.string().datetime().optional().nullable(),
        seoTitle: z.string().optional().nullable(),
        seoDesc: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const parsedPublishedAt = updateData.publishedAt
        ? new Date(updateData.publishedAt)
        : (updateData.published ? new Date() : null);

      const [updatedPost] = await ctx.db
        .update(posts)
        .set({
          ...updateData,
          publishedAt: parsedPublishedAt,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id))
        .returning();

      return updatedPost;
    }),

  // Admin mutation deleting a blog article
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deletedPost] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      return deletedPost;
    }),
});
