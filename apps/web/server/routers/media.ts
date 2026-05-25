import { router, adminProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for storage administration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

if (!supabaseAdmin) {
  console.warn(
    "⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is missing. Storage administration is disabled."
  );
}

export const mediaRouter = router({
  // Admin mutation generating signed storage direct-upload tokens
  getUploadUrl: adminProcedure
    .input(
      z.object({
        filename: z.string(),
        mimeType: z.string(),
        bucket: z.enum(["media", "thumbnails", "og-images"]),
      })
    )
    .mutation(async ({ input }) => {
      if (!supabaseAdmin) {
        // Return mock details for offline sandbox runs
        console.info(
          `📦 Mock Storage Dispatch: Signed upload token requested for "${input.filename}" in bucket "${input.bucket}"`
        );
        const mockPath = `mock-uploads/${Date.now()}-${input.filename}`;
        return {
          uploadUrl: `https://mock-supabase-storage.local/${input.bucket}/${mockPath}`,
          publicUrl: `https://mock-supabase-storage.local/${input.bucket}/${mockPath}`,
          path: mockPath,
          isMock: true,
        };
      }

      try {
        const fileExt = input.filename.split(".").pop();
        const uniquePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        // Generates signed upload URL valid for 10 minutes
        const { data, error } = await supabaseAdmin.storage
          .from(input.bucket)
          .createSignedUploadUrl(uniquePath);

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Supabase Storage error: ${error.message}`,
          });
        }

        // Retrieves public visual CDN address
        const { data: publicData } = supabaseAdmin.storage
          .from(input.bucket)
          .getPublicUrl(uniquePath);

        return {
          uploadUrl: data.signedUrl,
          publicUrl: publicData.publicUrl,
          path: uniquePath,
          isMock: false,
        };
      } catch (error) {
        console.error("❌ Storage token generation failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate storage upload URL.",
        });
      }
    }),

  // Admin mutation deleting assets from buckets
  delete: adminProcedure
    .input(
      z.object({
        path: z.string(),
        bucket: z.enum(["media", "thumbnails", "og-images"]),
      })
    )
    .mutation(async ({ input }) => {
      if (!supabaseAdmin) {
        console.info(
          `📦 Mock Storage Dispatch: Deleting "${input.path}" from bucket "${input.bucket}"`
        );
        return { success: true, isMock: true };
      }

      try {
        const { error } = await supabaseAdmin.storage
          .from(input.bucket)
          .remove([input.path]);

        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to remove asset: ${error.message}`,
          });
        }

        return { success: true, isMock: false };
      } catch (error) {
        console.error("❌ Storage asset removal failed:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete storage asset.",
        });
      }
    }),
});
